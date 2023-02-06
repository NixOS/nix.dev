(reproducible-scripts)=

# Reproducible interpreted scripts

In this tutorial, you will learn how to use Nix to create and run reproducible interpreted scripts.

## Requirements

- A working [Nix installation](install-nix)
- Familiarity with [Bash]

## A trivial script with non-trivial dependencies

Take the following script, which fetches the content XML of a URL, converts it to JSON, and formats it for better readability:

```bash
#! /bin/bash

curl https://github.com/NixOS/nixpkgs/releases.atom | xml2json | jq .
```

It requires the programs `curl`, `xml2json`, and `jq`.
It also requires the `bash` interpreter.
If any of these dependencies are not present on the system running the script, it will fail partially or altogether.

With Nix, we can declare all dependencies explicitly, and produce a script that will always run on any machine that supports Nix and the required packages taken from Nixpkgs.

## The script

A [shebang] is the first line of a script starting with `#!`.
It determines which program to use for running the script.

[Bash]: https://www.gnu.org/software/bash/
[shebang]: https://en.m.wikipedia.org/wiki/Shebang_(Unix)

We will use the shebang line `#! /usr/bin/env nix-shell`.

`/usr/bin/env` is a program available on most modern Unix-like operating systems.
It takes a command name as argument and will run the first executable by that name it finds in the directories listed in the environment variable `$PATH`.

We use [`nix-shell` as a shebang interpreter].
It takes the following parameters relevant for our use case:

[`nix-shell` as a shebang interpreter]: https://nixos.org/manual/nix/stable/command-ref/nix-shell.html#use-as-a--interpreter
- `-i` tells which program to use for interpreting the rest of the file
- `-p` lists packages that should be present in the interpreter's environment
- `-I` explicitly sets the search path for packages

Create a file named `nixpkgs-releases.sh` with the following content:

```shell
#!/usr/bin/env nix-shell 
#! nix-shell -i bash
#! nix-shell -p curl jq python3Packages.xmljson
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/2a601aafdc5605a5133a2ca506a34a3a73377247.tar.gz

curl https://github.com/NixOS/nixpkgs/releases.atom | xml2json | jq .
```

We specify `bash` as the interpreter.

The command `xml2json` is provided by the package `python3Packages.xmljson`, while the commands `jq` and `curl` are provided by packages of the same name.

The parameter of `-I` refers to a specific Git commit of the Nixpkgs repository.
This ensures that the script will always run with the exact same packages versions, everywhere.

Make the script executable:

 ```console
 chmod +x nixpkgs-releases.sh
 ```
 
Run the script:

```console
./nixpkgs-releases.sh
```
