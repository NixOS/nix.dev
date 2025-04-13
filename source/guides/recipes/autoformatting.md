(autoformatting)=
# Autoformatting

[`nixfmt`](https://github.com/NixOS/nixfmt) is the official Nix autoformatter.
Official tooling currently does not use nixfmt out of the box. Subscribe to
[NixOS/nix PR #11252](https://github.com/NixOS/nix/pull/11252) for updates on that effort.

Because `nixfmt` doesn't support formatting whole directory trees, you need
additional tooling such as `treefmt`. The `nixfmt-tree` package provides a
`treefmt` pre-configured to run `nixfmt` on all nix files in your project. Just
add it to your shell:

```nix
mkShell {
  packages = [ pkgs.nixfmt-tree ];
}
```

Note: this assumes you're project is in a git repository, and you wish to treat
the entire repo as your project to be formatted.

If you need to configure any [treefmt options], or enable formatting other
(non-nix) files, you can use `treefmt.withConfig`:

[treefmt options]: https://treefmt.com/latest/getting-started/configure/#global-options

```nix
pkgs.treefmt.withConfig {
  runtimeInputs = [
    pkgs.nixfmt-rfc-style
    pkgs.ruff
  ];

  settings = {
    # Customize detection of the root of the project.
    tree-root-file = "flake.nix";

    # Configure nixfmt for .nix files.
    formatter.nixfmt = {
      command = "nixfmt";
      includes = [ "*.nix" ];
    };

    # And for .py file.
    formatter.ruff = {
      command = "ruff";
      options = [ "format" ];
      includes = [ "*.py" ];
    };
  };
}
```

This can get a little tedious.
[treefmt-nix](https://github.com/numtide/treefmt-nix) has a big library of
preconfigured formatters, and provides a `check` derivation you can use in CI.
