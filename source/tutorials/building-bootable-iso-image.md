# Building a bootable ISO image

:::{note}
If you need to build images for a different platform, see [Cross compiling](https://github.com/nix-community/nixos-generators#cross-compiling).
:::

You may find that an official installation image lacks some hardware support.

The solution is to create `myimage.nix` to point to the latest kernel using the minimal installation ISO:

```nix
{ pkgs, modulesPath, lib, ... }: {
  imports = [
    "${modulesPath}/installer/cd-dvd/installation-cd-minimal.nix"
  ];

  # use the latest Linux kernel
  boot.kernelPackages = pkgs.linuxPackages_latest;

  # Needed for https://github.com/NixOS/nixpkgs/issues/58959
  boot.supportedFilesystems = lib.mkForce [ "btrfs" "reiserfs" "vfat" "f2fs" "xfs" "ntfs" "cifs" ];
}
```

Generate an ISO with the above configuration:

```shell-session
$ NIX_PATH=nixpkgs=https://github.com/NixOS/nixpkgs/archive/74e2faf5965a12e8fa5cff799b1b19c6cd26b0e3.tar.gz nix-shell -p nixos-generators --run "nixos-generate --format iso --configuration ./myimage.nix -o result"
```

Copy the new image to your USB stick by replacing `sdX` with the name of your device:

```shell-session
$ dd if=result/iso/*.iso of=/dev/sdX status=progress
$ sync
```

## Next steps

- Take a look at this [list of formats that generators support](https://github.com/nix-community/nixos-generators#supported-formats) to find your cloud provider or virtualisation technology.
