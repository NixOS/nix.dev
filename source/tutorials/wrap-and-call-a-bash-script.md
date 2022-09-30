(wrap-and-call-bash-script)=

# Wrapping a bash script and making it executable

It is not uncommon to consume bash scripts inline. If long enough, however, one may have to consume it from an outside file. 

This tutorial goes through the steps required to wrap a bash script, making it executable, and ultimately run it from a derivation or developer shell.

## The problem

Let's say we have a bash script called `countdown.sh` that prints natural numbers from 10 down to 0 before running the `hello` package:

```bash
#!/bin/bash

valid=true
count=10
while [ $valid ]
do
    sleep 1
    echo $count
    if [ $count -eq 0 ];
    then
        hello
		break
    fi
    ((count--))
done
```

## Read it, shebang out, wrap it

Create an input called `wrap-script`, adding the builtin function `readFile` and a `patchShebangs` hook. We will also need a [`writeShellScriptBin`](https://nixos.org/manual/nixpkgs/stable/#trivial-builder-writeText) trivial builder, passing the arguments `name` and `text`:

```nix
read = rec {
  name = "script";
  text  = builtins.readFile ./countdown.sh;
  script = (pkgs.writeShellScriptBin name text).overrideAttrs(old: {
    buildCommand = "${old.buildCommand}\n patchShebangs $out";
  });
};
```

## Symlinking it

Next thing, create a derivation that we can call elsewhere. We will do that with [`symlinkJoin`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/trivial-builders.nix#L388). Since we're dealing with a single path only, all we need to do is to add the script wrapper declared above to the `paths` argument: 

```nix
symlink = with pkgs; pkgs.symlinkJoin {
  name = "script";
  paths = [
    read.script
    pkgs.hello
  ];
};
```

## Call the executable from a developer shell

In a developer shell definition, export the path and call the executable inside a `shellHook`:

```nix
devShells.x86_64-linux = {
  default = pkgs.mkShell {
    buildInputs = with pkgs; [
      wrapped
    ];
    shellHook = ''
      PATH=${pkgs.hello}/bin:$PATH
      ${symlink}/bin/script
    '';
  };
};
```

## Call the executable from a derivation

Export the path and call the executable with a `writeShellScriptBin` trivial builder:

```
wrapped = pkgs.writeShellScriptBin "script" ''
  PATH=${pkgs.hello}/bin:$PATH
  exec ${symlink}/bin/script
'';
```

Finally, call it from the default derivation:

```nix
packages.x86_64-linux = {
  default = wrapped;
};
```

## Simplifying it

Since the `writeShellApplication` trivial builder can write our script to the store making it executable and do the symlinking for us, all in one stroke, we can get rid of `writeShellScriptBin` and `symlinkJoin`. [`writeShellApplication`](https://nixos.org/manual/nixpkgs/stable/#trivial-builder-writeShellApplication) accepts three arguments, `name`, `text`, and `runtimeInputs`. The `text` argument will accept our bash script through `readFile`. We can drop the `patchShebangs` hook too since `writeShellApplication` will remove the shebangs. And since we want to run the package `hello` after the countdown script, all we have to do is plug it in the `runtimeInputs` argument. It will export the path for us, which is quite convenient. Here is the full expression:

```nix
wrapped = pkgs.writeShellApplication {
  name = "wrapped-script";
  runtimeInputs = with pkgs; [
    hello
  ];
  text = builtins.readFile ./count-five.sh;
};
```
The full flake with this example can be found [here](https://github.com/nrdsp/nix-examples/tree/main/hello-example).
