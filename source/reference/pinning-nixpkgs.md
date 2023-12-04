(ref-pinning-nixpkgs)=

# Pinning Nixpkgs

Specifying remote Nix expressions, such as the one provided by Nixpkgs, can be done in several ways:

- [`$NIX_PATH` environment variable](https://nix.dev/manual/nix/2.18/command-ref/env-common.html#env-NIX_PATH)
- [`-I` option](https://nix.dev/manual/nix/2.18/command-ref/opt-common.html#opt-I) to most of commands like `nix-build`, `nix-shell`, etc.
- [`fetchurl`](https://nix.dev/manual/nix/2.18/language/builtins.html#builtins-fetchurl), [`fetchTarball`](https://nix.dev/manual/nix/2.18/language/builtins.html#builtins-fetchTarball), [`fetchGit`](https://nix.dev/manual/nix/2.18/language/builtins.html#builtins-fetchGit) or [Nixpkgs fetchers](https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers) in Nix expressions

## Possible URL values

- Local file path:

  ```
  ./path/to/expression.nix
  ```

  Using `./.` means that the expression is located in a file `default.nix` the current directory.

- Pinned to a specific commit:

  ```
  https://github.com/NixOS/nixpkgs/archive/eabc38219184cc3e04a974fe31857d8e0eac098d.tar.gz
  ```

- Using the latest channel version, meaning all tests have passed:

  ```
  http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz
  ```

- Shorthand syntax for channels:

  ```
  channel:nixos-22.11
  ```

- Using the latest channel version, hosted by GitHub:

  ```
  https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz
  ```

- Using the latest commit on the release branch, but not tested yet:

  ```
  https://github.com/NixOS/nixpkgs/archive/release-21.11.tar.gz
  ```

## Examples

- ```shell-session
  $ nix-build -I ~/dev
  ```

- ```shell-session
  $ nix-build -I nixpkgs=http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz
  ```

- ```shell-session
  $ nix-build -I nixpkgs=channel:nixos-22.11
  ```

- ```shell-session
  $ NIX_PATH=nixpkgs=http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz nix-build
  ```

- ```shell-session
  $ NIX_PATH=nixpkgs=channel:nixos-22.11 nix-build
  ```

- In the Nix language:

  ```nix
  let
    pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz") {};
  in pkgs.stdenv.mkDerivation { ... }
  ```
