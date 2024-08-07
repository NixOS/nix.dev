---
myst:
  html_meta:
    "description lang=en": "Provisioning remote machines"
    "keywords": "Nix, deployment, remote, provisioning, nixos-anywhere, disko, partitioning, installation"
---

(provisioning-remote-machines)=
# Provisioning remote machines

The [`nixos-anywhere`][nixos-anywhere] tool and the [`disko`][disko] nix library can automatically repartition the disk of a running NixOS or other GNU/Linux system and install a new NixOS configuration to a target machine over network.

## Requirements

For a successful unattended installation, ensure the following facts on the *target machine*:

- It already runs any GNU/Linux, not necessarily NixOS
  - This may be a live system booted from USB
- The system architecture is x86-64 or aarch64
- It has at least 1 GB of RAM
- You can login via SSH
  - with public key authentication (prefered), or password
  - either as user `root` or another user with sudo rights
- [`kexec`][kexec] support is not disabled

The *local machine* only needs a working nix installation.

## Gathering machine facts

Note down the IP or hostname of the system.

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

## Prepare tool environment

Create a new project folder and enter it with your shell.
Run the following commands:

```shell-session
nix-shell -p npins
npins init
npins add github nix-community disko
npins add github nix-community nixos-anywhere
```

These commands create a new data structure in the project folder that contains pins of nixpkgs, disko, and nixos-anywhere.

Create a new file `shell.nix`:

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

Now exit the previously started nix shell and enter the new one:

```shell-session
exit
nix-shell
```

This shell environment is ready to use well-defined versions of nixpkgs with `nixos-anywhere` and `nixos-rebuild`.
Execute all following commands in this shell.

## Create target configuration

The system configuration consists of a disk layout description that describes the partitions, formats, and mount points, and the main system configuration.

Create a new file `single-disk-layout.nix`:

```{code-block} nix
{ lib, ... }:

{
  disko.devices.disk.main = {
    device = lib.mkDefault "/dev/sda";
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

This disk layout describes a single disk with a boot and ESP partition and a root file system that takes all available space.
It will work on both EFI and legacy BIOS systems.

Create the system configuration file `configuration.nix`:

```{code-block} nix
{ modulesPath, ... }:

let
  diskDevice = "/dev/sda";
  sources = import ./npins;
in
{
  imports = [
    "${modulesPath}/installer/scan/not-detected.nix"
    "${modulesPath}/profiles/qemu-guest.nix"
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

If you like, you can add more options to the configuration now or after the initial deployment.

## Deploy the system

To deploy the system, run the following commands in the nix shell.
Replace `target-host` with the IP or hostname of your target system:

:::{note}
If you don't have public key authentication:
Set the environment variable `SSH_PASS` to your password then append the `--env-password` flag to `nixos-anywhere`.
:::

```shell-session
toplevel=$(nixos-rebuild build --no-flake)
diskoScript=$(nix-build -E "((import <nixpkgs> {}).nixos [ ./configuration.nix ]).diskoScript"
nixos-anywhere --store-paths "$diskoScript" "$toplevel" root@target-host
```

`nixos-anywhere` will now log into the target system, partition, format, and mount the disk, and install the NixOS configuration.
Then, it reboots the system.

## Outlook

The system can be switched to new NixOS configurations like normal NixOS systems.
`nixos-anywhere` is not needed for redeployments, unless you want to change the disk layout.

To do this, either copy the project folder content to `/etc/nixos` on the target machine.
Then, you can run `nixos-rebuild switch` as `root` on the target machine.

Otherwise, if you want to redeploy the system from remote, run this command from the nix shell:

```shell-session
nixos-rebuild switch --no-flake --target-host root@target-host
```

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
[kexec]: https://en.wikipedia.org/wiki/Kexec
