# TITLE

<!-- Include any foreward you want here -->

## Overview

### What will you learn?

<!-- Give a brief description of what the reader will learn so that they know whether the topic interests them. -->
- How to create reproducible shell environments

### How long will it take?
WIP

<!-- Give some indication of how long it will take to complete the tutorial so that the reader knows whether to continue. -->

### What will you need?

<!-- List any prerequisite knowledge or tools the reader will need to complete the tutorial. -->
- A basic understanding of the Nix language

## Entering a shell with Python installed
Suppose we wanted to enter a shell in which Python 3.10 was installed.
The simplest possible way to accomplish this is via the `nix-shell -p` command:
```
$ nix-shell -p python310
```

This command works, but there's a number of inefficiences:
- You have to type out `-p python310` every time you enter the shell.
- It doesn't scale to an arbitrary number of packages (you would have to type out each package name each time).
- It doesn't (ergonomically) allow you any further customization of your shell environment.

A better solution is to create our shell environment from a `shell.nix` file.

## A basic `shell.nix` file
The `nix-shell` command by default looks for a file called `shell.nix` in the current directory and tries to build a shell environment by evaluating the Nix expression in this file.
So, if you properly describe the shell environment you want in a `shell.nix` file, you can enter it with just the `nix-shell` command without any further arguments.
No more specifying packages on the command line.
Here's what a basic `shell.nix` looks like that installs Python 3.10 as before:
```nix
let
    pkgs = import <nixpkgs> {};
in
    pkgs.mkShell {
        packages = [
          pkgs.python310
        ];
    }
```
where `mkShell` is a function that when called produces a shell environment.

If you save this into a file called `shell.nix` and call `nix-shell` in the directory containing this `shell.nix` file, you'll enter a shell with Python 3.10 installed.

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
          pkgs.python310
          pkgs.curl  # new package
        ];
    }
```

TODO: go into `packages` vs. `buildInputs`

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

        # Database username and password
        DB_USER = "db_user";
        DB_PASSWORD = "super secret don't look";
    }
```

Not only can you set new environment variables, but you can overwrite _existing_ environment variables.
For instance, the shell prompt format is set by the `PS1` environment variable.
In order to set your own prompt you can simply set the `PS1` attribute in the attribute set passed to the `mkShell` command
To set the shell prompt to the format `<username>@<hostname> [myEnv] $ ` the `shell.nix` file would look like this:

FIXME: This doesn't actually set the prompt for some reason

```nix
let
    pkgs = import <nixpkgs> {};
in
    pkgs.mkShell {
        packages = [
          pkgs.python310
          pkgs.curl
        ];

        # Database username and password
        DB_USER = "db_user";
        DB_PASSWORD = "super secret don't look";

        # Set the shell prompt to '<username>@<hostname> [myEnv] $ '
        PS1 = "\u@\h [myEnv] $ ";
    }
```


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

        # Database username and password
        DB_USER = "db_user";
        DB_PASSWORD = "super secret don't look";

        # Ensure that 'should_exist.txt' exists
        shellHook = ''
        touch should_exist.txt
        '';
    }
```


## Where to next?

<!-- Is there something the reader should read next? -->
<!-- Are there other topics they should explore next? -->
<!-- Provide links to other resources that might be relevant. -->
WIP
