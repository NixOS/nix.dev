(pinning-nixpkgs)=

# Towards reproducibility: pinning Nixpkgs

Nixpkgs can be referenced in different ways some of these are not reproducible.
Especially the search path language construct (often `<nixpkgs>`) makes implicitly use of the state of the environment variable `$NIX_PATH`.

For example, in various Nix examples, you'll often see references to [\<nixpkgs>](https://github.com/NixOS/nixpkgs), as follows.

```nix
{ pkgs ? import <nixpkgs> {}
}:

...
```

This is a **convenient** way to quickly demonstrate a Nix expression and get it working by importing Nix packages.

However, the resulting Nix expression is not fully reproducible.

## What will you learn?

- the various ways to refer to Nixpkgs.
- the implications of the different ways.
- ways to ensure your nix files and cli commands make use of a specific version of Nixpkgs.

<!-- ## What do you need? -->
<!-- know why you want to use nixpkgs -->
<!-- know why you want to have take care of reproducability yourself (this was a question i had when i started) -->

## Refering to Nixpkgs 

There are three ways to refer to nixpkgs:

- Setting the environment variable `$NIX_PATH` to include a `nixpkgs=URL` entry and use the search path `<nixpkgs>` <!-- link to language tutorial -->
- Commands like `nix-build`, `nix-shell`, etc. take a command line parameter `-I nixpkgs=URL` that can be used to extend the search path for that command only. Nixpkgs can then also be referenced with `<nixpkgs>`
- Using [builtins.fetchTarball](https://nixos.org/manual/nix/stable/expressions/builtins.html) function that fetches the `URL` at evaluation time <!-- more precise link would be nice -->

Possible `URL` values are:

- Local file path. Using just `.` means that nixpkgs is located in current folder.
- Pinned to a specific commit: `https://github.com/NixOS/nixpkgs/archive/addcb0dddf2b7db505dae5c38fceb691c7ed85f9.tar.gz`
- Using latest channel, meaning all tests have passed and it includes `programs.sqlite` file, which contains an index for which package contains which binaries: : `http://nixos.org/channels/nixos-22.05/nixexprs.tar.xz`
- Using latest channel, but hosted by github: `https://github.com/NixOS/nixpkgs/archive/nixos-22.05.tar.gz`
- Using latest commit for release branch, but not tested yet: `https://github.com/NixOS/nixpkgs/archive/release-22.05.tar.gz`

Github creates archive for all branches and tags, because of this many archive links are available that are not recommended to be used.

### Examples

- `nix-build -I ~/dev`

- `nix-build -I nixpkgs=http://nixos.org/channels/nixos-22.05/nixexprs.tar.xz`

- `NIX_PATH=nixpkgs=http://nixos.org/channels/nixos-22.05/nixexprs.tar.xz nix-build ...`

- To make ad-hoc environment available on NixOS: `nix.nixPath = [ ("nixpkgs=" + toString pkgs.path) ];`

- Using just Nix:

  ```
  let
    pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-22.05.tar.gz") {};
  in pkgs.stdenv.mkDerivation { … }
  ```

## Pinning packages with URLs inside a Nix expression

To create **fully reproducible** Nix expressions, we can pin an exact version of Nixpkgs.

The simplest way to do this is to fetch the required Nixpkgs version as a tarball specified via the relevant Git commit hash:

```nix
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/3590f02e7d5760e52072c1a729ee2250b5560746.tar.gz") {}
}:

...
```

Picking the commit can be done via [status.nixos.org](https://status.nixos.org/),
which lists all the releases and the latest commit that has passed all tests.

When choosing a commit, it is recommended to follow either

- the **latest stable NixOS** release by using a specific version, such as `nixos-22.05`, **or**
- the latest **unstable release** via `nixpkgs-unstable` or for NixOS `nixos-unstable`

More information on channels can be found on the [Wiki](https://nixos.wiki/wiki/Nix_channels) and on [Diskurse](https://discourse.nixos.org/t/differences-between-nix-channels/13998) <!-- todo: move here + check manuals for content again -->
