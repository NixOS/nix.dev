(dependency-management-niv)=
# Automatically managing remote sources with niv

The Nix language can be used to describe dependencies between files managed by Nix.
Nix expressions themselves can depend on remote sources, and there are multiple ways to specify their origin, as shown in [](pinning-nixpkgs).

For more automation around handling remote sources, set up [niv](https://github.com/nmattia/niv/) in your project:

```shell-session
$ nix-shell -p niv --run "niv init --nixpkgs nixos/nixpkgs --nixpkgs-branch nixos-23.11"
```

This command will fetch the latest revision of the Nixpkgs 23.05 release branch.
In the current directory it will generate `nix/sources.json`, which will contain a pinned reference to the obtained revision.
It will also create `nix/sources.nix`, which exposes those dependencies as an attribute set.

Import the generated `nix/sources.nix` as the default value for the argument to the function in `default.nix` and use it to refer to the Nixpkgs source directory:

```nix
{ sources ? import ./nix/sources.nix }:
let
  pkgs = import sources.nixpkgs {};
  build = pkgs.hello;
in {
  inherit build;
}
```

`nix-build` will call the top-level function with the empty attribute set `{}`, or with the attributes passed via [`--arg`](https://nixos.org/manual/nix/stable/command-ref/nix-build#opt-arg) or [`--argstr`](https://nixos.org/manual/nix/stable/command-ref/nix-build#opt-argstr).
This pattern allows [overriding remote sources](overriding-sources-niv) programmatically.

Add niv to the development environment for your project to have it readily available:

```diff
 { sources ? import ./nix/sources.nix }:
 let
   pkgs = import sources.nixpkgs {};
   build = pkgs.hello;
 in {
   inherit build;
+  shell = pkgs.mkShell {
+    inputsFrom = [ build ];
+    packages = with pkgs; [
+      niv
+    ];
+  };
 }
```

Also add a `shell.nix` to enter that environment more conveniently:

```nix
(import ./. {}).shell
```

See [](./sharing-dependencies) for details, and note that here you have to pass an empty attribute set to the imported expression, since `default.nix` now contains a function.

(overriding-sources-niv)=
## Overriding sources

As an example, we will use the previously created expression with an older version of Nixpkgs.

Enter the development environment, create a new directory, and set up niv with a different version of Nixpkgs:

```shell-session
$ nix-shell
[nix-shell]$ mkdir old
[nix-shell]$ cd old
[nix-shell]$ niv init --nixpkgs nixos/nixpkgs --nixpkgs-branch 23.05
```

Create a file `default.nix` in the new directory, and import the original one with the `sources` just created.

```nix
import ../default.nix { sources = import ./nix/sources.nix; }
```

This will result in a different version being built:

```shell-session
$ nix-build -A build
$ ./result/bin/hello --version | head -1
hello (GNU Hello) 2.12
```

Sources can also be overridden on the command line:

```shell-session
nix-build .. -A build --arg sources 'import ./nix/sources.nix'
```

Check the built-in help for details:

```shell-session
niv --help
```

## Next steps

- For more details and examples of the different ways to specify remote sources, see [](pinning-nixpkgs).
