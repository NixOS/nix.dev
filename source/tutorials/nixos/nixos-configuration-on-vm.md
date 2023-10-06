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
[^nixosconf]: This [configuration template](https://github.com/NixOS/nixpkgs/blob/4e0525a8cdb370d31c1e1ba2641ad2a91fded57d/nixos/modules/installer/tools/tools.nix#L122-L226) is used.

:::{admonition} NixOS

On NixOS, use the `nixos-generate-config` command to create a configuration file that contains some useful defaults and configuration suggestions.
By default, the configuration file is located at `/etc/nixos/configuration.nix`.
To avoid overwriting this file you have to specify the output directory.
Create a NixOS configuration in your working directory:

```shell-session
nixos-generate-config --dir ./
```

In the working directory you will then find two files:

1. `hardware-configuration.nix` is specific to the hardware `nix-generate-config` is being run on.
   You can ignore that file for this tutorial because it has no effect inside a virtual machine.

2. `configuration.nix` contains various suggestions and comments for the initial setup of a desktop computer.
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
      tree
    ];
  };
```

:::{admonition} NixOS
On NixOS your configuration generated using `nix-generate-config` contains this user configuration commented out.
:::

Additionally, you need to specify a password for this user.
For the purpose of demonstration only, you specify an insecure, plain text password by adding the `initialPassword` option to the user configuration:[^password]

[^password]: Warning: Do not use plain text passwords outside of this example unless you know what you are doing. See [`initialHashedPassword`](https://nixos.org/manual/nixos/stable/options.html#opt-users.extraUsers._name_.initialHashedPassword) or [`ssh.authorizedKeys`](https://nixos.org/manual/nixos/stable/options.html#opt-users.extraUsers._name_.openssh.authorizedKeys.keys) for more secure alternatives.

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
      tree
    ];
    initialPassword = "testpw";
  };

  system.stateVersion = "22.11";
}
```

## Creating a QEMU based virtual machine from a NixOS configuration

A NixOS virtual machine is created with the `nix-build` command:

```shell-session
nix-build '<nixpkgs/nixos>' -A vm \
-I nixpkgs=channel:nixos-22.11 \
-I nixos-config=./configuration.nix
```

This command builds the attribute `vm` from the `nixos-22.11` release of NixOS, using the NixOS configuration as specified in the relative path.

<details><summary> Detailed explanation </summary>

- The positional argument to [`nix-build`](https://nixos.org/manual/nix/stable/command-ref/nix-build.html) is a path to the derivation to be built.
  That path can be obtained from [a Nix expression that evaluates to a derivation](derivations).

  The virtual machine build helper is defined in NixOS, which is part of the [`nixpkgs` repository](https://github.com/NixOS/nixpkgs).
  Therefore we use the [lookup path](search-path-tutorial) `<nixpkgs/nixos>`.

- The [`-A` option](https://nixos.org/manual/nix/stable/command-ref/opt-common.html#opt-attr) specifies the attribute to pick from the provided Nix expression `<nixpkgs/nixos>`.

  To build the virtual machine, we choose the `vm` attribute as defined in [`nixos/default.nix`](https://github.com/NixOS/nixpkgs/blob/7c164f4bea71d74d98780ab7be4f9105630a2eba/nixos/default.nix#L19).

- The [`-I` option](https://nixos.org/manual/nix/stable/command-ref/opt-common.html#opt-I) prepends entries to the search path.

  Here we set `nixpkgs` to refer to a [specific version of Nixpkgs](ref-pinning-nixpkgs) and set `nix-config` to the `configuration.nix` file in the current directory.

:::{admonition} NixOS
On NixOS the `$NIX_PATH` environment variable is usually set up automatically, and there is also [a convenience command for building virtual machines](https://nixos.org/manual/nixos/stable/#sec-changing-config).
You can use the current version of `nixpkgs` to build the virtual machine like this:
```shell-session
nixos-rebuild build-vm -I nixos-config=./configuration.nix
```
:::

</details>

## Running the virtual machine

The previous command created a link with the name `result` in the working directory.
It links to the directory that contains the virtual machine.

```shell-session
ls -R ./result
```

```console
    result:
    bin  system

    result/bin:
    run-nixos-vm
```

Run the virtual machine:

```shell-session
./result/bin/run-nixos-vm
```

This command opens a window that shows the boot process of the virtual machine and ends at the `gdm` login screen where you can log in as `alice` with the password `testpw`.

Running the virtual machine will create a `nixos.qcow2` file in the current directory.
This disk image file contains the dynamic state of the virtual machine.
It can interfere with debugging as it keeps the state of previous runs, for example the user password.
You should delete this file when you change the configuration:

```shell-session
rm nixos.qcow2
```

## References

- NixOS Tests section in [NixOS manual](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests)
- [Nix manual: `nix-build`](https://nixos.org/manual/nix/stable/command-ref/nix-build.html).
- [Nix manual: common command-line options](https://nixos.org/manual/nix/stable/command-ref/opt-common.html).
- [Nix manual: `NIX_PATH` environment variable](https://nixos.org/manual/nix/stable/command-ref/env-common.html#env-NIX_PATH).
- [NixOS Manual: NixOS Configuration](https://nixos.org/manual/nixos/stable/index.html#ch-configuration).
- [NixOS Manual: Modules](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules).
- [NixOS Manual Reference: Options](https://nixos.org/manual/nixos/stable/options.html).
- [NixOS Manual: NixOS cli](https://nixos.org/manual/nixos/stable/#sec-changing-config).
- [Wiki entry: nixos-rebuild build-vm](https://nixos.wiki/wiki/NixOS:nixos-rebuild_build-vm).
- [NixOS source code: `configuration template` in `tools.nix`](https://github.com/NixOS/nixpkgs/blob/4e0525a8cdb370d31c1e1ba2641ad2a91fded57d/nixos/modules/installer/tools/tools.nix#L122-L226).
- [NixOS source code: `vm` attribute in `default.nix`](https://github.com/NixOS/nixpkgs/blob/master/nixos/default.nix).
