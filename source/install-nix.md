(install-nix)=

# Install Nix

:::::{tab-set}

::::{tab-item} Linux

On Linux running systemd (`x86_64` or `aarch64`), use the [Nix Installer] for the recommended [multi-user installation].

```shell-session
$ curl -sSfL https://channels.nixos.org/nix-latest/nix-installer | sh -s -- install
```

For single-user installations or other supported Linux architectures, see the [shell installer instructions](https://nix.dev/manual/nix/stable/installation/installing-binary).
The shell installer may require first installing `xz-utils` to unpack Nix.

On Arch Linux, you can alternatively [install Nix through `pacman`](https://wiki.archlinux.org/title/Nix#Installation).

On Fedora, you can [install Nix via `dnf`](https://src.fedoraproject.org/rpms/nix).

::::

::::{tab-item} macOS

On macOS with Apple Silicon (`aarch64`), use the [Nix Installer] for the recommended [multi-user installation].

```shell-session
$ curl -sSfL https://channels.nixos.org/nix-latest/nix-installer | sh -s -- install
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

Without systemd, use the shell installer for a [single-user installation].

```shell-session
$ curl -L https://channels.nixos.org/nix-latest/install | sh -s -- --no-daemon
```

However, if you have [systemd support] enabled, use the [Nix Installer] for a [multi-user installation].

```shell-session
$ curl -sSfL https://channels.nixos.org/nix-latest/nix-installer | sh -s -- install
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

[Nix Installer]: https://github.com/NixOS/nix-installer
