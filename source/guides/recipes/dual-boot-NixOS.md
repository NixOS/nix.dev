(dual-boot-nixos)=
# Dual boot NixOS
It is recommended to use Systemd boot over Grub bootloader.
This how to is a short introduction to `systemd bootloaded` options. To get a brief understanding of how it works.

## Target audience
A NixOS user that wants to make changes in boot, to set the `default` startup OS in Systemd boot.

## Purpose
When dual booting, it can be useful to know how to work with systemd boot.

## Steps
* **[Interrupt]** - On boot, you can halt the timer by changing item with your arrow keys, up or down.
* **[Help]** - You can press `F1` or `h` (for help) to get more information about what options you can do
* **[Default]** - To change the `default` boot, you can select the option that you want to default and press `d`, or if you want to clear the default boot, select the item that is the default, and press `d` once again to clear it.
* **[Edit/Rename]** - an item, using the `e` to edit an item. You can not edit the "Windows" item.
* **[Resolution]** - Change resolution by pressing `r` to find a resolution that is the best suited for you.
* **[Information]** - Print information about the boot item by pressing `p`

