(declarative-reproducible-envs)=

# Declarative and reproducible developer environments

In the {ref}`ad-hoc-envs` tutorial, we looked at imperatively creating shell environments using `nix-shell -p`, for when we need a quick way to access some tools without having to install them globally. We also saw how to execute that command with a specific Nixpkgs revision using a Git commit as an argument, to recreate the same environment used previously.

In this tutorial we'll take a look how to create reproducible shell environments given a declarative configuration in a {term}`Nix file`.

## When are declarative shell environments useful?

Both methods of creating development shell environments allow you to provide CLI tools like `psql`, `jq`, and `tmux`, as well as developer libraries like `zlib` and `openssl`. However, only the *declarative* approach allows you to

- automatically set shell environment variables,
- execute bash commands during environment activation, and
- share the exact same environment with other developers.

In addition to these, declaring development environments in Nix expression files enables you to use all the source code workflows you're used to, like committing that file to version control, using code analysis tools, and so on.

## Getting started

At the top-level of your project, create `shell.nix` with the following contents:

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
To better understand the first line, read through the tutorial on {ref}`pinning nixpkgs <ref-pinning-nixpkgs>`.
:::

This expression imports `nixpkgs`, then creates a shell with `which` and `htop` available in `$PATH`. `zlib` is also added, to provide some common libraries and headers in case we need to compile something against it.

To enter the environment, run `nix-shell` in the same directory as `shell.nix`:

```shell-session
$ nix-shell
these paths will be fetched (0.07 MiB download, 0.20 MiB unpacked):
  /nix/store/072a6x7rwv5f8wr6f5s1rq8nnm767cfp-htop-2.2.0
copying path '/nix/store/072a6x7rwv5f8wr6f5s1rq8nnm767cfp-htop-2.2.0' from 'https://cache.nixos.org'...

[nix-shell:~]$
```

This command will start downloading the missing packages from the <https://cache.nixos.org> binary cache.

Once the download completes, you are dropped into a new shell, which provides the packages specified in `shell.nix`.

Run `htop` to confirm that it is present. Quit the program by hitting `q`.

Now try `which htop` to check where the `htop` executable is stored in the filesystem. You should see something similar to this:

```shell-session
[nix-shell:~]$ which htop
/nix/store/y3w2i8kfdbfj9rx287ad52rahjpgv423-htop-2.2.0/bin/htop
```

## Customizing your developer environment

We may want to run some commands whenever we enter the environment, for example echoing a message to the console. We may also want to set some variables that are only present within the environment.
To accomplish these, we can modify the `shell.nix` from the previous section like so:

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

- The `shellHook` section allows you to execute bash commands while entering the shell environment.
- Any attributes passed to `mkShell` function are available once the shell environment is active.

## `direnv`: Automatically activating the environment on directory change

In addition to manually activating the environment for each project, you need to re-enter the shell every time you change `shell.nix`.

You can use `direnv` to automate this process for you, with the tradeoff that each developer using the environment needs to install it globally.

### Setting up `direnv`

1. [Install nix-direnv with your package manager or from source](https://github.com/nix-community/nix-direnv)
2. [Hook it into your shell](https://direnv.net/docs/hook.html)

From the top-level directory of your project run:

```shell-session
$ echo "use nix" > .envrc && direnv allow
```

The next time you launch your terminal and enter the top-level directory of your project, `direnv` will check for changes to the `shell.nix` file.

```shell-session
$ cd myproject
direnv: loading myproject/.envrc
direnv: using nix
hello
```

## Next steps

- Take a look at our {ref}`pinning-nixpkgs` tutorial to see different ways to import Nixpkgs.
- To quickly set up a Nix project, read [Getting started Nix template](https://github.com/nix-dot-dev/getting-started-nix-template).
