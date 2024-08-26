---
myst:
  html_meta:
    "description lang=en": "Provisioning remote machines"
    "keywords": "Nix, deployment, remote, provisioning, nixos-anywhere, disko, partitioning, installation"
---

# Provisioning remote machines

It is possible to replace any Linux installation with a NixOS configuration on running systems.
The [`nixos-anywhere`][nixos-anywhere] tool and the [`disko`][disko] nix library are capable of doing this.

## Requirements

For a successful unattended installation, ensure the following facts on the *target machine*:

- It is a Qemu VM that runs Linux
  - This may be a live system booted from USB (e.g. [NixOS Live System](https://nixos.org/download/#download-nixos-accordion))
  - The system architecture is x86-64 or aarch64
  - [`kexec`](https://en.wikipedia.org/wiki/Kexec) support is not disabled
  - It has at least 1 GB of RAM
- You can login via SSH
  - with public key authentication (prefered), or password
  - either as user `root` or another user with sudo rights

The *local machine* only needs a working nix installation.

## Gathering machine facts

If you don't know the name of the disk's block device, run this command on the target machine:

```shell-session
$ lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   256G  0 disk
├─sda1   8:1    0 248.5G  0 part /nix/store
│                                /
└─sda2   8:2    0   7.5G  0 part [SWAP]
sr0     11:0    1  1024M  0 rom
```

In this example, the disk name is `sda`.
The block device path is then `/dev/sda`.
Note the value of your target machine down for later.

## Preparing the environment

Create a new project folder and enter it with your shell.
Pin the dependencies `nixpkgs`, `disko`, and `nixos-anywhere` by running these commands:

```shell-session
nix-shell -p npins
npins init
npins add github nix-community disko
npins add github nix-community nixos-anywhere
```

Create a new file `shell.nix` which provides all needed tooling using the pinned dependencies:

```{code-block} nix
let
  sources = import ./npins;
  pkgs = import sources.nixpkgs {};
in

pkgs.mkShell {
  nativeBuildInputs = [
    pkgs.npins
    pkgs.nixos-anywhere
    pkgs.nixos-rebuild
  ];
  shellHook = ''
    export NIX_PATH="nixpkgs=${sources.nixpkgs}:nixos-config=$PWD/configuration.nix"
  '';
}
```

Now exit the previously started nix shell environment and enter the new one:

```shell-session
exit
nix-shell
```

This shell environment is ready to use well-defined versions of nixpkgs with `nixos-anywhere` and `nixos-rebuild`.
Execute all following commands in this environment.

## Creating a NixOS configuration

The new NixOS configuration will consist of the general system configuration and a disk layout specification.

The disk layout in this example describes a single disk with a boot and ESP partition and a root file system that takes all available space.
It will work on both EFI and legacy BIOS systems.

Create a new file `single-disk-layout.nix` with the disk layout specification:

```{code-block} nix
{ lib, ... }:

{
  disko.devices.disk.main = {
    type = "disk";
    content = {
      type = "gpt";
      partitions = {
        boot = {
          priority = 0;
          size = "1M";
          type = "EF02";
        };
        ESP = {
          priority = 1;
          size = "500M";
          type = "EF00";
          content = {
            type = "filesystem";
            format = "vfat";
            mountpoint = "/boot";
          };
        };
        root = {
          priority = 2;
          size = "100%";
          content = {
            type = "filesystem";
            format = "ext4";
            mountpoint = "/";
          };
        };
      };
    };
  };
}
```

Create the system configuration file `configuration.nix`:

```{code-block} nix
{ modulesPath, ... }:

let
  diskDevice = "/dev/sda";
  sources = import ./npins;
in
{
  imports = [
    (modulesPath + "/profiles/qemu-guest.nix")
    (sources.disko + "/module.nix")
    ./single-disk-layout.nix
  ];
  disko.devices.disk.main.device = diskDevice;
  boot.loader.grub = {
    devices = [ diskDevice ];
    efiSupport = true;
    efiInstallAsRemovable = true;
  };
  services.openssh.enable = true;

  users.users.root.openssh.authorizedKeys.keys = [
    "<your SSH key here>"
  ];

  system.stateVersion = "24.11";
}
```

Replace `/dev/sda` with your disk block device path.
Replace the `<your SSH key here>` string with the SSH public key that you want to use for future logins as user `root`.

This system configuration works with a Qemu VM as the target system.
If your target machine is not a Qemu VM, remove the import line with `qemu-guest.nix` and adapt the configuration accordingly.

:::{dropdown} Detailed explanation

The `diskDevice` variable in the `let` block defines the path of the disk block device.
It is used to set the target for the partitioning and formatting as described in the disk layout specification.
It is also used in the boot loader configuration to make it bootable on both legacy BIOS as well as UEFI systems.

```{code-block} nix
  diskDevice = "/dev/sda";
```

The `qemu-guest.nix` NixOS module sets NixOS configuration paths that make this system compatible to run inside a Qemu virtual machine.

```{code-block} nix
    (modulesPath + "/profiles/qemu-guest.nix")
```

The `disko` library consumes a disk layout specification and is able to generate both an automatic partitioning script and also the portion of the NixOS configuration that mounts the partitions accordingly at boot time.
The first line imports the library, the second line applies the disk layout:

```{code-block} nix
    (sources.disko + "/module.nix")
    ./single-disk-layout.nix
```

:::

## Deploying the system

To deploy the system, run the following commands in the nix shell.
Replace `target-host` with the IP or hostname of your target system:

:::{note}
If you don't have public key authentication:
Set the environment variable `SSH_PASS` to your password then append the `--env-password` flag to `nixos-anywhere`.
:::

```shell-session
toplevel=$(nixos-rebuild build --no-flake)
diskoScript=$(nix-build -E "((import <nixpkgs> {}).nixos [ ./configuration.nix ]).diskoScript")
nixos-anywhere --store-paths "$diskoScript" "$toplevel" root@target-host
```

`nixos-anywhere` will now log into the target system, partition, format, and mount the disk, and install the NixOS configuration.
Then, it reboots the system.

:::{note}
If you changed the disk layout, you can test if it generally works with this command, which runs the installation in a virtual machine:

```shell-session
nix-build -E "((import <nixpkgs> {}).nixos [ ./configuration.nix ]).installTest"
```
:::

## Updating the system

`nixos-anywhere` is not needed for redeployments, unless you want to change the disk layout.

To update the system, run:

```shell-session
npins update nixpkgs
nixos-rebuild switch --no-flake --target-host root@target-host
```

## References

- [`nixos-anywhere` project page][nixos-anywhere]
- [`disko` project repository][disko]

[nixos-anywhere]: https://nix-community.github.io/nixos-anywhere/
[disko]: https://github.com/nix-community/disko
