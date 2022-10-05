(nixos-vms)=

# NixOS virtual machines

One of the most important features of NixOS is the ability to configure the entire system declaratively, including packages to be installed, services to be run, as well as other settings and options.

NixOS configurations can be used to test and use NixOS using a virtual machine, independent of an installation on a "bare metal" computer.

:::{.important}
A NixOS configuration is a Nix language function following the [NixOS module](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) convention. 
:::

## What will you learn?

This tutorial serves as an introduction creating NixOS virtual machines.
Virtual machines are a practical tool for debugging NixOS configurations.

## What do you need?

- A working [Nix installation](install-nix) or [NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-installation)
- Basic knowledge of the [Nix language](reading-nix-language)

## Starting from the default NixOS configuration

On NixOS, by default, the configuration file is located at `/etc/nixos/configuration.nix`.
For commands that use a configuration file, such as `nixos-rebuild`, the configuration file's path can be specified.
In this tutorial we use this strategy, because the goal is not to install or update the current NixOS, but to debug a specific configuration.

On NixOS, you can use the `nixos-generate-config` command to create a configuration file that contains some useful defaults and configuration suggestions.[^nixosconf]
You can create a NixOS configuration in your working directory:

[^nixosconf]: This [configuration template](https://github.com/NixOS/nixpkgs/blob/b4093a24a868708c06d93e9edf13de0b3228b9c7/nixos/modules/installer/tools/tools.nix#L122-L226) is used.

```shell-session
nixos-generate-config --dir ./
```

In the working directory you will then find two files: `configuration.nix` and `hardware-configuration.nix`.

`hardware-configuration.nix` is specific to the hardware `nix-generate-config` is being run on.
We can ignore that file for this tutorial because it has no effect inside a virtual machine.

The `configuration.nix` file contains various suggestions for the initial setup of a desktop computer.
Without comments the configuration file contains the following content:

```nix
{ config, pkgs, ... }:
{
  imports =  [ ./hardware-configuration.nix ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  services.xserver.enable = true;

  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  system.stateVersion = "22.05";
}
```

In this tutorial we focus on testing NixOS configurations on a virtual machine.
Therefore we will remove the reference to `hardware-configuration.nix`:

```diff
-  imports =  [ ./hardware-configuration.nix ];
```

Changes to the configuration need to be positioned inside the curly bracket.[^bracket]

[^bracket]: As a reminder `configuration.nix` contains a function that returns an [attribute set](https://nixos.org/manual/nix/stable/language/values.html#attribute-set) that follows the convention of a [module](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules).
In the attribute set you describe how you want your NixOS system configured.

To be able to log in, you must uncomment the section that specifies the user `alice`, or add the following lines:

```nix
  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    packages = with pkgs; [
      firefox
      thunderbird
    ];
  };
```

Additionally, you need to specify a password for this user.
For the purpose of demonstration only, we use specify an insecure, plain text password by adding the `initialPassword` option to the user configuration:[^password]

[^password]: Warning: Do not use plain text passwords outside of this example unless you know what you are doing. See [`initialHashedPassword`] or [`ssh.authorizedKeys`] for more secure alternatives.

```nix
initialPassword = "testpw";
```

The complete `configuration.nix` file now looks like this:

```nix
{ config, pkgs, ... }:
{
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  services.xserver.enable = true;

  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
    packages = with pkgs; [
      firefox
      thunderbird
    ];
    initialPassword = "testpw";
  };

  system.stateVersion = "22.05";
}
```

## Creating a QEMU based virtual machine using a configuration

A virtual machine is created with the `nix-build` command.

To select `configuration.nix` in the working directory, specify the configuration file as an argument:[^nixosrebuild]

[^nixosrebuild]: On NixOS you can create a virtual machine using `nixos-rebuild build-vm -I nixos-config=./configuration.nix`, which wraps the original command.

```shell-session
nix-build '<nixpkgs/nixos>' -A vm -I nixos-config=./configuration.nix
```


This command builds the attribute `vm` utilizing the version of Nixpkgs as specified in the environment variable `NIX_PATH` and using the NixOS configuration as specified in the relative path.

## Running the virtual machine

The previous command creates a link with the name `result` in the working directory.
It links to the folder that contains the virtual machine.

```shell-session
ls -R ./result
```

    result:
    bin  system

    result/bin:
    run-nixos-vm


To run the virtual machine, execute:

```shell-session
./result/bin/run-nixos-vm
```

This command opens a window that shows the boot process of the virtual machine and ends at the `gdm` login screen where you can log in as `alice` with the password `testpw`.

Running the virtual machine will create a `nixos.qcow2` file in the folder from which you start the virtual machine.
This disk image file contains the dynamic state of the virtual machine.
It can interfere with debugging as it keeps the state of previous runs, for example the user password.
You should delete this file when you change the configuration.



[^nixpkgs]: Nixpkgs is the largest repository of Nix packages and NixOS modules.
The repository is hosted on GitHub and maintained by the community, with official backing from the NixOS Foundation.


