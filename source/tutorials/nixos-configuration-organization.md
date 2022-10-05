# NixOS Configuration - organization

Draft 2022.08.11

## What will you learn?

In the two previous tutorials we used a single Nix file that contains all information to configure NixOS, use it in a virtual machine, or to run a test.
A single file that contains the complete configuration is helpful for debugging and sharing, but less for real world use cases.
The Nix language allows us to separate concerns.

In the following section we take the standard configuration from the beginning.
This time we do not change the file, and instead add separate files for different tasks.

In the following section we will go through some possibilities to disentangle the configuration file, the additions we want for a usable virtual machine and the test script.

The aim of this is to learn how to organize nix files.

## What do you need?

<!-- todo links -->

- Basic knowledge of the Nix language.
- A working installation of Nix Package Manager or NixOS.
- nixpkgs path set in `$NIX_PATH`
- previous tutorials ... todo


## NixOS configurations are modules

todo


## Concrete examples related to debugging and testing tutorials

### separation of configuration and virtual machine

Here is again the default configuration we used from before:

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

As long as we only need to set additional options we can write a nixos configuration for the virtual machine that imports the `configuration.nix`.
https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules


`vm.nix`:

```nix
{ config, pkgs, ... }: {
  imports = [./configuration.nix];
  users.users.alice.initialPassword = "danger";
}
```

and run `nix-build '<nixpkgs/nixos>' -A vm -I nixos-config=./vm.nix`

### separation of configuration and test

Similarly you can import the `configuration.nix` to a test:

```{code-block}
let
  nixpkgs = <nixpkgs>;
  pkgs = import nixpkgs {};
in
  pkgs.nixosTest {
    nodes.machine = {
      imports = [./configuration.nix];
    };

    testScript = {nodes, ...}: ''
      start_all()
      machine.wait_for_unit("default.target")
      machine.succeed("su -- alice -c 'which firefox'")
      machine.fail("su -- root -c 'which firefox'")
    '';
  }
```

and run `nix-build minimaltest.nix`.


## recommendable file structure



