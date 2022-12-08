(ref-pinning-nixpkgs)=

# Pinning Nixpkgs

Different ways:

- As environment variable: `$NIX_PATH=URL`
- `-I` command line parameter to most of commands like `nix-build`, `nix-shell`, etc
- Using [builtins.fetchTarball](https://nixos.org/manual/nix/stable/expressions/builtins.html) function that fetches the channel at evaluation time

## Possible `URL` values

- Local file path. Using just `.` means that nixpkgs is located in current folder.
- Pinned to a specific commit: `https://github.com/NixOS/nixpkgs/archive/eabc38219184cc3e04a974fe31857d8e0eac098d.tar.gz`
- Using latest channel, meaning all tests have passed: `http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz`
- Using latest channel, but hosted by github: `https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz`
- Using latest commit for release branch, but not tested yet: `https://github.com/NixOS/nixpkgs/archive/release-21.11.tar.gz`

## Examples

- ```shell-session 
  $ nix-build -I ~/dev
  ```

- ```shell-session
  $ nix-build -I nixpkgs=http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz`
  ```

- ```shell-session
  $ NIX_PATH=nixpkgs=http://nixos.org/channels/nixos-22.11/nixexprs.tar.xz nix-build ...`
  ```

- Using just Nix:

  ```nix
  let
    pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz") {};
  in pkgs.stdenv.mkDerivation { ... }
  ```

- To make ad-hoc environment available on NixOS: 
  ```nix
  {
    nix.nixPath = [ ("nixpkgs=" + toString pkgs.path) ];
  }
  ```
