---
myst:
  html_meta:
    "keywords": "tutorial, declarative, shell, environment, developer, nix, nixpkgs"
---

(declarative-reproducible-envs)=
# Declarative shell environments with `shell.nix`

## Overview

Declarative shell environments allow you to:

- Automatically run bash commands during environment activation
- Automatically set environment variables
- Put the environment definition under version control and reproduce it on other machines

### What will you learn?

In the {ref}`ad-hoc-envs` tutorial, you learned how to imperatively create shell environments using `nix-shell -p`.
This is great when you want to quickly access tools without installing them permanently.
You also learned how to execute that command with a specific Nixpkgs revision using a Git commit as an argument, to recreate the same environment used previously.

In this tutorial we'll take a look at how to create reproducible shell environments with a declarative configuration in a {term}`Nix file`.
This file can be shared with anyone to recreate the same environment on a different machine.

### How long will it take?

30 minutes

### What do you need?

- Familiarity with the Unix shell
- A rudimentary understanding of the [Nix language](reading-nix-language)

## Entering a temporary shell

Suppose we want an environment where `cowsay` and `lolcat` are available.
The simplest possible way to accomplish this is via the `nix-shell -p` command:

```
$ nix-shell -p cowsay lolcat
```

This command works, but there's a number of drawbacks:
- You have to type out `-p cowsay lolcat` every time you enter the shell.
- It doesn't (ergonomically) allow you any further customization of your shell environment.

A better solution is to create our shell environment from a `shell.nix` file.

## A basic `shell.nix` file

Create a file called `shell.nix` with these contents:

```nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    cowsay
    lolcat
  ];
}
```

::::{dropdown} Detailed explanation
We use a version of [Nixpkgs pinned to a release branch](<ref-pinning-nixpkgs>), and explicitly set configuration options and overlays to avoid them being inadvertently overridden by [global configuration](https://nixos.org/manual/nixpkgs/stable/#chap-packageconfig).

`nix-shell` was originally conceived as a way to construct a shell environment containing the [tools needed to debug package builds](https://nixos.org/manual/nixpkgs/stable/#sec-tools-of-stdenv), such as Make or GCC.
Only later it became widely used as a general way to make temporary environments for other purposes.
`mkShellNoCC` is a function that produces a such an environment, but without a compiler toolchain.

`mkShellNoCC` takes as argument an attribute set.
Here we give it an attribute `packages` with a list containing one item from the `pkgs` attribute set.

:::{Dropdown} Side note on `packages` and `buildInputs`
You may encounter examples of `mkShell` or `mkShellNoCC` that add packages to the `buildInputs` or `nativeBuildInputs` attributes instead.


`mkShellNoCC` is a [wrapper around `mkDerivation`](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell), so it takes the same arguments as `mkDerivation`, such as `buildInputs` or `nativeBuildInputs`.
The `packages` attribute argument to `mkShellNoCC` is simply an alias for `nativeBuildInputs`.
:::
::::

Enter the environment by running `nix-shell` in the same directory as `shell.nix`:

```console
$ nix-shell
[nix-shell]$ cowsay hello | lolcat
```

`nix-shell` by default looks for a file called `shell.nix` in the current directory and builds a shell environment from the Nix expression in this file.
Packages defined in the `packages` attribute will be available in `$PATH`.

## Environment variables

You may want to automatically export certain environment variables when you enter a shell environment.

Set `GREETING` so it can be used in the shell environment:

```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
 in

 pkgs.mkShellNoCC {
   packages = with pkgs; [
     cowsay
     lolcat
   ];

+  GREETING = "Hello, Nix!";
 }
```

Any attribute name passed to `mkShellNoCC` that is not reserved otherwise and has a value which can be coerced to a string will end up as an environment variable.

Try it out!
Exit the shell by typing `exit` or pressing `Ctrl`+`D`, then start it again with `nix-shell`.

```console
[nix-shell]$ echo $GREETING
```

:::{warning}
Some variables are protected from being set as described above.

For example, the shell prompt format for most shells is set by the `PS1` environment variable, but `nix-shell` already sets this by default, and will ignore a `PS1` attribute set in the argument.

If you need to override these protected environment variables, use the `shellHook` attribute as described in the next section.
:::

## Startup commands

You may want to run some commands before entering the shell environment.
These commands can be placed in the `shellHook` attribute provided to `mkShellNoCC`.

Set `shellHook` to output a colorful greeting:

```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
 in

 pkgs.mkShellNoCC {
   packages = with pkgs; [
     cowsay
     lolcat
   ];

   GREETING = "Hello, Nix!";
+
+  shellHook = ''
+    echo $GREETING | cowsay | lolcat
+  '';
 }
```

Try it again!
Exit the shell by typing `exit` or pressing `Ctrl`+`D`, then start it again with `nix-shell` to observe the effect.

## References

- [`mkShell` documentation](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell)
- Nixpkgs [shell functions and utilities](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-functions) documentation
- [`nix-shell` documentation](https://nix.dev/manual/nix/2.18/command-ref/nix-shell)

## Next steps

- [](reading-nix-language)
- [](automatic-direnv)
- [](../../guides/recipes/sharing-dependencies.md)
- [](../../guides/recipes/dependency-management.md)
