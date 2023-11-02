(install-nix)=

# Install Nix

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

The `workdir` example from above can be also used to start hacking on Nixpkgs:

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

[multi-user installation]: https://nix.dev/manual/nix/2.18/installation/multi-user.html
[single-user installation]: https://nix.dev/manual/nix/2.18/installation/single-user.html
