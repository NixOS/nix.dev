(pinning-nixpkgs-with-niv)=

# Dependency management with niv

## What will you learn?

todo 

## What do you need?

todo

## Dependency management with niv <!-- todo fix double heading -->

If you'd like a bit more automation around bumping dependencies, including Nixpkgs,
[niv](https://github.com/nmattia/niv/) is made for exactly that. Niv itself is available in `nixpkgs` so using it is simple:

```
$ nix-shell -p niv --run "niv init"
```

This command will generate `nix/sources.json` with information about how and where dependencies are fetched. 
It will also create `nix/sources.nix`, which glues the sources together in Nix.

By default, `niv` will use the **latest stable** NixOS release. 
However, you should check to see which version is currently specified in [the niv repository](https://github.com/nmattia/niv) if you require a specific release, as it might lag behind.

You can see which version `niv` is tracking as follows:

```
$ niv show
```

And you can change the tracking branch to the one you want like this:

```
$ niv modify nixpkgs --branch nixos-21.05
```
You can use the generated `nix/sources.nix` with a top-level `default.nix`:

```nix
{ sources ? import ./nix/sources.nix
, pkgs ? import sources.nixpkgs {}
}:

...
```

And you can update all the dependencies by running:

```
$ nix-shell -p niv --run "niv update"
```

## Next steps

- To quickly set up a Nix project, read through
  [Getting started Nix template](https://github.com/nix-dot-dev/getting-started-nix-template).
