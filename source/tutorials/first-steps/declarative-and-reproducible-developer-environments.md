(declarative-reproducible-envs)=

# Declarative and reproducible developer environments

In the {ref}`ad-hoc-envs` tutorial we looked at providing shell
environments for when we need a quick'n'dirty way of getting hold
of some tools.

In this tutorial we'll take a look how to create {term}`reproducible`
shell environments given a declarative configuration file called a Nix expression.

## When are declarative shell environments useful?

This is the quickest approach to getting started with Nix:

- use single command to invoke it via `nix-shell`
- it works across different operating systems (Linux / MacOS)
- you share the exact same environment with all developers

Developer environments allow you to:

- provide CLI tools, such as `psql`, `jq`, `tmux`, etc
- provide developer libraries, such as `zlib`, `openssl`, etc
- set shell environment variables
- execute bash during environment activation

## Getting started

At the top-level of your project create `shell.nix` with the following contents:

```nix
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/06278c77b5d162e62df170fec307e83f1812d94b.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.which
    pkgs.htop
    pkgs.zlib
  ];
}
```

:::{note}
To understand the first line, read through {ref}`pinning nixpkgs tutorial <ref-pinning-nixpkgs>`.
:::

We import `nixpkgs` and make a shell with `which` and `htop` available in `$PATH`.
`zlib` provides libraries and headers in case we're compiling something against it.
To enter the environment:

```shell-session
$ nix-shell
these paths will be fetched (0.07 MiB download, 0.20 MiB unpacked):
  /nix/store/072a6x7rwv5f8wr6f5s1rq8nnm767cfp-htop-2.2.0
copying path '/nix/store/072a6x7rwv5f8wr6f5s1rq8nnm767cfp-htop-2.2.0' from 'https://cache.nixos.org'...

[nix-shell:~]$
```

The command will start downloading the missing packages from the <https://cache.nixos.org> binary cache.

Once it's done, you are dropped into a new
shell. This shell provides the packages specified in `shell.nix`.

Run `htop` to confirm that it is present. Quit the program by hitting
`q`.

Now, try `which htop` to check where the `htop` command is on disk.
You should see something similar to this:

```shell-session
[nix-shell:~]$ which htop
/nix/store/y3w2i8kfdbfj9rx287ad52rahjpgv423-htop-2.2.0/bin/htop
```

## Customizing your developer environment

Given the following `shell.nix`:

```nix
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/06278c77b5d162e62df170fec307e83f1812d94b.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.which
    pkgs.htop
    pkgs.zlib
  ];

  shellHook = ''
    echo hello
  '';

  MY_ENVIRONMENT_VARIABLE = "world";
}
```

Running `nix-shell` we observe:

```shell-session
$ nix-shell
hello

[nix-shell:~]$ echo $MY_ENVIRONMENT_VARIABLE
world
```

- The `shellHook` section allows you to execute bash while entering the shell environment.
- Any attributes passed to `mkShell` function are available once the shell environment is active.

## `direnv`: Automatically activating the environment on directory change

Besides activating the environment for each project, every time you change
`shell.nix` you need to re-enter the shell.

You can use `direnv` to automate this process for you, with the downside that each developer needs
to install it globally.

### Setting up `direnv`

1. [Install direnv with your OS package manager](https://direnv.net/docs/installation.html#from-system-packages)
2. [Hook it into your shell](https://direnv.net/docs/hook.html)

At the top-level of your project run:

```shell-session
$ echo "use nix" > .envrc && direnv allow
```

The next time your launch your terminal and enter the top-level of your project direnv will check for changes.

```shell-session
$ cd myproject
direnv: loading myproject/.envrc
direnv: using nix
hello
```

#### Improvements for `direnv`

`direnv` ships with native Nix integration however the default implementation suffers from two setbacks:

1. `nix-shell` environment is recalculated every time.
2. environment has no *gcroots* and therefore is eligible for garbage collection.

Consider using the nix-community [implementation](https://github.com/nix-community/nix-direnv) which
solves the problems mentioned above.

## Next steps

- {ref}`pinning-nixpkgs` to see different ways to import nixpkgs
- To quickly set up a Nix project read through
  [Getting started Nix template](https://github.com/nix-dot-dev/getting-started-nix-template).
