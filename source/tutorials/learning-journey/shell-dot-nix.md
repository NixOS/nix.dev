# Creating shell environments

<!-- Include any foreward you want here -->

## Overview
<!-- Give a brief description of what the reader will learn so that they know whether the topic interests them. -->
<!-- Give some indication of how long it will take to complete the tutorial so that the reader knows whether to continue. -->
<!-- List any prerequisite knowledge or tools the reader will need to complete the tutorial. -->

| 🕑     | What will you learn?                                        | What will you need?                       |
| :---:  | :---                                                        | :---                                      |
| 30 min | How to create and configure reproducible shell environments | A basic understanding of the Nix language |

## Entering a shell with Python installed
Suppose we wanted to enter a shell in which Python 3 was installed.
The simplest possible way to accomplish this is via the `nix-shell -p` command:
```
$ nix-shell -p python3
```

This command works, but there's a number of inefficiences:
- You have to type out `-p python3` every time you enter the shell.
- It doesn't scale to an arbitrary number of packages (you would have to type out each package name each time).
- It doesn't (ergonomically) allow you any further customization of your shell environment.

A better solution is to create our shell environment from a `shell.nix` file.

## A basic `shell.nix` file
The `nix-shell` command by default looks for a file called `shell.nix` in the current directory and tries to build a shell environment by evaluating the Nix expression in this file.
So, if you properly describe the shell environment you want in a `shell.nix` file, you can enter it with just the `nix-shell` command without any further arguments.
No more specifying packages on the command line.
Here's what a basic `shell.nix` looks like that installs Python 3 as before:
```nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    packages = [
      pkgs.python3
    ];
  }
```
where `mkShell` is a function that produces a shell environment.

If you save this into a file called `shell.nix` and call `nix-shell` in the directory containing this `shell.nix` file, you'll enter a shell with Python 3 installed.

## Adding packages
Additional executable packages are added to the shell by adding them to the `packages` attribute.
For example, let's say we wanted to add `curl` to our shell environment.
The new `shell.nix` would look like this:
```nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    packages = [
      pkgs.python3
      pkgs.curl  # new package
    ];
  }
```

:::{note}
`nix-shell` was originally conceived as a way to construct a shell environment containing the tools needed to *develop software*; only later was it widely used as a general way to construct temporary environments for other purposes. Also note that `mkShell` is a [wrapper around `mkDerivation`](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell) so strictly speaking you can provide any attributes to `mkShell` that you could to `mkDerivation` such as `buildInputs`. However, the `packages` attribute provided to `mkShell` is an alias for `nativeBuildInputs`, so you shouldn't need to provide both `packages` and `nativeBuildInputs`.
:::

## Environment variables
It's common to want to automatically export certain environment variables when you enter a shell environment.
For example, you could have a database that depends on an environment variable to set the default authentication credentials during development.

Setting an environment variable in via `shell.nix` is trivial.
Any attribute in the `mkShell` function call that `mkShell` doesn't recognize as a reserved attribute name will be set to an environment variable in the shell environment.
The attributes that are reserved are listed in the [Nixpkgs manual][mkshell_attrs] and include `packages`, `name`, and several others.

[mkshell_attrs]: https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell-attributes

Let's say you wanted to set the database user (`DB_USER`) and password (`DB_PASSWORD`) via environment variables in your `shell.nix` file.
This is how that would look:
```nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    packages = [
      pkgs.python310
      pkgs.curl
    ];

    env = {
      # Database credentials
      DB_USER = "db_user";
      DB_PASSWORD = "super secret don't look";
    };
  }
```

:::{warning}
Some variables are protected from being overridden via the `env` attribute as described above.

For example, the shell prompt format for most shells is set by the `PS1` environment variable, but `nix-shell` already overrides this by default, and will ignore a `PS1` attribute listed in `env`.

If you _really_ need to override these protected environment variables you can use the `shellHook` feature discussed in the next section and `export MYVAR="value"` in the hook script.
In some cases it's necessary to set environment variables this way, but you should use `env` when possible.
:::


## Startup commands
You may want to perform some initialization before entering the shell environment (for example, maybe you want to ensure that a file exists).
Commands you'd like to run before entering the shell environment can be placed in the `shellHook` attribute of the attribute set provided to the `mkShell` function.
To ensure that a file `should_exist.txt` exists, the `shell.nix` file would look like this:

```nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    packages = [
      pkgs.python310
      pkgs.curl
    ];

    env = {
      # Database credentials
      DB_USER = "db_user";
      DB_PASSWORD = "super secret don't look";
    };

    # Set shell prompt format, ensure that 'should_exist.txt' exists
    shellHook = ''
      export PS1="\u@\h >>> "
      touch should_exist.txt
    '';
  }
```

Some other common use cases for `shellHook` are:
- Initializing a local data directory for a database used in a development environment
- Running commands to load secrets into environment variables
- Installing pre-commit-hooks

## Where to next?
- [`mkShell` documentation](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell)
- Nixpkgs [shell functions and utilities](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-functions) documentation

