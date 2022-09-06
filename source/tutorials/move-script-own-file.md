(move-script-own-file)=

# Moving a bash script into its own file

In this tutorial we will move an inline bash script into its own file. Along the way, we will discuss functions `readFile`, `symlinkJoin`, `writeShellScriptBin` and `writeShellApplication`. 

Before going any further, however, a brief word about what the bash script does as it will help us better understand the steps required to move it out of our flake. The bash script that we will be working with creates a new directory, symlinks every archive file in `${riscv-toolchain.newlib-nano}"/riscv32-none-elf/lib/`, and renames them by appending "_nano" to their base name. This is what the script looks like in the outputs attribute:

```nix
nanolibs-script = {
  name = "nanolibs-path";
  source = ''
    rm -fr nanolibs/*.a
    mkdir -p nanolibs
    for file in "${riscv-toolchain.newlib-nano}"/riscv32-none-elf/lib/*.a; do
      ln -s "$file" nanolibs
    done
    for file in nanolibs/*.a; do
      mv "$file" "''${file%%.a}_nano.a"
    done
  '';
  buildInputs = [
    riscv-toolchain.newlib-nano
  ];
};
```

The first thing that we will need to do is to move the bash script into its own file, with only a shebang added to first line. We will create it in the same directory as the flake:

```bash
#!/usr/bin/env bash

rm -fr nanolibs/*.a
mkdir -p nanolibs
for file in "${riscv-toolchain.newlib-nano}"/riscv32-none-elf/lib/*.a; do
   ln -s "$file" nanolibs
done
for file in nanolibs/*.a; do
   mv "$file" "${file%%.a}_nano.a"
done
```

Back to our flake, we will use the `patchShebangs` hook available to us via the Nixpkgs default standard environment together with the builtin function `readFile`. These will rewrite the script and return its contents as a string without the shebang line interpreter.

Finally, we use [`writeShellScriptBin`](https://nixos.org/manual/nixpkgs/stable/#trivial-builder-writeText), passing the arguments `name` and `text`. The function `writeShellScriptBin` will write the contents of our script under $out to the store, already without the shebang, and make it executable. This is how it looks like:

```nix
nanolibs-script = rec {
  name = "nanolibs-path";
  text  = builtins.readFile ./nanolibs-script.sh;
  script = (pkgs.writeShellScriptBin name text).overrideAttrs(old: {
    buildCommand = "${old.buildCommand}\n patchShebangs $out";
  });
  buildInputs = [
    riscv-toolchain.newlib-nano
  ];
};
```
:::{note}
We could have added the `name` and `text` arguments directly to the script line. By using the name and text bindings, however, we avoid cluttering the line, making it more easy to read. We could also move them out of the nanolibs-script attribute within our let-in statement, in which case we wouldn't need the `rec` statement as they would be picked up by the surrounding lexical scope. More details [here](https://nixos.wiki/wiki/Overview_of_the_Nix_Language), under the `rec statement` heading.
:::

In order to execute this script, we still need to create a derivation that we can call elsewhere, either from another derivation or a developer shell. We can do this with [`symlinkJoin`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/trivial-builders.nix#L388). If you look at the documentation for this function, you'll read that it "_creates a single derivation that replicates the directory structure of all the input paths._" It accepts a `name` and a `paths` arguments. Since we're dealing with a single path only, all we need to do is to add the script wrapper declared above to the `paths` argument: 

```nix
nanolibsPath = pkgs.symlinkJoin {
  name = "nanolibs-path";
  paths = nanolibs-script.script;
};
```

Now, if you had a developer shell, you could easily call the executable inside a `shellHook` with `nix run`, like this:

```nix
devShells = {
  fe310Shell = pkgs.mkShell {
    buildInputs = with pkgs; [
      riscv-toolchain.buildPackages.gcc
      openocd
   ];
   shellHook = ''
      nix run .#nanolibsScript
   '';
};
```

We still have a problem, the string antiquote `${riscv-toolchain.newlib-nano}` will not work from an external file through `readFile`. One option that we could go with is the function [`substituteInPlace`](https://nixos.org/manual/nixpkgs/stable/#fun-substituteInPlace), which uses the `@varName@` placeholder format. For instance, if we were to replace the string antiquote with `@NANOLIBS_PATH@`, in addition to the `--subst-var-by` flag, the path to where the archive files live would be added at build time:

```nix
shellHook = ''
  substituteInPlace ./nanolibs-script.sh --subst-var-by NANOLIBS_PATH "${riscv-toolchain.newlib-nano}/riscv32-none-elf/lib/*.a"
  nix run .#nanolibsPath
'';
```

Similarly, we could use the `substitute` function, again with the flag `--subst-var-by`, in which case the `text` argument for `writeShellScriptBin` in our let-in statement will have to point to the new file:

```nix
shellHook = ''
  substitute ./nanolibs-script.sh ./nanolibs-script-with-path.sh --subst-var-by NANOLIBS_PATH "${riscv-toolchain.newlib-nano}/riscv32-none-elf/lib/*.a"
  nix run .#nanolibsPath
'';
```

```nix
text = builtins.readFile ./nanolibs-script-with-path.sh;
```

The advantage of this function over `substituteInPlace` is that the original script is kept intact. However, it doesn't take too long to realise that neither `substituteInPlace` nor `substitute ` make much sense. With `substituteInPlace`, we still have a form of string interpolation that is not compatible with bash. As to the `substitute` function, it creates an additional file, which seems unnecessary. 

What we need is an environment variable that we can export in our flake when necessary. We could go with `$NANOLIBS_PATH` as it is descriptive enough. In the bash script, we just need to replace `for file in "${riscv-toolchain.newlib-nano}"/riscv32-none-elf/lib/*.a; do` with `for file in $NANOLIBS_PATH; do`. Then, in the `shellHook` hook located in our developer shell, we simply need to export the variable:

```nix
shellHook = ''
  export NANOLIBS_PATH="${riscv-toolchain.newlib-nano}"/riscv32-none-elf/lib/*.a
  nix run .#nanolibsPath
'';
```
All in all, the best solution for this particular case is also the most straightforward, an environment variable. And since we are at it, we may as well get rid of both `writeShellScriptBin` and `symlinkJoin` as `writeShellApplication` will write our script to the store making it executable and do the symlinking for us, all in one single stroke.

[`writeShellApplication`](https://nixos.org/manual/nixpkgs/stable/#trivial-builder-writeShellApplication) accepts three arguments, `name`, `text`, and `runtimeInputs`. The `text` argument will accept our bash script through `readFile`, whereas our only dependency will be plugged in the `runtimeInputs` argument. Meaning that we can do away with the nanolibs-script attribute set in our let-in statement. We can drop the `patchShebangs` hook too since `writeShellApplication` will remove the shebangs. Here is the full expression:

```nix
nanolibsPath = pkgs.writeShellApplication {
  name = "nanolibs-path";
  runtimeInputs = with pkgs; [
    riscv-toolchain.newlib-nano
  ];
  text = builtins.readFile ./nanolibs-script.sh;
};
```

:::{note}
This tutorial combines several comments from this [discussion](https://discourse.nixos.org/t/move-script-from-flake-into-its-own-file/21158). A full flake can be found [here](https://github.com/ngi-nix/riscv-phone/blob/fe310/flake.nix).
:::
