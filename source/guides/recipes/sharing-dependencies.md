(sharing-dependencies)=
# Dependencies in the development shell

When [packaging software in `default.nix`](packaging-existing-software), you'll want a [development environment in `shell.nix`](declarative-reproducible-envs) to enter it conveniently with `nix-shell` or [automatically with `direnv`](./direnv).

How to share the package's dependencies in `default.nix` with the development environment in `shell.nix`?

## Summary

Use the `inputsFrom` attribute to `pkgs.mkShell`:

```nix
# default.nix
let
  pkgs = import <nixpkgs> {};
  build = pkgs.callpackage ./build.nix {};
in
{
  inherit build;
  shell = pkgs.mkShell {
    inputsfrom = [ build ];
  };
}
```

Import the `shell` attribute in `shell.nix`:

```nix
# shell.nix
(import ./.).shell
```

## Complete example

Assuming your build is defined in `build.nix`:

```nix
# build.nix
{ hello }: hello
```

and your project is defined in `default.nix`:

```nix
# default.nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
{
  build = pkgs.callPackage ./build.nix {};
}
```

Add an attribute to `default.nix` specifying an environment:


```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
 in
 {
   build = pkgs.callPackage ./build.nix {};
+  shell = pkgs.mkShell {
+  };
 }
```

Move the `build` attribute into the `let` binding to be able to re-use it.
Then take the package's dependencies into the environment with `inputsFrom`:

```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
+  build = pkgs.callPackage ./build.nix {};
 in
 {
-  build = pkgs.callPackage ./build.nix {};
+  inherit build;
   shell = pkgs.mkShell {
+    inputsFrom = [ build ];
+    packages = [ which ];
   };
 }
```

:::{note}
Here we also added `which` to the shell's `packages` to be able to quickly check the presence of the build inputs.
:::

Finally, import the `shell` attribute in `shell.nix`:

```nix
# shell.nix
(import ./.).shell
```

Test the development environment:

```console
$ nix-shell --pure
[nix-shell]$ which gcc
```

## Next steps

- [](pinning-nixpkgs)
- [](./direnv)
- [](python-dev-environment)
- [](packaging-existing-software)
