Installing NixOS on a Raspberry Pi
==================================

This tutorial assumes `Raspberry P 4 Model B with 4GB RAM <https://www.raspberrypi.org/products/raspberry-pi-4-model-b/>`_.

Before starting this tutorial, make sure you have 
`all necessary hardware <https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/1>`_:

- HDMI cable/adapter.
- 8GB+ SD card.
- SD card reader in case your machine doesn't have an SD slot.
- Power cable for your RPi.
- USB keyboard.

.. note:: 

  This tutorial was written for the Raspberry Pi 4B. Using a previous supported revision, like the 3B or 3B+, is possible with tweaks.


Booting NixOS live image
------------------------

.. note:: Booting from USB may require an EEPROM firmware upgrade. This tutorial boots from an SD card to avoid such hiccups.

Prepare the AArch64 image on your laptop:

.. code:: shell-session

  $ nix-shell -p wget zstd
  $ wget https://hydra.nixos.org/build/142828023/download/1/nixos-sd-image-21.05pre288297.8eed0e20953-aarch64-linux.img.zst
  $ unzstd -d nixos-sd-image-21.05pre288297.8eed0e20953-aarch64-linux.img.zst
  $ dmesg --follow

Your terminal should be printing kernel messages as they come in.

Plug in your SD card and your terminal should print what device it got assigned, for example ``/dev/sdX``.

Press ``ctrl-c`` to stop ``dmesg -w``.

Copy NixOS to your SD card by replacing ``sdX`` with the name of your device:

.. code:: shell-session 

  sudo dd if=nixos-sd-image-21.05pre288297.8eed0e20953-aarch64-linux.img of=/dev/sdX bs=4096 conv=fsync status=progress

Once that command exits, move the SD card into your RPi and power it on.

You should be greeted with a fresh shell!

Run ``sudo -i`` to get a root shell for the rest of the tutorial.


Getting internet connection
---------------------------

At this point we'll need internet connection. If you can use an ethernet cable, plug it in.

In case you're connecting to a wifi run ``iwconfig`` to see what is the name of your wireless
network interface. In case it's ``wlan0`` replace ``SSID`` and ``passphrase`` with your data and run:

.. code:: shell-session 

  $ wpa_supplicant -B -i wlan0 -c <(wpa_passphrase 'SSID' 'passphrase') &


Once you see in your terminal that connection is established, run ``host google.com`` to 
check that DNS resolves correctly.

In case you've made a typo, run ``pkill wpa_supplicant`` and start over.


Updating firmware
-----------------

To benefit from updates and bug fixes from the vendor, we'll start by updating RPi firmware:

.. code:: shell-session

  $ nix-shell -p raspberrypi-eeprom
  $ FIRMWARE_RELEASE_STATUS=stable rpi-eeprom-update -d -a

  
Installing NixOS 
----------------

For initial installation we'll install `XFCE <https://www.xfce.org/>`_ desktop environment
with user ``guest`` and SSH daemon.

.. code:: nix 

  { config, pkgs, lib, ... }:

  let
    user = "guest";
    password = "guest";
    SSID = "mywifi";
    SSIDpassword = "mypassword";
    interface = "wlan0";
    hostname = "myhostname";
  in {
    imports = ["${fetchTarball "https://github.com/domenkozar/nixos-hardware/archive/rpi4.tar.gz" }/raspberry-pi/4"];

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
      users.guest = {
        isNormalUser = true;
        password = password;
        extraGroups = [ "wheel" ];
      };
    };

    # video
    services.xserver = {
      enable = true;
      displayManager.lightdm.enable = true;
      desktopManager.xfce.enable = true;
      videoDrivers = [ "fbdev" ];
    };

    # audio
    hardware.pulseaudio.enable = true;
  }

To save time on typing the whole configuration, download it:

.. code:: shell-session

  $ curl -L https://tinyurl.com/nixos-rpi-tutorial-preview > /etc/nixos/configuration.nix 

At the top of `/etc/nixos/configuration.nix` there are a few variables that you want to configure,
most important being your wifi connection details, this time specified in declarative way.

Once you're ready to install NixOS:

.. code:: shell-session

  $ nixos-install --root /
  $ reboot

In case your system doesn't boot, select the oldest configuration in the bootloader menu to get back to live image and start over.


Making changes 
--------------

It booted, congratulations!

To make further changes to the configuration, `search through NixOS options <https://search.nixos.org/options>`_,
edit ``/etc/nixos/configuration.nix`` and update your system:

.. code:: shell-session 

  $ sudo -i
  $ nixos-rebuild switch
