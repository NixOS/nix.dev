Building bootable ISO image
===========================


Often we're faced with the official installation image lacking some hardware support.

Create ``myimage.nix`` that will point the kernel to the latest using the minimal installation iso:

.. code:: nix 

  { pkgs, modulesPath, lib, ... }: {
    imports = [
      "${modulesPath}/installer/cd-dvd/installation-cd-minimal.nix"
    ];

    # use the latest Linux kernel
    boot.kernelPackages = pkgs.linuxPackages_latest;

    # Needed for https://github.com/NixOS/nixpkgs/issues/58959
    boot.supportedFilesystems = lib.mkForce [ "btrfs" "reiserfs" "vfat" "f2fs" "xfs" "ntfs" "cifs" ];
  }

Generate an ISO with the above configuration:

.. code:: shell-session

  $ nixos-generate -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/74e2faf5965a12e8fa5cff799b1b19c6cd26b0e3.tar.gz --format iso --configuration ./myimage.nix -o iso

Copy the new image to your USB stick by replacing ``sdX`` with the name of your device:

.. code:: shell-session

  $ dd if=iso/iso/*.iso of=/dev/sdX status=progress
  $ sync


Next steps
----------

- There are a bunch of `other formats that generators support <https://github.com/nix-community/nixos-generators#supported-formats>`_,
  for example different cloud providers or virtualization technologies

