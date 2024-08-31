---
myst:
  html_meta:
    "description lang=en": "Provisioning remote machines"
    "keywords": "Nix, deployment, remote, provisioning, nixos-anywhere, disko, partitioning, installation"
---

# Provisioning remote machines via SSH

It is possible to replace any Linux installation with a NixOS configuration on running systems using [`nixos-anywhere`] and [`disko`].

[`nixos-anywhere`]: https://nix-community.github.io/nixos-anywhere/
[`disko`]: https://github.com/nix-community/disko

## Requirements

For a successful unattended installation, ensure for the *target machine* that:

- It is a QEMU virtual machine running Linux
  - With [`kexec`](https://en.wikipedia.org/wiki/Kexec) support
  - On the `x86-64` or `aarch64` instruction set architecture (ISA)
  - With at least 1 GB of RAM

  This may also be a live system booted from USB, such as the [NixOS installer](https://nixos.org/download/#download-nixos-accordion).

- The IP address is configured automatically with DHCP
- You can login via SSH
  - With public key authentication (prefered), or password
  - As user `root` or another user with `sudo` permissions

The *local machine* only needs a working [Nix installation](install-nix).

We call the *target machine* `target-machine` in this tutorial.
Replace it with the actual hostname or IP address.

## Prepare the environment

Create a new project directory and enter it with your shell:

```shell-session
mkdir remote
cd remote
```

[Specify dependencies](dependency-management-npins) on `nixpkgs`, `disko`, and `nixos-anywhere`:

```shell-session
$ nix-shell -p npins
[nix-shell:remote]$ npins init
[nix-shell:remote]$ npins add github nix-community disko
[nix-shell:remote]$ npins add github nix-community nixos-anywhere
```

Create a new file `shell.nix` which provides all needed tooling using the pinned dependencies:

```{code-block} nix
let
  sources = import ./npins;
  pkgs = import sources.nixpkgs {};
in

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    npins
    nixos-anywhere
    nixos-rebuild
  ];
  shellHook = ''
    export NIX_PATH="nixpkgs=${sources.nixpkgs}:nixos-config=$PWD/configuration.nix"
  '';
}
```

Now exit the temporary environment and enter the newly specified one:

```shell-session
[nix-shell:remote]$ exit
$ nix-shell
```

This shell environment is ready to use well-defined versions of Nixpkgs with `nixos-anywhere` and `nixos-rebuild`.

:::{important}
Run all following commands in this environment.
:::

## Create a NixOS configuration

The new NixOS configuration will consist of the general system configuration and a disk layout specification.

The disk layout in this example describes a single disk with a [master boot record](https://en.wikipedia.org/wiki/Master_boot_record) (MBR) and [EFI system partition](https://en.wikipedia.org/wiki/EFI_system_partition) (ESP) partition, and a root file system that takes all remaining available space.
It will work on both EFI and BIOS systems.

Create a new file `single-disk-layout.nix` with the disk layout specification:

{lineno-start=1}
```nix
{ lib, ... }:

{
  disko.devices.disk.main = {
    type = "disk";
    content = {
      type = "gpt";
      partitions = {
        MBR = {
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

Create the file `configuration.nix`, which imports the disk layout definition and specifies which disk to format:

:::{tip}
If you don't know the target disk's device identifier, list all devices on the *target machine* with `lsblk`:

```shell-session
$ ssh target-machine lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   256G  0 disk
├─sda1   8:1    0 248.5G  0 part /nix/store
│                                /
└─sda2   8:2    0   7.5G  0 part [SWAP]
sr0     11:0    1  1024M  0 rom
```

In this example, the disk name is `sda`.
The block device path is then `/dev/sda`.
Note that value for later.
:::

{lineno-start=1}
```nix
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

:::{important}
Replace `/dev/sda` with your disk block device path.

Replace the `<your SSH key here>` string with the SSH public key that you want to use for future logins as user `root`.
:::

:::{dropdown} Detailed explanation

The `diskDevice` variable in the `let` block defines the path of the disk block device:

{lineno-start=3 emphasize-lines="2"}
```nix
let
  diskDevice = "/dev/sda";
  sources = import ./npins;
in
```

It is used to set the target for the partitioning and formatting as described in the disk layout specification.
It is also used in the boot loader configuration to make it bootable on both legacy BIOS as well as UEFI systems:

{lineno-start=14 emphasize-lines="1,4"}
```nix
  disko.devices.disk.main.device = diskDevice;

  boot.loader.grub = {
    devices = [ diskDevice ];
    efiSupport = true;
    efiInstallAsRemovable = true;
  };
```

The `qemu-guest.nix` module makes this system compatible for running inside a QEMU virtual machine:

{lineno-start=8 emphasize-lines="2"}
```nix
  imports = [
    (modulesPath + "/profiles/qemu-guest.nix")
    (sources.disko + "/module.nix")
    ./single-disk-layout.nix
  ];
```

From a disk layout specification, the `disko` library generates a partitioning script and the portion of the NixOS configuration that mounts the partitions accordingly at boot time.
The first line imports the library, the second line applies the disk layout:

{lineno-start=8 emphasize-lines="3,4"}
```nix
  imports = [
    (modulesPath + "/profiles/qemu-guest.nix")
    (sources.disko + "/module.nix")
    ./single-disk-layout.nix
  ];
```
:::

## Test the disk layout

Check that the disk layout is valid:

```shell-session
nix-build -E "((import <nixpkgs> {}).nixos [ ./configuration.nix ]).installTest"
```

This command runs the complete installation in a virtual machine by building a derivation in the `installTest` attribute provided by the `disko` module.

## Deploy the system

To deploy the system, build the configuration and the corresponding disk formatting script, and run `nixos-anywhere` using the results:

:::{important}
Replace `target-host` with the hostname or IP address of your *target machine*.
:::

```shell-session
toplevel=$(nixos-rebuild build --no-flake)
diskoScript=$(nix-build -E "((import <nixpkgs> {}).nixos [ ./configuration.nix ]).diskoScript")
nixos-anywhere --store-paths "$diskoScript" "$toplevel" root@target-host
```

:::{note}
If you don't have public key authentication:
Set the environment variable `SSH_PASS` to your password then append the `--env-password` flag to the `nixos-anywhere` command.
:::

`nixos-anywhere` will now log into the target system, partition, format, and mount the disk, and install the NixOS configuration.
Then, it reboots the system.

## Update the system

To update the system, run `npins` and re-deploy the configuration:

```shell-session
npins update nixpkgs
nixos-rebuild switch --no-flake --target-host root@target-host
```

`nixos-anywhere` is not needed any more, unless you want to change the disk layout.


# Next steps

- [](binary-cache-setup)
- [](post-build-hooks)

## References

- [`nixos-anywhere` project page][`nixos-anywhere`]
- [`disko` project repository][`disko`]
- [Collection of disk layout examples](https://github.com/nix-community/disko/tree/master/example)
