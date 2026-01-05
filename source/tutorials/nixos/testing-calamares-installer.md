(testing-calamares)=
# Testing NixOS Calamares installer changes

## What will you learn?

This tutorial shows how to test changes to the NixOS graphical installer (Calamares) using QEMU virtual machines.

## What do you need?

- A working [Nix installation](<install-nix>) on Linux
- Basic familiarity with the command line
- About 20GB of free disk space for the ISO and test disk images

## Introduction

The NixOS graphical installer uses [Calamares](https://calamares.io/), a distribution-independent installer framework.
When contributing changes to the installer configuration in nixpkgs, you need to test that the installation process works correctly.

This tutorial covers testing both BIOS (legacy) and UEFI boot modes with various filesystem configurations.

## Building the installer ISO

First, build the Calamares GNOME installation medium from your nixpkgs checkout:

```shell-session
$ nix-build '<nixpkgs/nixos>' \
    -A config.system.build.isoImage \
    -I nixos-config=nixos/modules/installer/cd-dvd/installation-cd-graphical-calamares-gnome.nix \
    -I nixpkgs=.
```

This builds the ISO image and creates a `result` symlink pointing to it.

:::{note}
Building the ISO can take a while depending on your hardware and whether binary caches are available.
:::

## Setting up the test environment

Create a virtual disk image for testing:

```shell-session
$ qemu-img create -f qcow2 test-disk.qcow2 20G
```

This creates a 20GB sparse disk image that only uses actual disk space as data is written.

## Testing BIOS boot with GRUB

Launch the installer with traditional BIOS firmware:

```shell-session
$ qemu-system-x86_64 \
    -enable-kvm \
    -m 4G \
    -drive file=test-disk.qcow2,format=qcow2 \
    -cdrom result/iso/*.iso \
    -boot d
```

The `-enable-kvm` flag enables hardware acceleration for better performance.
You can increase `-m 4G` if you have more RAM available.

## Testing UEFI boot with systemd-boot

UEFI testing requires OVMF firmware files.
First, prepare the UEFI variable store:

```shell-session
$ cp /run/libvirt/nix-ovmf/edk2-x86_64-vars.fd edk2-vars.fd
```

Then launch with UEFI firmware:

```shell-session
$ qemu-system-x86_64 \
    -enable-kvm \
    -m 4G \
    -drive if=pflash,format=raw,readonly=on,file=/run/libvirt/nix-ovmf/edk2-x86_64-code.fd \
    -drive if=pflash,format=raw,file=edk2-vars.fd \
    -drive file=test-disk.qcow2,format=qcow2 \
    -cdrom result/iso/*.iso \
    -boot d
```

:::{note}
The OVMF firmware paths may vary depending on your system.
On NixOS you can get the paths with `nix-build '<nixpkgs>' -A OVMF.fd`.
:::

## What to test

For installer changes, test the following scenarios:

**Filesystem options**

Run through the installer with each filesystem type your changes affect.
Common options include ext4, xfs, f2fs and btrfs.

**Boot modes**

Test both BIOS and UEFI installations since they use different bootloaders (GRUB vs systemd-boot).

**Verification**

After installation completes and the system reboots, verify the partition layout:

```shell-session
$ df -hT
```

For btrfs installations, check that subvolumes are created correctly:

```shell-session
$ btrfs subvolume list /
```

## Cleaning up between tests

To start fresh with a new disk image:

```shell-session
$ rm test-disk.qcow2
$ qemu-img create -f qcow2 test-disk.qcow2 20G
```

## Next steps

- [](integration-testing-vms)
- [](bootable-iso-image)
