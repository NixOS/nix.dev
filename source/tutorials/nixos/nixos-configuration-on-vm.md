(nixos-vms)=

# NixOS virtual machines

One of the most important features of NixOS is the ability to configure the entire system declaratively, including packages to be installed, services to be run, as well as other settings and options.

NixOS configurations can be used to test and use NixOS using a virtual machine, independent of an installation on a "bare metal" computer.

## What will you learn?

This tutorial serves as an introduction creating NixOS virtual machines.
Virtual machines are a practical tool for experimenting with or debugging NixOS configurations.

## What do you need?

- A Linux system with virtualisation support
- (optional) A graphical environment for running a graphical virtual machine
- A working [Nix installation](https://nix.dev/install-nix)
- Basic knowledge of the [Nix language](reading-nix-language)

:::{important}
A NixOS configuration is a Nix language function following the [NixOS module](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) convention.
For a thorough treatment of the module system, check the [](module-system-deep-dive) tutorial.
:::

## Starting from a default NixOS configuration

:::{note}
This tutorial starts with building up your `configuration.nix` from first principles, explaining each step. If you prefer, you can skip ahead to the [sample configuration](sample-nixos-config) section.
:::

We start with a minimal `configuration.nix`:

```nix
{ config, pkgs, ... }:

{
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  system.stateVersion = "24.05";
}
```

To be able to log in, add the following lines to the returned attribute set:

```nix
  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
  };
```

Additionally, you need to specify a password for this user.
For the purpose of demonstration only, you specify an insecure, plain text password by adding the `initialPassword` option to the user configuration:

```nix
   initialPassword = "test";
```

We add two lightweight programs as an example:

```nix
  environment.systemPackages = with pkgs; [
    cowsay
    lolcat
  ];
```

:::{warning}
Do not use plain text passwords outside of this example unless you know what you are doing. See [`initialHashedPassword`](https://nixos.org/manual/nixos/stable/options.html#opt-users.extraUsers._name_.initialHashedPassword) or [`ssh.authorizedKeys`](https://nixos.org/manual/nixos/stable/options.html#opt-users.extraUsers._name_.openssh.authorizedKeys.keys) for more secure alternatives.
:::

(sample-nixos-config)=
### Sample configuration

The complete `configuration.nix` file looks like this:

```nix
{ config, pkgs, ... }:
{
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
    initialPassword = "test";
  };

  environment.systemPackages = with pkgs; [
    cowsay
    lolcat
  ];

  system.stateVersion = "24.05";
}
```

## Creating a QEMU based virtual machine from a NixOS configuration

A NixOS virtual machine is created with the `nix-build` command:

```shell-session
$ nix-build '<nixpkgs/nixos>' -A vm -I nixpkgs=channel:nixos-24.05 -I nixos-config=./configuration.nix
```

This command builds the attribute `vm` from the `nixos-24.05` release of NixOS, using the NixOS configuration as specified in the relative path.

::::{dropdown} Detailed explanation

- The positional argument to [`nix-build`](https://nix.dev/manual/nix/stable/command-ref/nix-build.html) is a path to the derivation to be built.
  That path can be obtained from [a Nix expression that evaluates to a derivation](derivations).

  The virtual machine build helper is defined in NixOS, which is part of the [`nixpkgs` repository](https://github.com/NixOS/nixpkgs).
  Therefore we use the [lookup path](lookup-path-tutorial) `<nixpkgs/nixos>`.

- The [`-A` option](https://nix.dev/manual/nix/stable/command-ref/opt-common.html#opt-attr) specifies the attribute to pick from the provided Nix expression `<nixpkgs/nixos>`.

  To build the virtual machine, we choose the `vm` attribute as defined in [`nixos/default.nix`](https://github.com/NixOS/nixpkgs/blob/7c164f4bea71d74d98780ab7be4f9105630a2eba/nixos/default.nix#L19).

- The [`-I` option](https://nix.dev/manual/nix/stable/command-ref/opt-common.html#opt-I) prepends entries to the search path.

  Here we set `nixpkgs` to refer to a [specific version of Nixpkgs](ref-pinning-nixpkgs) and set `nix-config` to the `configuration.nix` file in the current directory.
::::

## Running the virtual machine

The previous command created a link with the name `result` in the working directory.
It links to the directory that contains the virtual machine.

```shell-session
$ ls -R ./result
result:
bin  system

result/bin:
run-nixos-vm
```

Run the virtual machine:

```shell-session
$ QEMU_KERNEL_PARAMS=console=ttyS0 ./result/bin/run-nixos-vm -nographic; reset
```

This command will run QEMU in the current terminal due to `-nographic`.
`console=ttyS0` will also show the boot process, which ends at the console login screen.

Log in as `alice` with the password `test`.
Check that the programs are indeed available as specified:

```shell-session
$ cowsay hello | lolcat
```

Exit the virtual machine by shutting it down:

```shell-session
$ sudo poweroff
```

:::{note}
If you forgot to add the user to `wheel` or didn't set a password, stop the virtual machine from a different terminal:

```shell-session
$ sudo pkill qemu
```
:::

Running the virtual machine will create a `nixos.qcow2` file in the current directory.
This disk image file contains the dynamic state of the virtual machine.
It can interfere with debugging as it keeps the state of previous runs, for example the user password.

Delete this file when you change the configuration:

```shell-session
$ rm nixos.qcow2
```

## Running GNOME on a graphical VM

To create a virtual machine with a graphical user interface, add the following lines to the configuration:

```nix
  # Enable the X11 windowing system.
  services.xserver.enable = true;

  # Enable the GNOME Desktop Environment.
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;
```

These three lines activate X11, the GDM display manager (to be able to login) and Gnome as desktop manager.

:::{tip}

You can also use the `installation-cd-graphical-gnome.nix` module to generate the configuration file from scratch:

```shell-session
nix-shell -I nixpkgs=channel:nixos-24.05 -p "$(cat <<EOF
  let
    pkgs = import <nixpkgs> { config = {}; overlays = []; };
    iso-config = pkgs.path + /nixos/modules/installer/cd-dvd/installation-cd-graphical-gnome.nix;
    nixos = pkgs.nixos iso-config;
  in nixos.config.system.build.nixos-generate-config
EOF
)"
```

```shell-session
$ nixos-generate-config --dir ./
```

::::

The complete `configuration.nix` file looks like this:

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
    extraGroups = [ "wheel" ];
    initialPassword = "test";
  };

  system.stateVersion = "24.05";
}
```

To get graphical output, run the virtual machine without special options:

```shell-session
$ nix-build '<nixpkgs/nixos>' -A vm -I nixpkgs=channel:nixos-24.05 -I nixos-config=./configuration.nix
$ ./result/bin/run-nixos-vm
```

## Running Sway as Wayland compositor on a VM

To change to a Wayland compositor, disable `services.xserver.desktopManager.gnome` and enable `programs.sway`:

```{code-block} diff
:caption: configuration.nix
-  services.xserver.desktopManager.gnome.enable = true;
+  programs.sway.enable = true;
```

:::{note}
Running Wayland compositors in a virtual machine might lead to complications with the display drivers used by QEMU.
You need to choose from the available drivers one that is compatible with Sway.
See [QEMU User Documentation](https://www.qemu.org/docs/master/system/qemu-manpage.html) for options.
One possibility is the `virtio-vga` driver:

```shell-session
$ ./result/bin/run-nixos-vm -device virtio-vga
```

Arguments to QEMU can also be added to the configuration file:

```nix
{ config, pkgs, ... }:
{
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  services.xserver.enable = true;

  services.xserver.displayManager.gdm.enable = true;
  programs.sway.enable = true;

  imports = [ <nixpkgs/nixos/modules/virtualisation/qemu-vm.nix> ];
  virtualisation.qemu.options = [
    "-device virtio-vga"
  ];

  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    initialPassword = "test";
  };

  system.stateVersion = "24.05";
}
```

:::

The NixOS manual has chapters on [X11](https://nixos.org/manual/nixos/stable/#sec-x11) and [Wayland](https://nixos.org/manual/nixos/stable/#sec-wayland) listing alternative window managers.

## References

- [NixOS Manual: NixOS Configuration](https://nixos.org/manual/nixos/stable/index.html#ch-configuration).
- [NixOS Manual: Modules](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules).
- [NixOS Manual Options reference](https://nixos.org/manual/nixos/stable/options.html).
- [NixOS Manual: Changing the configuration](https://nixos.org/manual/nixos/stable/#sec-changing-config).
- [NixOS source code: `configuration template` in `tools.nix`](https://github.com/NixOS/nixpkgs/blob/4e0525a8cdb370d31c1e1ba2641ad2a91fded57d/nixos/modules/installer/tools/tools.nix#L122-L226).
- [NixOS source code: `vm` attribute in `default.nix`](https://github.com/NixOS/nixpkgs/blob/master/nixos/default.nix).
- [Nix manual: `nix-build`](https://nix.dev/manual/nix/stable/command-ref/nix-build.html).
- [Nix manual: common command-line options](https://nix.dev/manual/nix/stable/command-ref/opt-common.html).
- [QEMU User Documentation](https://www.qemu.org/docs/master/system/qemu-manpage.html) for more runtime options
- [NixOS option search: `virtualisation.qemu`](https://search.nixos.org/options?query=virtualisation.qemu) for declarative virtual machine configuration

## Next steps

- [](module-system-deep-dive)
- [](integration-testing-vms)
- [](bootable-iso-image)
