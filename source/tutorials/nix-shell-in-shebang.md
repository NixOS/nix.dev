# Reproducible interpreted scripts

In this tutorial, you will learn how to use the [nix shell] to create reproducible interpreted scripts.
We will write a script requesting latest releases of NixOS/nixpkgs GitHub repository, convert it from XML to JSON and pretty-print the result.

[nix shell]: https://nixos.org/manual/nix/stable/command-ref/nix-shell.html

# Steps

## Getting Nix

The first step is to [install the Nix package manager].

[install the Nix package manager]: https://nix.dev/tutorials/install-nix

## Requirements

In order to write our script, we must thinkg beforehand about which programs we will need.

1. get the content of the url `https://github.com/NixOS/nixpkgs/releases.atom`
2. convert the XML into a JSON structure
3. display the JSON into the terminal so it's human readable

For the first step, we will need the program curl, provided by the nix package `curl`.
For the second step, we will need the program `xmljson`, provided by the nix package `python3Packages.xmljson`. As it's a python program, it's bundled at the python3 packages level.
For the third step, we will need the program `jq`, provided by the nix package `jq`.

Finally, the whole program will run in a `bash` shell, provided by the nix package `bash`.

## Shebang theory

The shebang is the name of the first line of an interpreted script, and it looks like `#!/bin/some_path`.
This is a mechanism to tell which binary should be used when running an executable script.

We will use the [nix-shell as an interpreter] in the shebang, not only to define the interpreter, but to also list the packages needed to provide the commands we saw in the previous section: `bash`, `python3Packages.xmljson`, `jq` and `curl`.

[nix-shell as an interpreter]: https://nixos.org/manual/nix/stable/command-ref/nix-shell.html#use-as-a--interpreter

## The script

We will use the shebang `#!/usr/bin/env nix-shell` in which `/usr/bin/env` means to use the `nix-shell` command found in the system path.

The command `nix-shell` can take a few different parameters:
- `-i` to indicates which program should be used to interpret the file, we want `bash`
- `-p` to indicates a list of packages that should be provided in the current shell, we need `jq python3Packages.xmljson curl`
- `-I` to indicates special attributes to `nix` such as `nixpkgs` to use a specific pinned version instead of using "the current version available now".

Create a file named `nixpkgs-releases.sh` with the following content:

```shell
#!/usr/bin/env nix-shell 
#! nix-shell -i bash -p curl jq python3Packages.xmljson
#! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/2a601aafdc5605a5133a2ca506a34a3a73377247.tar.gz

curl https://github.com/NixOS/nixpkgs/releases.atom | xml2json | jq .
```

Make it executable using `chmod o+x nixpkgs-releases.sh` and run it using `./nixpkgs-releases.sh`.
