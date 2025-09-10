(install-nix)=

# Install Nix
Requirements:
 - Prior to installation, you might first need to install `xz-utils` or similar for decompressing the Nix binary tarball (`.tar.xz`) that will be downloaded via the scripts below.

:::::{tab-set}

::::{tab-item} Linux

Install Nix via the recommended [multi-user installation]:

```shell-session
$ curl -L https://nixos.org/nix/install | sh -s -- --daemon
```

On Arch Linux, you can alternatively [install Nix through `pacman`](https://wiki.archlinux.org/title/Nix#Installation).

::::

::::{tab-item} macOS

Install Nix via the recommended [multi-user installation]:

```shell-session
$ curl -L https://nixos.org/nix/install | sh
```

:::{important}
**Updating to macOS 15 Sequoia**

If you recently updated to macOS 15 Sequoia and are getting the error
```console
error: the user '_nixbld1' in the group 'nixbld' does not exist
```
when running Nix commands, refer to GitHub issue [NixOS/nix#10892](https://github.com/NixOS/nix/issues/10892) for instructions to fix your installation without reinstalling.
:::

::::

::::{tab-item} Windows (WSL2)

Install Nix via the recommended [single-user installation]:

```shell-session
$ curl -L https://nixos.org/nix/install | sh -s -- --no-daemon
```

However, if you have [systemd support] enabled, install Nix via the recommended [multi-user installation]:

```shell-session
$ curl -L https://nixos.org/nix/install | sh -s -- --daemon
```

[systemd support]: https://learn.microsoft.com/en-us/windows/wsl/wsl-config#systemd-support

::::

::::{tab-item} Docker

Start a Docker shell with Nix:

```shell-session
$ docker run -it nixos/nix
```

Or start a Docker shell with Nix exposing a `workdir` directory:

```shell-session
$ mkdir workdir
$ docker run -it -v $(pwd)/workdir:/workdir nixos/nix
```

The `workdir` example from above can also be used to start hacking on Nixpkgs:

```shell-session
$ git clone git@github.com:NixOS/nixpkgs
$ docker run -it -v $(pwd)/nixpkgs:/nixpkgs nixos/nix
bash-5.1# nix-build -I nixpkgs=/nixpkgs -A hello
bash-5.1# find ./result # this symlink points to the build package
```

::::

:::::

## Verify installation

Check the installation by opening **a new terminal** and typing:

```shell-session
$ nix --version
nix (Nix) 2.11.0
```

[multi-user installation]: https://nix.dev/manual/nix/stable/installation/multi-user.html
[single-user installation]: https://nix.dev/manual/nix/stable/installation/single-user.html
