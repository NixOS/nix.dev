# NixOS Configuration debugging using virtual machines

One of the most important features of NixOS is the ability to configure the entire system declaratively, including packages to be installed, services to be run, as well as other settings and options.

A NixOS configuration is a Nix language function which follows to the [NixOS module](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) convention.

## What will you learn?

This tutorial teaches testing and debuging NixOS configurations independent of a working NixOS installation.
It serves as an introduction creating virtual NixOS machines.

## What do you need?

<!-- todo links -->

- Basic knowledge of the Nix language.
- A working installation of Nix Package Manager or NixOS.


## Starting from the default NixOS configuration

On NixOS, by default, the configuration file is located at `/etc/nixos/configuration.nix`.
For CLI commands that use a configuration, its file path can be specified.
In this tutorial we use this strategy, because the goal is not to install or update the current NixOS, but to debug a specific configuration.

On NixOS, you can use the `nixos-generate-config` command to create a configuration file that contains some useful defaults and configuration suggestions [^nixosconf].
You can create a NixOS configuration in your working directory:
```shell-session
nixos-generate-config --dir ./
```

In the working directory you will find two files: `configuration.nix` and `hardware-configuration.nix`.

The `hardware-configuration.nix` file is specific to the hardware the `nix-generate-config` is being run on.
We can ignore that file for this tutorial because it has no effect inside a virtual machine.

The `configuration.nix` file contains various suggestions for the initial setup of a desktop computer.
Without comments the configuration file contains the following content:
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
An insecure solution is to specify an plain text password by adding the `initialPassword` option to the user configuration:
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

One of the most powerful features in the Nix ecosystem is the ability
to provide a set of declarative NixOS configurations and use a
Python shell to interact with them through [QEMU](https://www.qemu.org/)
as the backend.

Those tests are widely used to ensure that NixOS works as intended, so in general they are called **NixOS tests**.
They can be written and launched outside of NixOS, on any Linux machine (with
[MacOS support coming soon](https://github.com/NixOS/nixpkgs/issues/108984)).
Integration tests are reproducible due to the design properties of Nix,
making them a valuable part of a Continuous Integration (CI) pipeline. [^nixdev]

### Creating a QEMU based virtual machine using a configuration

A virtual machine is created with the `nix-build` command.

To select `configuration.nix` in the working directory, specify the configuration file as an argument:
```shell-session
$ nix-build '<nixpkgs/nixos>' -A vm -I nixos-config=./configuration.nix
```
[^nixosrebuild]

This command builds the attribute `vm` utilizing the version of Nixpkgs as specified in the environment variable `NIX_PATH` and using the NixOS configuration as specified in the relative path.


### Running the virtual machine

The previous command creates a link with the name `result` in the working directory.
It links to the folder that contains the virtual machine.

To run the virtual machine, execute:
```shell-session
$ ./result/bin/run-nixos-vm
```

This command opens a window that shows the boot process of the virtual machine and ends at the `gdm` login screen where you can log in as `alice` with the password `danger`.

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
