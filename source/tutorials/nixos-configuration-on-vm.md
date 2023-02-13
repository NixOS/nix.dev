(nixos-vms)=

# NixOS virtual machines

One of the most important features of NixOS is the ability to configure the entire system declaratively, including packages to be installed, services to be run, as well as other settings and options.

NixOS configurations can be used to test and use NixOS using a virtual machine, independent of an installation on a "bare metal" computer.

:::{important}
A NixOS configuration is a Nix language function following the [NixOS module](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) convention. 
:::

## What will you learn?

This tutorial serves as an introduction creating NixOS virtual machines.
Virtual machines are a practical tool for debugging NixOS configurations.

## What do you need?

- A working [Nix installation](https://nixos.org/manual/nix/stable/installation/installation.html) on Linux, or [NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-installation)
- Basic knowledge of the [Nix language](reading-nix-language)

## Starting from the default NixOS configuration

In this tutorial you will use the default configuration that is shipped with NixOS.[^nixosconf]
[^nixosconf]: This [configuration template](https://github.com/NixOS/nixpkgs/blob/b4093a24a868708c06d93e9edf13de0b3228b9c7/nixos/modules/installer/tools/tools.nix#L122-L226) is used.

:::{admonition} NixOS

On NixOS, use the `nixos-generate-config` command to create a configuration file that contains some useful defaults and configuration suggestions.
By default, the configuration file is located at `/etc/nixos/configuration.nix` to avoid overwriting this file you have to specify the output directory.
Create a NixOS configuration in your working directory:

```shell-session
nixos-generate-config --dir ./
```

In the working directory you will then find two files: `configuration.nix` and `hardware-configuration.nix`.

`hardware-configuration.nix` is specific to the hardware `nix-generate-config` is being run on.
You can ignore that file for this tutorial because it has no effect inside a virtual machine.

The `configuration.nix` file contains various suggestions and comments for the initial setup of a desktop computer.
:::

The default configuration of NixOS without comments is:

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

To be able to log in add the following lines to the returned attribute set:

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

:::{admonition} NixOS
On NixOS your configuration generated using `nix-generate-config` contains the user configuration commented out.
:::

Additionally, you need to specify a password for this user.
For the purpose of demonstration only, you specify an insecure, plain text password by adding the `initialPassword` option to the user configuration:[^password]

[^password]: Warning: Do not use plain text passwords outside of this example unless you know what you are doing. See [`initialHashedPassword`] or [`ssh.authorizedKeys`] for more secure alternatives.

```nix
initialPassword = "testpw";
```

This tutorial focuses on testing NixOS configurations on a virtual machine.
Therefore you will remove the reference to `hardware-configuration.nix`:

```diff
-  imports =  [ ./hardware-configuration.nix ];
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

  system.stateVersion = "22.11";
}
```

## Creating a QEMU based virtual machine using a configuration

A virtual machine is created with the `nix-build` command.

To select `configuration.nix` in the working directory, specify the configuration file as an argument:

```shell-session
nix-build '<nixpkgs/nixos>' -A vm \
-I nixpkgs=channel:nixos-22.11 \
-I nixos-config=./configuration.nix
```

This command builds the attribute `vm` using the version of Nixpkgs as using the [short form for channels](https://nixos.org/manual/nix/stable/command-ref/opt-common.html#env-NIX_PATH) and using the NixOS configuration as specified in the relative path.

<details><summary> Detailed explanation </summary>

The first optional argument of [nix-build](https://nixos.org/manual/nix/stable/command-ref/nix-build.html) is a path to the derivation that you want to build.
By using `'<nixpkgs>'` you use a named search path that can be defined using the [`NIX_PATH` environment variable](https://nixos.org/manual/nix/stable/command-ref/env-common.html#env-NIX_PATH) or the `-I` option.
To build the virtual machine attribute you want to make use of the attributes provided by NixOS in the Nixpkgs, therefore you use `'<nixpkgs/nixos>'`.
The [-I](https://nixos.org/manual/nix/stable/command-ref/opt-common.html#opt-I) option allows you to set search paths.
In this example, you use it to explicitly set `nixpkgs` to refer to a specific version of NixOS and to set `nix-config` to the configuration.nix file in your current folder.
The [-A](https://nixos.org/manual/nix/stable/command-ref/opt-common.html#opt-attr) option allows you to specify which attribute to build.
To build the virtual machine, you choose the attribute `vm`.
The `vm` attribute is inhereted from `eval.config.system.build` as defined in the [nixos/default.nix](https://github.com/NixOS/nixpkgs/blob/7c164f4bea71d74d98780ab7be4f9105630a2eba/nixos/default.nix#L19).

:::{admonition} NixOS
On NixOS you usually have a `$NIX_PATH` environment variable set up. You can use your current version of nixpkgs to build the virtual machine with this simpler command:[^nixosrebuild]
```shell-session
nix-build '<nixpkgs/nixos>' -A vm -I nixos-config=./configuration.nix
```
:::

</details>

[^nixosrebuild]: On NixOS you can create a virtual machine using `nixos-rebuild build-vm -I nixos-config=./configuration.nix`, which wraps the original command. its usage is mentioned [here](https://nixos.org/manual/nixos/stable/#sec-changing-config).

## Running the virtual machine

The previous command creates a link with the name `result` in the working directory.
It links to the folder that contains the virtual machine.

```shell-session
ls -R ./result
```

```console
    result:
    bin  system

    result/bin:
    run-nixos-vm
```

To run the virtual machine, execute:

```shell-session
./result/bin/run-nixos-vm
```

This command opens a window that shows the boot process of the virtual machine and ends at the `gdm` login screen where you can log in as `alice` with the password `testpw`.

Running the virtual machine will create a `nixos.qcow2` file in the folder from which you start the virtual machine.
This disk image file contains the dynamic state of the virtual machine.
It can interfere with debugging as it keeps the state of previous runs, for example the user password.
You should delete this file when you change the configuration.

# References

- Nix manual: [`nix-build` man page](https://nixos.org/manual/nix/stable/command-ref/nix-build.html).
- Nix manual: [common cli options](https://nixos.org/manual/nix/stable/command-ref/opt-common.html).
- Nix manual: [`NIX_PATH` environment variable](https://nixos.org/manual/nix/stable/command-ref/env-common.html#env-NIX_PATH).
- NixOS Manual: [NixOS Configuration](https://nixos.org/manual/nixos/stable/index.html#ch-configuration).
- NixOS Manual: [Modules](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules).
- NixOS Manual Reference: [Options](https://nixos.org/manual/nixos/stable/options.html).
- NixOS Manual: [NixOS cli](https://nixos.org/manual/nixos/stable/#sec-changing-config).
- Wiki entry: [nixos-rebuild build-vm](https://nixos.wiki/wiki/NixOS:nixos-rebuild_build-vm).
- Source code: [configuration template](https://github.com/NixOS/nixpkgs/blob/b4093a24a868708c06d93e9edf13de0b3228b9c7/nixos/modules/installer/tools/tools.nix#L122-L226).
- Source code: [vm attribute](https://github.com/NixOS/nixpkgs/blob/master/nixos/default.nix).
