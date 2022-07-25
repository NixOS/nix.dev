# NixOS Configuration debugging using virtual machines

Draft 2022.08.11

## What will you learn?

One of the most important features of NixOS is the ability to configure the entire system declaratively.
This is done using a configuration file that specifies the entire system state, including the packages to be installed and the various system settings and options.[^wikinixos]
This guide introduces the functionality of Nix Package Manager to test and debug NixOS configurations independent of a working NixOS installation.
It serves as an introduction to Nix Package Manager's ability to create virtualized instances of NixOS.

## What do you need?

<!-- todo links -->

- Basic knowledge of the Nix language.
- A working installation of Nix Package Manager or NixOS.
- nixpkgs path set in NIX_PATH 

## What is a NixOS configuration

A NixOS configuration is a declarative definition of a Linux installation that specifies which packages to install and how to configure them.
It is written in the Nix language and uses the Nixpkgs repository, its library, packages and modules.
<!-- [in my dream such a blob would appear as mediawiki style page-preview at mentions of Nix language]: The Nix expression language is a pure, lazy, functional language. Its main purpose is to describe packages, compositions of packages, and variability within packages.[^nixlang] -->
<!-- todo links: ancors to introductions to library packages and modules are currently not in the manuals -->
A NixOS configuration is a file that contains a function that is structured acording to the module<!-- todo link -->  convention.
A NixOS configuration is a function that follows the convention of a module<!-- todo link to reference-->. <!-- remove one version -->

<!-- [old version 2022.08.10 should be deleted] -->
<!-- The Git repository Nixpkgs provides the necessary infrastructure and information needed to specify a NixOS configuration[^nixpkgs]. -->
<!-- Nixpkgs contains a library, packages, and modules. -->
<!-- The library provides the functional infrastructure to conveniently create packages. -->
<!-- The packages defined in Nixpkgs provide build scripts needed to build software. -->
<!-- The NixOS modules are a way to configure the system. [previous formulation] provide a configuration infrastructure to generate the system's configuration files. -->

## Starting from default NixOS Configuration

On NixOS, the configuration file is normally located at `/etc/nixos/configuration.nix`.
A different location can be specified using the environment variable `$NIX_PATH`.
For CLI commands that use a configuration, the file path can be specified.
In this guide this strategy is preferred because the goal is not to install or update NixOS, but to debug a configuration.

On NixOS, you can use the `nixos-generate-config` command to create a configuration file that contains some useful defaults and configuration suggestions [^nixosconf].
You can create a NixOS configuration in your working directory:
```shell-session
nixos-generate-config --dir ./
```

In the working directory you will find two files: `configuration.nix` and `hardware-configuration.nix`.
The `hardware-configuration.nix` file is specific to your current installation.
This file is irrelevant for this tutorial because it has no effect inside a virtual machine.
The `configuration.nix` file contains various suggestions useful for the initial setup of a desktop computer.
Without the comments the configuration file contains the following content:
```nix
{ config, pkgs, ... }:
{
  imports =
    [
      ./hardware-configuration.nix
    ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  services.xserver.enable = true;

  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  system.stateVersion = "22.05";
}
```

In this tutorial we focus on testing NixOS configurations on a virtual machine, in these cases you can remove the `hardware-configuration.nix` import.

To be able to log in, you must uncomment the section that specifies the user "alice", or add the following lines to the configuration inside the curly bracket that contain the configuration specification:
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
An insecure solution is to specify an unencrypted plaintext password by adding the `initialPassword` option to the user configuration:
```nix
    initialPassword = "danger";
```

Note that this may pose a security risk.
A more secure option is to encrypt a password using sha-512.
To create an encrypted password (here using "danger" as an example), execute:
```shell-session
$ mkpasswd -m sha-512 danger
```

Copy the output of `mkpasswd` into the user configuration and use the `initialHashedPassword` option.
It should look something like this:
```nix
    initialHashedPassword = "$6$YLpneQLpnPxXpo1Y$mTZg26KMjWIBqP1N98LzeANb5rfMcC5t7a7Khf/gTB/rPCT4t4x2EgJJZmXkRWcGVW6ZEDMulsjTsXxD7BLZZ/";
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
    initialHashedPassword = "$6$YLpneQLpnPxXpo1Y$mTZg26KMjWIBqP1N98LzeANb5rfMcC5t7a7Khf/gTB/rPCT4t4x2EgJJZmXkRWcGVW6ZEDMulsjTsXxD7BLZZ/";
  };

  system.stateVersion = "22.05";
}
```

## Manual testing of a NixOS configuration

One of the most powerful features in the Nix ecosystem is **the ability
to provide a set of declarative NixOS configurations and use a simple
Python interface** to interact with them using [QEMU](https://www.qemu.org/)
as the backend.
Those tests are widely used to ensure that NixOS works as intended, so in general they are called **NixOS tests**.
They can be written and launched outside of NixOS, on any Linux machine (with
[MacOS support coming soon](https://github.com/NixOS/nixpkgs/issues/108984)).
Integration tests are reproducible due to the design properties of Nix,
making them a valuable part of a Continuous Integration (CI) pipeline. [^nixdev]

### Creating a QEMU based virtual machine using a configuration

A virtual machine is created with the `nix-build` command.
To select the configuration.nix in the working directory, specify the configuration file as an argument:
```shell-session
$ nix-build '<nixpkgs/nixos>' -A vm -I nixos-config=./configuration.nix
```
[^nixosrebuild]

This command builds the attribute `vm` utilizing the nixpkgs as specified in the environment variable `NIX_PATH` and using the nixos-config as specified using a relative path.


### Running the virtual machine

The previous command creates a link with the name `result` in the working directory.
It links to the folder that contains the virtual machine.
To run the virtual machine execute:
```shell-session
$ ./result/bin/run-nixos-vm
```

This command opens a window that shows the boot process of the virtual machine and ends at the `gdm` login screen where you can log in as alice with the password "danger".

<!-- todo: remember to delete nixos.qcow2 (especially regarding user rights etc ...) -->

[^wikinixos]: Origin https://NixOS.wiki/wiki/NixOS

[^nixdev]: Origin https://github.com/NixOS/nix.dev/blob/master/source/tutorials/integration-testing-using-virtual-machines.md

[^nixlang]: Origin: [https://nixos.org/manual/nix/stable/expressions/expression-language.html](https://nixos.org/manual/nix/stable/expressions/expression-language.html)

[^nixpkgs]: Nixpkgs is the largest repository of Nix packages and NixOS modules.
The repository is hosted on GitHub and maintained by the community, with official backing from the NixOS Foundation.
Origin: [https://nixos.wiki/wiki/Nixpkgs](https://nixos.wiki/wiki/Nixpkgs)

[^nixosconf]: https://github.com/NixOS/nixpkgs/blob/b4093a24a868708c06d93e9edf13de0b3228b9c7/nixos/modules/installer/tools/tools.nix#L122-L226

[^nixosrebuild]: On NixOS you can create a virtual machine using the command `nixos-rebuild build-vm -I nixos-config=./configuration.nix` which basically wraps the above command.

[^additionaltests]: Additional information regarding tests:
Running integration tests on CI requires hardware acceleration, which many CIs do not support.
To run integration tests on {ref}`GitHub Actions <github-actions>` see [how to disable hardware acceleration](https://github.com/cachix/install-nix-action#how-can-i-run-nixos-tests).
NixOS comes with a large set of tests that serve also as educational examples. A good inspiration is [Matrix bridging with an IRC](https://github.com/NixOS/nixpkgs/blob/master/nixos/tests/matrix/appservice-irc.nix).
