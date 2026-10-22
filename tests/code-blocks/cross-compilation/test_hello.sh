#!/usr/bin/env bash
# source/tutorials/cross-compilation.md: the environment from shell.nix
# compiles hello.c into a static aarch64 binary, as the tutorial shows.
set -euo pipefail

# shellcheck disable=SC2016 # expanded by the shell that nix-shell starts
nix-shell --pure shell.nix --run '$CC hello.c -o hello'

description=$(nix-shell --pure shell.nix --run 'file --brief hello')
if [[ $description != *"ARM aarch64"*"statically linked"* ]]; then
  echo "unexpected binary: $description"
  exit 1
fi
