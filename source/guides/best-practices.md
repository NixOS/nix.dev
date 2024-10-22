# Best practices

## URLs

The Nix language syntax supports bare URLs, so one could write `https://example.com` instead of `"https://example.com"`

[RFC 45](https://github.com/NixOS/rfcs/pull/45) was accepted to deprecate unquoted URLs and provides
a number of arguments how this feature does more harm than good.

:::{tip}
Always quote URLs.
:::

(rec-expression)=
## Recursive attribute set `rec { ... }`

`rec` allows you to reference names within the same attribute set.

Example:

```{code-block} nix
:class: expression
rec {
  a = 1;
  b = a + 2;
}
```

```{code-block}
:class: value
{ a = 1; b = 3; }
```

A common pitfall is to introduce a hard to debug error `infinite recursion` when shadowing a name.
The simplest example for this is:

```{code-block} nix
let a = 1; in rec { a = a; }
```

:::{tip}
Avoid `rec`. Use `let ... in`.

Example:

```{code-block} nix
:class: expression
let
  a = 1;
in {
  a = a;
  b = a + 2;
}
```
:::

:::{tip}
Self-reference can be achieved by explicitly naming the attribute set:

```{code-block} nix
:class: expression
let
  argset = {
    a = 1;
    b = argset.a + 2;
  };
in
  argset
```
:::

## `with` scopes

It's still common to see the following expression in the wild:

```{code-block} nix
:class: expression
with (import <nixpkgs> {});

# ... lots of code
```

This brings all attributes of the imported expression into scope of the current expression.

There are a number of problems with that approach:

- Static analysis can't reason about the code, because it would have to actually evaluate this file to see which names are in scope.
- When more than one `with` is used, it's not clear anymore where the names are coming from.
- Scoping rules for `with` are not intuitive, see this [Nix issue for details](https://github.com/NixOS/nix/issues/490).

:::{tip}
Do not use `with` at the top of a Nix file.
Explicitly assign names in a `let` expression.

Example:

```{code-block} nix
:class: expression
let
  pkgs = import <nixpkgs> {};
  inherit (pkgs) curl jq;
in

# ...
```
:::

Smaller scopes are usually less problematic, but can still lead to surprises due to scoping rules.

:::{tip}
If you want to avoid `with` altogether, try replacing expressions of this form

```{code-block} nix
:class: expression
buildInputs = with pkgs; [ curl jq ];
```

with the following:

```{code-block} nix
:class: expression
buildInputs = builtins.attrValues {
  inherit (pkgs) curl jq;
};
```
:::

(search-path)=
## `<...>` lookup paths

You will often encounter Nix language code samples that refer to `<nixpkgs>`.

`<...>` is special syntax that was [introduced in 2011] to conveniently access values from the environment variable [`$NIX_PATH`].

[introduced in 2011]: https://github.com/NixOS/nix/commit/1ecc97b6bdb27e56d832ca48cdafd3dbb5185a04
[`$NIX_PATH`]: https://nix.dev/manual/nix/stable/command-ref/env-common.html#env-NIX_PATH

This means, the value of a lookup path depends on external system state.
When using lookup paths, the same Nix expression can produce different results.

In most cases, `$NIX_PATH` is set to the latest channel when Nix is installed, and is therefore likely to differ from machine to machine.

:::{note}
[Channels](https://nix.dev/manual/nix/stable/command-ref/nix-channel.html) are a mechanism for referencing remote Nix expressions and retrieving their latest version.
:::

The state of a subscribed channel is external to the Nix expressions relying on it.
It is not easily portable across machines.
This may limit reproducibility.

For example, two developers on different machines are likely to have `<nixpkgs>` point to different revisions of the {term}`Nixpkgs` repository.
Builds may work for one and fail for the other, causing confusion.

:::{tip}
Declare dependencies explicitly using the techniques shown in [](pinning-nixpkgs).

Do not use lookup paths, except in minimal examples.
:::

Some tools expect the lookup path to be set. In that case:

::::{tip}
Set `$NIX_PATH` to a known value in a central location under version control.

:::{admonition} NixOS
On NixOS, `$NIX_PATH` can be set permanently with the [`nix.nixPath`](https://search.nixos.org/options?show=nix.nixPath) option.
:::
::::

(nixpkgs-config)=
## Reproducible Nixpkgs configuration

To quickly obtain packages for demonstration, we use the following concise pattern:

```nix
import <nixpkgs> {}
```

However, even when `<nixpkgs>` is replaced as shown in [](pinning-nixpkgs), the result may still not be fully reproducible.
This is because, for historical reasons, the [Nixpkgs top-level expression] by default impurely reads from the file system to obtain configuration parameters.
Systems that have the appropriate files populated may end up with different results.

[Nixpkgs top-level expression]: https://github.com/NixOS/nixpkgs/blob/master/default.nix

It is a well-known problem that can't be resolved without breaking existing setups.

:::{tip}
Explicitly set [`config`](https://nixos.org/manual/nixpkgs/stable/#chap-packageconfig) and [`overlays`](https://nixos.org/manual/nixpkgs/stable/#chap-overlays) when importing Nixpkgs:


```nix
import <nixpkgs> { config = {}; overlays = []; }
```
:::

This is what we do in our tutorials to ensure that the examples will behave exactly as expected.
We skip it in minimal examples to reduce distractions.

## Updating nested attribute sets

The [attribute set update operator](https://nix.dev/manual/nix/stable/language/operators.html#update) merges two attribute sets.

Example:

```{code-block} nix
:class: expression
{ a = 1; b = 2; } // { b = 3; c = 4; }
```

```{code-block} nix
:class: value
{ a = 1; b = 3; c = 4; }
```

However, names on the right take precedence, and updates are shallow.

Example:

```{code-block} nix
:class: expression
{ a = { b = 1; }; } // { a = { c = 3; }; }
```

```{code-block} nix
:class: value
{ a = { c = 3; }; }
```

Here, key `b` was completely removed, because the whole `a` value was replaced.

:::{tip}
Use the [`pkgs.lib.recursiveUpdate`](https://nixos.org/manual/nixpkgs/stable/#function-library-lib.attrsets.recursiveUpdate) Nixpkgs function:

```{code-block} nix
:class: expression
let pkgs = import <nixpkgs> {}; in
pkgs.lib.recursiveUpdate { a = { b = 1; }; } { a = { c = 3;}; }
```

```{code-block} nix
:class: value
{ a = { b = 1; c = 3; }; }
```
:::

## Reproducible source paths

```{code-block} nix
:class: expression
let pkgs = import <nixpkgs> {}; in

pkgs.stdenv.mkDerivation {
  name = "foo";
  src = ./.;
}
```

If the Nix file containing this expression is in `/home/myuser/myproject`, then the store path of `src` will be `/nix/store/<hash>-myproject`.

The problem is that now your build is no longer reproducible, as it depends on the parent directory name.
That cannot be declared in the source code, and results in an impurity.

If someone builds the project in a directory with a different name, they will get a different store path for `src` and everything that depends on it.
This can be the cause of needless rebuilds.

:::{tip}
Use [`builtins.path`](https://nix.dev/manual/nix/stable/language/builtins.html#builtins-path) with the `name` attribute set to something fixed.

This will derive the symbolic name of the store path from `name` instead of the working directory:

```{code-block} nix
:class: expression
let pkgs = import <nixpkgs> {}; in

pkgs.stdenv.mkDerivation {
  name = "foo";
  src = builtins.path { path = ./.; name = "myproject"; };
}
```
:::
