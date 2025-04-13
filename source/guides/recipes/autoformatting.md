(autoformatting)=
# Autoformatting

[`nixfmt`](https://github.com/NixOS/nixfmt) is the official Nix autoformatter.

It is not yet wired up to any official tooling. Subscribe to [PR
11252 to NixOS/nix](https://github.com/NixOS/nix/pull/11252) for updates on
that effort.

The easiest way to leverage `nixfmt` in your project is with the `nixfmt-tree`
wrapper. Here's how:

- For `nix fmt` to format all Nix files, add this to the `flake.nix` outputs:

  ```nix
  formatter.''${system} = nixpkgs.legacyPackages.''${system}.nixfmt-tree;
  ```

- The same can be done more efficiently with the `treefmt` command,
  which you can get in `nix-shell`/`nix develop` by extending `mkShell` using

  ```nix
  mkShell {
    packages = [ pkgs.nixfmt-tree ];
  }
  ```

  You can then also use `treefmt` in a pre-commit/pre-push [Git hook](https://git-scm.com/docs/githooks)
  and `nixfmt` with your editors format-on-save feature.

- To check formatting in CI, run the following in a checkout of your Git repository:
  ```
  treefmt --ci
  ```

For more flexibility, you can customize this package using
```nix
nixfmt-tree.override {
  settings = { /* treefmt config */ };
  runtimePackages = [ /* List any formatters here */ ];
}
```

Alternatively you can switch to the more fully-featured [treefmt-nix](https://github.com/numtide/treefmt-nix).
