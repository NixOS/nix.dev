(ref-pinning-nixpkgs)=

# Pinning Nixpkgs

Specifying remote Nix expressions, such as the one provided by Nixpkgs, can be done in several ways:

- [`-I` option](https://nixos.org/manual/nix/stable/command-ref/opt-common.html#opt-I) to most of commands like `nix-build`, `nix-shell`, etc.
- [`$NIX_PATH` environment variable](https://nixos.org/manual/nix/stable/command-ref/env-common.html#env-NIX_PATH)
- Using [builtins.fetchTarball](https://nixos.org/manual/nix/stable/expressions/builtins.html) to fetch a Nix expression at evaluation time

## Possible `URL` values

- Local file path.

  Using `.` means that nixpkgs is located in the current directory.

- Pinned to a specific commit

  ```
  https://github.com/NixOS/nixpkgs/archive/eabc38219184cc3e04a974fe31857d8e0eac098d.tar.gz
  ```

- Using the latest channel version, meaning all tests have passed

  ```
  http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz
  ```

  Shorthand syntax for `NIX_PATH` and `-I`:

  ```
  channel:nixos-22.11`
  ```

- Using the latest channel version, hosted by GitHub

  ```
  https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz
  ```

- Using the latest commit on the release branch, but not tested yet

  ```
  https://github.com/NixOS/nixpkgs/archive/release-21.11.tar.gz
  ```

## Examples

- ```shell-session 
  $ nix-build -I ~/dev
  ```

- ```shell-session
  $ nix-build -I nixpkgs=http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz`
  ```

- ```shell-session
  $ nix-build -I nixpkgs=channel:nixos-22.11`
  ```

- ```shell-session
  $ NIX_PATH=nixpkgs=http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz nix-build ...`
  ```

- ```shell-session
  $ NIX_PATH=nixpkgs=channel:nixos-22.11 nix-build ...`
  ```

- In the Nix language:

  ```nix
  let
    pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz") {};
  in pkgs.stdenv.mkDerivation { ... }
  ```
