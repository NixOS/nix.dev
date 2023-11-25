---
myst:
  html_meta:
    "description lang=en": "Installing NixOS on a Raspberry Pi"
    "keywords": "Raspberry Pi, rpi, NixOS, installation, image, tutorial"
---


# Installing NixOS on a Raspberry Pi

This tutorial assumes you have a [Raspberry Pi 4 Model B with 4GB RAM](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/).

Before starting this tutorial, make sure you have
[all the necessary hardware](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/1):

- HDMI cable/adapter.
- 8GB+ SD card.
- SD card reader (in case your machine doesn't have an SD slot).
- Power cable for your Raspberry Pi.
- USB keyboard.

:::{note}
This tutorial was written for the Raspberry Pi 4B. Using a previously supported model like the 3B or 3B+ is possible with some modifications to this tutorial.
:::

## Booting NixOS live image

:::{note}
Booting from USB may require an EEPROM firmware upgrade. This tutorial boots from an SD card to avoid such hiccups.
:::

To prepare the AArch64 image on another device with Nix, run the following commands:

```shell-session
$ nix-shell -p wget zstd

[nix-shell:~]$ wget https://hydra.nixos.org/build/226381178/download/1/nixos-sd-image-23.11pre500597.0fbe93c5a7c-aarch64-linux.img.zst
[nix-shell:~]$ unzstd -d nixos-sd-image-23.11pre500597.0fbe93c5a7c-aarch64-linux.img.zst
[nix-shell:~]$ dmesg --follow
```

:::{note}
You can download a recent image from [Hydra](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.sd_image.aarch64-linux),
clicking on the latest successful build (marked with a green checkmark), and copying the link to the build product image.
:::

:::{note}
It may be more convenient to use a software like [Etcher](https://www.balena.io/etcher/) to flash the image to your SD card if you are on a system where it's available.
:::

Your terminal should be printing kernel messages as they come in.

Plug in your SD card and your terminal should print what device it got assigned, for example `/dev/sdX`.

Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop `dmesg --follow`.

Copy NixOS to your SD card by replacing `sdX` with the name of your device in the following command:

```console
[nix-shell:~]$ sudo dd if=nixos-sd-image-23.11pre500597.0fbe93c5a7c-aarch64-linux.img of=/dev/sdX bs=4096 conv=fsync status=progress
```

Once that command exits, **move the SD card into your Raspberry Pi and power it on**.

You should be greeted with a fresh shell!

In case the image doesn't boot, it's worth [updating the firmware](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#bootloader_update_stable) and booting the image again.

## Getting internet connection

Run `sudo -i` to get a root shell for the rest of the tutorial.

At this point you'll need an internet connection. If you can use an ethernet cable, plug it in and skip to the next section.

If you're connecting to wifi, run `iwconfig` to find the name of your wireless network interface. If it's `wlan0`, replace `SSID` and `passphrase` with your data and run:

```shell-session
# wpa_supplicant -B -i wlan0 -c <(wpa_passphrase 'SSID' 'passphrase') &
```

Once you see in your terminal that connection is established, run `host nixos.org` to check that the DNS resolves correctly.

In case you've made a typo, run `pkill wpa_supplicant` and start over.

## Updating firmware

To benefit from updates and bug fixes from the vendor, we'll start by updating Raspberry Pi firmware:

```shell-session
# nix-shell -p raspberrypi-eeprom
# mount /dev/disk/by-label/FIRMWARE /mnt
# BOOTFS=/mnt FIRMWARE_RELEASE_STATUS=stable rpi-eeprom-update -d -a
```

## Installing and configuring NixOS

Now we'll install NixOS with our own configuration, here creating a `guest` user and enabling the SSH daemon.

In the `let` binding below, change the value of the `SSID` and `SSIDpassword` variables to the `SSID` and `passphrase` values you used previously:

```nix
{ config, pkgs, lib, ... }:

let
  user = "guest";
  password = "guest";
  SSID = "mywifi";
  SSIDpassword = "mypassword";
  interface = "wlan0";
  hostname = "myhostname";
in {

  boot = {
    kernelPackages = pkgs.linuxKernel.packages.linux_rpi4;
    initrd.availableKernelModules = [ "xhci_pci" "usbhid" "usb_storage" ];
    loader = {
      grub.enable = false;
      generic-extlinux-compatible.enable = true;
    };
  };

  fileSystems = {
    "/" = {
      device = "/dev/disk/by-label/NIXOS_SD";
      fsType = "ext4";
      options = [ "noatime" ];
    };
  };

  networking = {
    hostName = hostname;
    wireless = {
      enable = true;
      networks."${SSID}".psk = SSIDpassword;
      interfaces = [ interface ];
    };
  };

  environment.systemPackages = with pkgs; [ vim ];

  services.openssh.enable = true;

  users = {
    mutableUsers = false;
    users."${user}" = {
      isNormalUser = true;
      password = password;
      extraGroups = [ "wheel" ];
    };
  };

  hardware.enableRedistributableFirmware = true;
  system.stateVersion = "23.11";
}
```

To save time on typing the whole configuration, download it:

```shell-session
# curl -L https://tinyurl.com/tutorial-nixos-install-rpi4 > /etc/nixos/configuration.nix
```

:::{note}
Credentials you write into a NixOS configuration will be stored in plain text in your `/nix/store` when that configuration is built.

If you **don't** want this to happen, you can enter your credentials at a console or use one of the community's solutions for encrypted secrets.
:::

Due to the way the `nixos-sd-image` is designed, NixOS is actually *already installed* at this point, so we only need to `nixos-rebuild` with our new configuration:

```shell-session
# nixos-rebuild boot
# reboot
```

If your system doesn't boot, select the oldest configuration in the bootloader menu to get back to the live image and start over.

## Making changes

It booted, congratulations!

To make further changes to the configuration, [search through NixOS options](https://search.nixos.org/options),
edit `/etc/nixos/configuration.nix`, and update your system:

```shell-session
$ sudo -i
# nixos-rebuild switch
```

## Next steps

- Once you have a working OS, try upgrading it with `nixos-rebuild switch --upgrade` to install more recent package versions, and reboot to the old configuration if something broke.
- To enable hardware acceleration for a nice graphical desktop experience, you can enable the [`nixos-hardware` module](https://github.com/nixos/nixos-hardware) by adding the following to your configuration:
  ```nix
  imports = [
    "${builtins.fetchGit { url = "https://github.com/NixOS/nixos-hardware.git"; }}/raspberry-pi/4"
  ];
  ```
  :::{warning}
  If you encountered the following error while running `nixos-rebuild switch` after adding this import statement:

  ```
  fatal: Couldn't find remote ref master
  ```
  
  ensure that you have `git` available in your current shell first. You can do this by creating an ephemeral shell with `nix-shell -p git`. Alternatively, if you have already added `git` to `environment.systemPackages` and applied the change to your NixOS, it should work fine as well. (This was suggested in [this GitHub Issue comment](https://github.com/NixOS/nix/issues/1923#issuecomment-1665509352).)
  :::
- To tweak bootloader options affecting hardware, [see `config.txt` options](https://www.raspberrypi.org/documentation/configuration/config-txt/). You can change these options by running `mount /dev/disk/by-label/FIRMWARE /mnt` and opening `/mnt/config.txt`.
