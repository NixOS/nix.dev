(source-file-selection)=
# Source file selection
<!-- Note on title choice: While there's more uses outside of sources, it's by far the most prominent one -->

<!-- TODO: Switch all mentions of unstable to stable once 23.11 is out -->

To build a local project in a Nix derivation, its source files must be accessible to the builder.
But since the builder runs in an isolated environment (if the [sandbox](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-sandbox) is enabled),
it won't have access to the local project files by default.

To make this work regardless, the Nix language has certain builtin features to copy local paths to the Nix store,
whose paths are then accessible to derivation builders [^1].

[^1]: Technically only Nix store paths from the derivations inputs can be accessed,
but in practice this distinction is not important.

These builtin features are very limited in functionality and are not recommended for anything non-trivial. For more advanced use cases, the file set library should be used instead.

In this tutorial you'll learn both how to use the builtins and the file set library.

## Setting up a local experiment

To experiment with source file selection, we'll set up a local project.

To start out, create a new directory, enter it, and set up `niv` to manage the Nixpkgs dependency:
```shell-session
$ mkdir select
$ cd select
$ nix-shell -p niv --run "niv init --nixpkgs nixos/nixpkgs --nixpkgs-branch nixos-unstable"
```

:::{note}
For now we're using the nixos-unstable channel, since no stable channel has all the features we need yet.
:::

Then create a `default.nix` file with these contents:
```nix
{
  system ? builtins.currentSystem,
  sources ? import ./nix/sources.nix,
}:
let
  pkgs = import sources.nixpkgs {
    # Ensure purity
    config = { };
    overlays = [ ];
    inherit system;
  };
in
{
  package = pkgs.callPackage ./package.nix { };
  inherit pkgs;
}
```

In this tutorial we'll experiment with different `package.nix` contents, while keeping `default.nix` the same.

For now, let's have a simple `package.nix` to verify everything works so far:

```nix
{ runCommand }:
runCommand "hello" { } ''
  echo hello world
''
```

And try it out:
```shell-session
$ nix-build -A package
this derivation will be built:
  /nix/store/kmf9sw8fn7ps3ndqs31hvqwsa35b8l3g-hello.drv
building '/nix/store/kmf9sw8fn7ps3ndqs31hvqwsa35b8l3g-hello.drv'...
hello world
error: builder for '/nix/store/kmf9sw8fn7ps3ndqs31hvqwsa35b8l3g-hello.drv'
  failed to produce output path for output 'out'
```

We could also add `touch $out` to make the build succeed,
but we'll omit that for the sake of the tutorial, since we only need the build logs.
This also makes it easier to build it again, since successful derivation builds would get cached.
From now on we'll also make build outputs a bit shorter for the sake of brevity.

## Builtins

### Coercion of paths to strings

The easiest way to use local files in builds is using the built-in coercion of [paths](https://nixos.org/manual/nix/stable/language/values.html#type-path) to strings.

Let's create a local `string.txt` file:
```
$ echo "This is a string" > string.txt
```

The two main ways to coerce paths to strings are:
- Interpolating paths in strings. To try that, change your `package.nix` file to:
  ```nix
  { runCommand }:
  runCommand "file-coercion" { } ''
    (
      set -x
      cat ${./string.txt}
    )
  ''
  ```

  :::{note}
  Interpolation into bash scripts generally requires [`lib.escapeShellArg`](https://nixos.org/manual/nixpkgs/stable/#function-library-lib.strings.escapeShellArg) for correct escaping.
  In this case however, the interpolation results in a Nix store path of the form `/nix/store/<hash>-<name>`,
  and all valid characters of such store paths don't need to be escaped in bash.
  :::

- Using paths as derivation attributes. To try that, change your `package.nix` file to:
  ```nix
  { runCommand }:
  runCommand "file-coercion" {
    stringFile = ./string.txt;
  } ''
    (
      set -x
      cat "$stringFile"
    )
  ''
  ```

  :::{note}
  Nowadays using the explicit `env` attribute is recommended to set environment variables.
  `env` doesn't implicitly coerce paths to strings, so it requires using string intepolation instead:
  ```nix
  { runCommand }:
  runCommand "file-coercion" {
    env.stringFile = "${./string.txt}";
  } ''
    (
      set -x
      cat "$stringFile"
    )
  ''
  ```
  :::

These all do the same when built:
```shell-session
$ nix-build -A package
building '/nix/store/9fi0khrkmqw5srjzjsfa0b05hf8div4c-file-coercion.drv'...
++ cat /nix/store/j5lwpnlfrngks3bpidfr5hcrhgq0fy78-string.txt
This is a string
```

As you can see, the `string.txt` file was hashed and added to the store,
which then allowed the build to access it.

The underlying functionality is the same as `nix-store --add` on an absolute path:
```shell-session
$ nix-store --add $(pwd)/string.txt
/nix/store/j5lwpnlfrngks3bpidfr5hcrhgq0fy78-string.txt
```

### Coercion of directory paths to strings

This path coercion also works on directories the same as it does on files, let's try it out:

```nix
{ runCommand, tree }:
runCommand "directory-coercion" {
  # To nicely show path contents
  nativeBuildInputs = [ tree ];
} ''
  tree ${./.}
''
```

Running it gives us:
```shell-session
$ nix-build -A package
building '/nix/store/6ybg4v48xy8azhrnfdccdmhd2gr938f5-directory-interpolation.drv'...
/nix/store/xdfchqpfx20ar9jil9kys99wc6hnm9zx-select
|-- default.nix
|-- nix
|   |-- sources.json
|   `-- sources.nix
|-- package.nix
`-- string.txt
```

It's also very common to use this for the [`src`](https://nixos.org/manual/nixpkgs/stable/#var-stdenv-src) variable in `stdenv.mkDerivation` like so:

```nix
{ stdenv, tree }:
stdenv.mkDerivation {
  name = "directory-coercion";
  src = ./.;
  nativeBuildInputs = [ tree ];
  postInstall = ''
    touch created-in-the-build
    tree
  '';
}
```

Setting `src` will copy the resulting store path into the build directory and mark it as mutable.
For the many commands that expect to be able to write to the current directory, this is great:

```shell-session
$ nix-build -A package
building '/nix/store/2cqd93fpnb4vqwkwmbl66dbxhndq1vhh-directory-coercion.drv'...
unpacking sources
unpacking source archive /nix/store/178fbwa8iwdl6b85yafksdbwlxf6mjca-select
[...]
.
|-- created-in-the-build
|-- default.nix
|-- nix
|   |-- sources.json
|   `-- sources.nix
|-- package.nix
`-- string.txt
```

However there are some subtle problems with this approach:
- Note how the name of the store path ends with `-select`.
  So the name of the local directory influenced the result.

  This means that whenever you rename the project directory
  or a collegue runs it in a different directory name,
  you're going to get different build results!

- All files in the directory are unconditionally added to the Nix store.

  This means that:
  - Even if your build only needs a few files,
    changing _any_ file in the directory requires rebuilding the derivation,
    potentially wasting a lot of time.

  - If you have any secrets in the current directory,
    they get imported into the Nix store too, exposing them to all users on the system!

### `builtins.path`

<!-- TODO: Use lib.cleanSourceWith instead and only briefly mention builtins.path? -->

The above problems can be fixed by using [`builtins.path`](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-path) instead.
It allows customising the name of the resulting store path with its `name` argument.
And it allows selecting the files that should be included with its `filter` argument.

```nix
{ runCommand, tree, lib }:
let
  src = builtins.path {
    # The convention is to use "source"
    name = "source";
    path = ./.;

    filter = pathString: type:
      # Recurse into directories
      type == "directory"
      # Don't include .nix files
      || ! lib.hasSuffix ".nix" pathString;
  };
in
stdenv.mkDerivation {
  name = "builtins-path";
  inherit src;
  nativeBuildInputs = [ tree ];
  postInstall = ''
    tree
  '';
}
```

The shown filter will recurse into all directories and filter out all `.nix` files:

```shell-session
$ nix-build -A package
building '/nix/store/3x051rr6fainqi3a4mmmb06145m0j0mw-builtins-path.drv'...
/nix/store/95mlqjmm13vd4ambw2pac5gj6i4wxcx4-source
|-- nix
|   `-- sources.json
`-- string.txt
```

Writing more complex `filter` functions however is notoriously tricky,
which is why it's not recommended to use this function directly.

## File sets

A better way to select local files is to use the [file set library](https://nixos.org/manual/nixpkgs/unstable/#sec-functions-library-fileset).
This library is an abstraction built on top of `builtins.path`, with essentially the same functionality, but with an easier and safer interface.

The library is based on the concept of file sets,
a data type representing a collection of local files.
File sets can be created, composed and used with the various functions of the library.

The easiest way to experiment with the file set library is to first use it through `nix repl`.
We can use the `pkgs` attribute exposed by `default.nix`
to define `fs = pkgs.lib.fileset` as a shorthand alias for the library:

```shell-session
$ nix repl -f .
[...]
nix-repl> fs = pkgs.lib.fileset
```

### Basics

It's probably the easiest to just jump right in
by using the [`trace`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.trace) function,
which pretty-prints the files included in a given file set:

```shell-session
nix-repl> fs.trace ./. null
trace: /home/user/select (all files in directory)
null
```

You might wonder where the file set here is, because we just passed a _path_ to the function!

The key is that for all file set functions that expect a file set for an argument, it also accepts a path instead.
Such a path argument is then [implicitly coerced](https://nixos.org/manual/nixpkgs/unstable/#sec-fileset-path-coercion)
to a file set that contains _all files under the given path_.
We can see this from the trace `/home/user/select (all files in directory)`

Note that in contrast to [coercion of paths to strings](#coercion-of-paths-to-strings),
file sets _never_ add their files to the Nix store unless explicitly requested.
So you don't have to worry about accidentally copying secrets into the store.

:::{tip}
The `trace` function pretty-prints its first agument and returns its second argument.
But since you often just need the pretty-printing in `nix repl`, you can omit the second argument:

```shell-session
nix-repl> fs.trace ./.
trace: /home/user/select (all files in directory)
«lambda @ /nix/store/1czr278x24s3bl6qdnifpvm5z03wfi2p-nixpkgs-src/lib/fileset/default.nix:555:8»
```
:::

This implicit coercion also works for files:

```shell-session
nix-repl> fs.trace ./string.txt
trace: /home/user/select
trace: - string.txt (regular)
```

We can see that in addition to the included file,
it also prints its [file type](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-readFileType).

And if we make a typo for a path that doesn't exist, the file set library adequately complains about it:

```shell-session
nix-repl> fs.trace ./string.nix
error: lib.fileset.trace: Argument (/home/user/select/string.nix)
  is a path that does not exist.
```

### Adding files to the Nix store

The file set library wouldn't be very useful if you couldn't also add its files to the Nix store for use in derivations.
That's where [`toSource`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.toSource) comes in.
It allows us to create a Nix store path containing exactly the files in the file set, with its root at a specific path.

Let's switch back to editing our `package.nix` file to try it out:

```nix
{ stdenv, tree, lib }:
let
  fs = lib.fileset;
in
stdenv.mkDerivation {
  name = "filesets";
  src = fs.toSource {
    root = ./.;
    fileset = ./string.txt;
  };
  nativeBuildInputs = [ tree ];
  postInstall = ''
    tree
  '';
}
```

Building this, we can see that indeed only `string.nix` was included:
```
$ nix-build
building '/nix/store/1cdgj8b1jrg2k751jidj9564r66lpvj9-filesets.drv'...
unpacking sources
unpacking source archive /nix/store/083k2phzhdakc649z5ql8f7cyisws6wp-source
[...]
.
`-- string.txt
```

We can also avoid using `tree` by using the `trace` function instead:

```nix
{ stdenv, lib }:
let
  fs = lib.fileset;
  sourceFiles = ./string.txt;
in
fs.trace sourceFiles
stdenv.mkDerivation {
  name = "filesets";
  src = fs.toSource {
    root = ./.;
    fileset = sourceFiles;
  };
}
```

And building it:

```
$ nix-build
trace: /home/user/select
trace: - string.txt (regular)
```

### Combinators

The real benefit of the file set library lies in its combinator functions.



<!--

Mention lib.cleanSource, it's kind of the only function there's no good replacement for yet

Section on file sets:
- Tracing file sets in nix repl
- Coercing file sets from paths
- Using files from a file set as a derivation source
- Migrate/integrate with lib.source-based filtering

A file structure to show?
- `.envrc`:
- `README.md`
- `Makefile`
- `nix`
  - `package.nix`
  - `sources.nix`
  - `sources.json`
- `src`
  - `main.c`
  - `main.o`
- `.gitignore`
- `.git`

-->
