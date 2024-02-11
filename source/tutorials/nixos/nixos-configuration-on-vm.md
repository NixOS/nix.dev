(nixos-vms)=

# NixOS virtual machines

One of the most important features of NixOS is the ability to configure the entire system declaratively, including packages to be installed, services to be run, as well as other settings and options.

NixOS configurations can be used to test and use NixOS using a virtual machine, independent of an installation on a "bare metal" computer.

## What will you learn?

This tutorial serves as an introduction creating NixOS virtual machines.
Virtual machines are a practical tool for experimenting with or debugging NixOS configurations.

## What do you need?

- A working [Nix installation](https://nix.dev/manual/nix/2.18/installation/installation.html) on Linux, or [NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-installation), with a graphical environment
- Basic knowledge of the [Nix language](reading-nix-language)

:::{important}
A NixOS configuration is a Nix language function following the [NixOS module](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) convention.
For a thorough treatment of the module system, check the [](module-system-deep-dive) tutorial.
:::

## Starting from a default NixOS configuration

In this tutorial you will use a default configuration that is shipped with NixOS.
You can also skip this section and copy the [sample configuration](sample-nixos-config) for this tutorial into a file `configuration.nix` in the current directory.

::::{admonition} NixOS

On NixOS, use the `nixos-generate-config` command to create a configuration file that contains some useful defaults and configuration suggestions.

Beware that the result of this command depends on your current NixOS configuration.
The output of 'nixos-generate-config' can be made reproducible in a `nix-shell` environment.
Here we provide a configuration that is used for the [NixOS minimal ISO image](https://nixos.org/download#nixos-iso):

```shell-session
nix-shell -I nixpkgs=channel:nixos-23.11 -p 'let pkgs = import <nixpkgs> { config = {}; overlays = []; }; iso-config = pkgs.path + /nixos/modules/installer/cd-dvd/installation-cd-minimal.nix; nixos = pkgs.nixos iso-config; in nixos.config.system.build.nixos-generate-config'
```

:::{dropdown} Detailed explanation

The above shell command is a one-liner so it's easier to copy and paste.
This is the readable long form using a [heredoc](https://en.wikipedia.org/wiki/Here_document):

```{code-block} bash
nix-shell -I nixpkgs=channel:nixos-23.11 -p "$(cat <<EOF
let
  pkgs = import <nixpkgs> { config = {}; overlays = []; };
  iso-config = pkgs.path + /nixos/modules/installer/cd-dvd/installation-cd-minimal.nix;
  nixos = pkgs.nixos iso-config;
in nixos.config.system.build.nixos-generate-config
EOF
)"
```

It does the following:
- Provide Nixpkgs from a [channel](ref-pinning-nixpkgs)
- Take the configuration file for the minimal ISO image from the obtained version of the Nixpkgs repository
- Evaluate that NixOS configuration with `pkgs.nixos`
- Return the derivation which produces the `nixos-generate-config` executable from the evaluated configuration

:::

By default, the generated configuration file is written to `/etc/nixos/configuration.nix`.
To avoid overwriting this file you have to specify the output directory.
Create a NixOS configuration in your working directory:

```shell-session
nixos-generate-config --dir ./
```

In the working directory you will then find two files:

1. `hardware-configuration.nix` is specific to the hardware `nix-generate-config` is being run on.
   You can ignore that file for this tutorial because it has no effect inside a virtual machine.

2. `configuration.nix` contains various suggestions and comments for the initial setup of a desktop computer.
::::

The default NixOS configuration without comments is:

```nix
{ config, pkgs, ... }:
{
  imports =  [ ./hardware-configuration.nix ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  system.stateVersion = "23.11";
}
```

To be able to log in, add the following lines to the returned attribute set:

```nix
  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    packages = with pkgs; [
      cowsay
      lolcat
    ];
  };
```

:::{admonition} NixOS
On NixOS your configuration generated with `nixos-generate-config` contains this user configuration commented out.
:::

Additionally, you need to specify a password for this user.
For the purpose of demonstration only, you specify an insecure, plain text password by adding the `initialPassword` option to the user configuration:

```nix
initialPassword = "test";
```

:::{warning}
Do not use plain text passwords outside of this example unless you know what you are doing. See [`initialHashedPassword`](https://nixos.org/manual/nixos/stable/options.html#opt-users.extraUsers._name_.initialHashedPassword) or [`ssh.authorizedKeys`](https://nixos.org/manual/nixos/stable/options.html#opt-users.extraUsers._name_.openssh.authorizedKeys.keys) for more secure alternatives.
:::

This tutorial focuses on testing NixOS configurations on a virtual machine.
Therefore you will remove the reference to `hardware-configuration.nix`:

```diff
-  imports =  [ ./hardware-configuration.nix ];
```

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
    packages = with pkgs; [
      cowsay
      lolcat
    ];
    initialPassword = "test";
  };

  system.stateVersion = "23.11";
}
```

## Creating a QEMU based virtual machine from a NixOS configuration

A NixOS virtual machine is created with the `nix-build` command:

```shell-session
nix-build '<nixpkgs/nixos>' -A vm \
-I nixpkgs=channel:nixos-23.11 \
-I nixos-config=./configuration.nix
```

This command builds the attribute `vm` from the `nixos-23.11` release of NixOS, using the NixOS configuration as specified in the relative path.

<details><summary> Detailed explanation </summary>

- The positional argument to [`nix-build`](https://nix.dev/manual/nix/2.18/command-ref/nix-build.html) is a path to the derivation to be built.
  That path can be obtained from [a Nix expression that evaluates to a derivation](derivations).

  The virtual machine build helper is defined in NixOS, which is part of the [`nixpkgs` repository](https://github.com/NixOS/nixpkgs).
  Therefore we use the [lookup path](lookup-path-tutorial) `<nixpkgs/nixos>`.

- The [`-A` option](https://nix.dev/manual/nix/2.18/command-ref/opt-common.html#opt-attr) specifies the attribute to pick from the provided Nix expression `<nixpkgs/nixos>`.

  To build the virtual machine, we choose the `vm` attribute as defined in [`nixos/default.nix`](https://github.com/NixOS/nixpkgs/blob/7c164f4bea71d74d98780ab7be4f9105630a2eba/nixos/default.nix#L19).

- The [`-I` option](https://nix.dev/manual/nix/2.18/command-ref/opt-common.html#opt-I) prepends entries to the search path.

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
QEMU_KERNEL_PARAMS=console=ttyS0 ./result/bin/run-nixos-vm -nographic; reset
```

This command will run QEMU in the current terminal due to `-nographic`.
`console=ttyS0` will also show the boot process, which ends at the console login screen.

Log in as `alice` with the password `test`.
Check that the programs are indeed available as specified:

```shell-session
cowsay hello | lolcat
```

Exit the virtual machine by shutting it down:

```shell-session
sudo poweroff
```

:::{note}
If you forgot to add the user to `wheel` or didn't set a password, stop the virtual machine from a different terminal:

```shell-session
sudo pkill qemu
```
:::

Running the virtual machine will create a `nixos.qcow2` file in the current directory.
This disk image file contains the dynamic state of the virtual machine.
It can interfere with debugging as it keeps the state of previous runs, for example the user password.

Delete this file when you change the configuration:

```shell-session
rm nixos.qcow2
```

## References

- [NixOS Manual: NixOS Configuration](https://nixos.org/manual/nixos/stable/index.html#ch-configuration).
- [NixOS Manual: Modules](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules).
- [NixOS Manual Options reference](https://nixos.org/manual/nixos/stable/options.html).
- [NixOS Manual: Changing the configuration](https://nixos.org/manual/nixos/stable/#sec-changing-config).
- [NixOS source code: `configuration template` in `tools.nix`](https://github.com/NixOS/nixpkgs/blob/4e0525a8cdb370d31c1e1ba2641ad2a91fded57d/nixos/modules/installer/tools/tools.nix#L122-L226).
- [NixOS source code: `vm` attribute in `default.nix`](https://github.com/NixOS/nixpkgs/blob/master/nixos/default.nix).
- [Nix manual: `nix-build`](https://nix.dev/manual/nix/2.18/command-ref/nix-build.html).
- [Nix manual: common command-line options](https://nix.dev/manual/nix/2.18/command-ref/opt-common.html).
- [Nix manual: `NIX_PATH` environment variable](https://nix.dev/manual/nix/2.18/command-ref/env-common.html#env-NIX_PATH).
- [QEMU User Documentation](https://www.qemu.org/docs/master/system/qemu-manpage.html) for more runtime options
- [NixOS option search: `virtualisation.qemu`](https://search.nixos.org/options?query=virtualisation.qemu) for declarative virtual machine configuration

## Next steps

- [](module-system-deep-dive)
- [](integration-testing-vms)
- [](bootable-iso-image)
