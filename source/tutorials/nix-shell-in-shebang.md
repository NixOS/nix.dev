# Reproducible interpreted scripts

In this tutorial, you will learn how to use the [nix shell] to create reproducible interpreted scripts.

[nix shell]: https://nixos.org/manual/nix/stable/command-ref/nix-shell.html

# Steps

## Requirements

- A working [Nix installation](install-nix)
- Familiarity with [Bash]

[Bash]: https://www.gnu.org/software/bash/

# A trivial script with non-trivial dependencies

Take the following script, which fetches the content XML of a URL, converts it to JSON, and formats it for better readability:

```bash
#! /bin/bash

curl https://github.com/NixOS/nixpkgs/releases.atom | xml2json | jq .
```

It requires the programs `curl`, `xml2json`, and `jq`.
It also requires the `bash` interpreter.
If any of these dependencies are not present on the system running the script, it will fail partially or altogether.

We will use `nix-shell` interpreter directives to declare all dependencies explicitly, and produce a script that will always run on any machine that supports Nix and the required packages from Nixpkgs.

The characters `#!` at the beginning of a script are known as a [shebang].
This is a mechanism to tell which program should be used to interpret the following code.

[shebang]: https://en.m.wikipedia.org/wiki/Shebang_(Unix)

We will use the [nix-shell as an interpreter] in the shebang, not only to define the interpreter, but to also list the packages needed to provide the commands we saw in the previous section: `bash`, `python3Packages.xmljson`, `jq` and `curl`.

[nix-shell as an interpreter]: https://nixos.org/manual/nix/stable/command-ref/nix-shell.html#use-as-a--interpreter

## The script

We will use the shebang line `#! /usr/bin/env nix-shell`.

`/usr/bin/env` is a program available on most modern Unix-like operating systems. It takes a command name as argument and will run the first executable by that name it finds in the directories listed in the environment variable `$PATH`.

The command `nix-shell` takes the following parameters relevant for our use case:
- `-i` to indicates which program should be used to interpret the file, we want `bash`
- `-p` to indicates a list of packages that should be present in the interpreter's environment
- `-I` explicitly sets the search path for packages

Create a file named `nixpkgs-releases.sh` with the following content:

```shell
#!/usr/bin/env nix-shell 
#! nix-shell -i bash -p curl jq python3Packages.xmljson
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/2a601aafdc5605a5133a2ca506a34a3a73377247.tar.gz

curl https://github.com/NixOS/nixpkgs/releases.atom | xml2json | jq .
```

Make it executable using

 ```console
 chmod o+x nixpkgs-releases.sh
 ```
 
and run it with

```console
./nixpkgs-releases.sh
```
