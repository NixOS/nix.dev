(dependency-management-npins)=
# Automatically managing remote sources with `npins`

The Nix language can be used to describe dependencies between files managed by Nix.
Nix expressions themselves can depend on remote sources, and there are multiple ways to specify their origin, as shown in [](pinning-nixpkgs).

For more automation around handling remote sources, set up [`npins`](https://github.com/andir/npins/) in your project:

```shell-session
$ nix-shell -p npins --run "npins init --bare; npins add github nixos nixpkgs --branch nixos-23.11"
```

This command will fetch the latest revision of the Nixpkgs 23.11 release branch.
In the current directory it will generate `npins/sources.json`, which will contain a pinned reference to the obtained revision.
It will also create `npins/default.nix`, which exposes those dependencies as an attribute set.

Import the generated `npins/default.nix` as the default value for the argument to the function in `default.nix` and use it to refer to the Nixpkgs source directory:

```nix
{
  sources ? import ./npins,
  system ? builtins.currentSystem,
  pkgs ? import sources.nixpkgs { inherit system; config = {}; overlays = []; },
}:
{
  package = pkgs.hello;
}
```

`nix-build` will call the top-level function with the empty attribute set `{}`, or with the attributes passed via [`--arg`](https://nix.dev/manual/nix/stable/command-ref/nix-build#opt-arg) or [`--argstr`](https://nix.dev/manual/nix/stable/command-ref/nix-build#opt-argstr).
This pattern allows [overriding remote sources](overriding-sources-npins) programmatically.

Add `npins` to the development environment for your project to have it readily available:

```diff
 {
   sources ? import ./npins,
   system ? builtins.currentSystem,
   pkgs ? import sources.nixpkgs { inherit system; config = {}; overlays = []; },
 }:
-{
+rec {
   package = pkgs.hello;
+  shell = pkgs.mkShellNoCC {
+    inputsFrom = [ package ];
+    packages = with pkgs; [
+      npins
+    ];
+  };
 }
```

Also add a `shell.nix` to enter that environment more conveniently:

```nix
(import ./. {}).shell
```

See [](./sharing-dependencies) for details, and note that here you have to pass an empty attribute set to the imported expression, since `default.nix` now contains a function.

(overriding-sources-npins)=
## Overriding sources

As an example, we will use the previously created expression with an older version of Nixpkgs.

Enter the development environment, create a new directory, and set up npins with a different version of Nixpkgs:

```shell-session
$ nix-shell
[nix-shell]$ mkdir old
[nix-shell]$ cd old
[nix-shell]$ npins init --bare
[nix-shell]$ npins add github nixos nixpkgs --branch nixos-21.11
```

Create a file `default.nix` in the new directory to import the original one with the `sources` you just created.

```nix
import ../default.nix { sources = import ./npins; }
```

This will result in a different version being built:

```shell-session
$ nix-build -A build
$ ./result/bin/hello --version | head -1
hello (GNU Hello) 2.10
```

Sources can also be overridden on the command line:

```shell-session
nix-build .. -A build --arg sources 'import ./npins'
```

## Migrating from `niv`

A previous version of this guide recommended using [`niv`](https://github.com/nmattia/niv/), a similar pin manager written in Haskell.

If you have a project using `niv`, you can import remote source definitions into `npins`:

```shell-session
npins import-niv
```

:::{warning}
All the imported entries will be updated, so they won't necessarily point to the same commits as before!
:::

## Managing NixOS configurations

NixOS relies on the `NIX_PATH` environment variable to locate `nixpkgs`, which defaults to using channels.
To instead use a `nixpkgs` version managed by `npins`, one can manually override this environment variable on system rebuilds:

```bash
sudo NIX_PATH="nixos-config=configuration.nix:nixpkgs=$(nix-instantiate --raw --eval npins -A nixpkgs.outPath)" nixos-rebuild switch
```

To make such pinned dependencies available as [look-up paths](https://nix.dev/tutorials/nix-language.html#lookup-paths) (like `<nixpkgs>`) while using the NixOS configuration, one may use:

```nix
# configuration.nix
{ lib, ... }:
let
  sources = import ./npins;
in
{
  # ...
  nix.channel.enable = false;
  nix.nixPath = lib.mapAttrsToList (k: v: "${k}=${v}") sources;
}
```

To use the [v3 command line] and run programs from dependencies
exposing packages through a [flake], like `nix run nixpkgs#hello`,
you can enable flakes and add the pins to the flake registry like:

```nix
# configuration.nix
{ lib, ... }:
let
  sources = import ./npins;
in
{
  # ...
  experimental-features = "nix-command flakes";
  nix.registry = lib.mapAttrs (_: path: {
    to = {
      type = "path";
      inherit path;
    };
  }) sources;
```

[v3 command line]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix.html
[flake]: https://nix.dev/concepts/flakes

## Next steps

- Check the built-in help for more information:

  ```shell-session
  npins --help
  ```

- For more details and examples of the different ways to specify remote sources, see [](pinning-nixpkgs).
