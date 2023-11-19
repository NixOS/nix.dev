(source-file-selection)=
# Source file selection
<!-- Note on title choice: While there's more uses outside of sources, it's by far the most prominent one -->

To build a local project in a Nix derivation, its source files must be accessible to the builder.
But since the builder runs in an isolated environment (if the [sandbox](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-sandbox) is enabled),
it won't have access to the local project files by default.

To make this work, the Nix language has certain builtin features to copy local paths to the Nix store,
whose paths are then accessible to derivation builders [^1].

[^1]: Technically only Nix store paths from the derivations inputs can be accessed,
but in practice this distinction is not important.

These builtin features are very limited in functionality and are not recommended if you need to do anything more advanced.

For advanced uses, use the file set library instead.

## Builtins

### Path coercion to strings

The most transparent builtin feature is coercion of paths to strings, such as:
- Interpolating paths in strings:
  ```nix
  { runCommandCC }:
  runCommandCC "test" { } ''
    cc ${./main.c} -o $out
  ''
  ```
- Using paths as derivation attributes:
  ```nix
  { stdenv }:
  stdenv.mkDerivation {
    name = "test";
    src = ./.;
  }
  ```

In both of these cases, the path gets imported into the Nix store
and transparently converted to its Nix store path.

Some problems with this approach include:
- The base name of the path influences the store path, even for `./.`.
- All files in directories are unconditionally imported, even if they're unnecessary, impure or even meant to be private.

### `builtins.path`

The above problems can be fixed by using [`builtins.path`](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-path) instead.
It allows customising the name of the resulting store path with its `name` argument.
And it allows selecting the files that should be included with its `filter` argument.

```nix
builtins.path {
  name = "source";
  path = ./.;
  filter = pathString: type:
    baseNameOf pathString != "default.nix";
```

This function is notoriously hard to use correctly by itself.

<!--

Mention lib.cleanSource, it's kind of the only function there's no good replacement for yet

Section on file sets:
- Tracing file sets in nix repl
- Coercing file sets from paths
- Using files from a file set as a derivation source
- Migrate/integrate with lib.source-based filtering

-->
