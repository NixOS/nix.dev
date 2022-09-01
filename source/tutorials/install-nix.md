(install-nix)=

# Install Nix

## Linux

Install Nix via the recommended [multi-user installation](https://nixos.org/manual/nix/stable/installation/multi-user.html):

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon
```

:::{note}
For security you may want to [verify the installation script] using GPG signatures.
:::

## macOS

Install Nix via the recommended [multi-user installation](https://nixos.org/manual/nix/stable/installation/multi-user.html):

```bash
sh <(curl -L https://nixos.org/nix/install)
```

:::{note}
For security you may want to [verify the installation script] using GPG signatures.
:::

## Windows (WSL2)

Install Nix via the recommended [single-user installation](https://nixos.org/manual/nix/stable/installation/single-user.html):

```bash
sh <(curl -L https://nixos.org/nix/install) --no-daemon
```

:::{note}
For security you may want to [verify the installation script] using GPG signatures.
:::

## Docker

Start a Docker shell with Nix:

```bash
$ docker run -it nixos/nix
```

Or start a Docker shell with Nix exposing a `workdir` directory:

```bash
$ mkdir workdir
$ docker run -it -v $(pwd)/workdir:/workdir nixos/nix
```

The `workdir` example from above can be also used to start hacking on nixpkgs:

```bash
$ git clone git@github.com:NixOS/nixpkgs
$ docker run -it -v $(pwd)/nixpkgs:/nixpkgs nixos/nix
docker> nix-build -I nixpkgs=/nixpkgs -A hello
docker> find ./result # this symlink points to the build package
```

## Verify installation

Check that the installation by opening **a new terminal** and typing:

```bash
$ nix --version
nix (Nix) 2.11.0
```

[verify the installation script]: https://nixos.org/download.html#nix-verify-installation
