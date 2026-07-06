(sharing-dependencies)=
# Dependencies in the development shell

When [packaging software in `default.nix`](packaging-tutorial), you'll want a [development environment in `shell.nix`](declarative-reproducible-envs) to enter conveniently with `nix-shell` or [automatically with `direnv`](./direnv).

How to share the package's dependencies in `default.nix` with the development environment in `shell.nix`?

## Summary

Use the [`inputsFrom` attribute to `pkgs.mkShellNoCC`](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell-attributes):

```nix
# default.nix
let
  pkgs = import <nixpkgs> {};
  myPackage = pkgs.callPackage ./package.nix {};
in
{
  inherit myPackage;
  shell = pkgs.mkShellNoCC {
    inputsFrom = [ myPackage ];
  };
}
```

Import the `shell` attribute in `shell.nix`:

```nix
# shell.nix
(import ./.).shell
```

## Complete example

Assume your package is defined in `package.nix`:

```nix
# package.nix
{ cowsay, runCommand }:
runCommand "cowsay-output" { buildInputs = [ cowsay ]; } ''
  cowsay Hello, Nix! > $out
''
```

In this example, `cowsay` is declared as a build-time dependency using `buildInputs`.

Further assume your project is defined in `default.nix`:

```nix
# default.nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
{
  myPackage = pkgs.callPackage ./package.nix {};
}
```

Add an attribute to `default.nix` specifying an environment:


```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
 in
 {
   myPackage = pkgs.callPackage ./package.nix {};
+  shell = pkgs.mkShellNoCC {
+  };
 }
```

Move the `myPackage` attribute into the `let` binding to be able to re-use it.
Then take the package's dependencies into the environment with [`inputsFrom`](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell-attributes):

```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
+  myPackage = pkgs.callPackage ./package.nix {};
 in
 {
-  myPackage = pkgs.callPackage ./package.nix {};
+  inherit myPackage;
   shell = pkgs.mkShellNoCC {
+    inputsFrom = [ myPackage ];
   };
 }
```

Finally, import the `shell` attribute in `shell.nix`:

```nix
# shell.nix
(import ./.).shell
```

Check the development environment, it contains the build-time dependency `cowsay`:

```console
$ nix-shell --pure
[nix-shell]$ cowsay shell.nix
```

## Next steps

- [](pinning-nixpkgs)
- [](./direnv)
- [](python-dev-environment)
- [](packaging-tutorial)
