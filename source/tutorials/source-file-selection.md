(file-sets)=
# File sets
<!-- TODO: Switch all mentions of unstable to stable once 23.11 is out -->

To build a local project in a Nix derivation, its source files must be accessible to the builder.
But since the builder runs in an isolated environment (if the [sandbox](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-sandbox) is enabled),
it won't have access to the local project files by default.

To make this work regardless, the Nix language has certain builtin features to copy local paths to the Nix store,
whose paths are then accessible to derivation builders [^1].
However using the builtin features directly can be very tricky.

[^1]: Technically only Nix store paths from the derivations inputs can be accessed,
but in practice this distinction is not important.

In this tutorial you'll learn how to use the [file set library](https://nixos.org/manual/nixpkgs/unstable/#sec-functions-library-fileset) instead.
It abstracts over the builtin features with essentially the same functionality,
but an easier and safer interface.

## Basics

The file set library is based on the concept of _file sets_,
a conceptual data type representing a collection of local files.
File sets can be created, composed and used with the various functions of the library.

The easiest way to experiment with the file set library is to first use it through `nix repl`.

```shell-session
$ nix repl -f channel:nixos-unstable
[...]
nix-repl> fs = lib.fileset
```

It's probably the easiest to just jump right in
by using the [`trace`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.trace) function,
which pretty-prints the files included in a given file set:

```shell-session
nix-repl> fs.trace ./. null
trace: /home/user/select (all files in directory)
null
```

You might wonder where the file set here is, because we just passed a _path_ to the function!

The key is that for all functions that expect a file set for an argument, they also accepts paths instead.
Such path arguments are then [implicitly coerced](https://nixos.org/manual/nixpkgs/unstable/#sec-fileset-path-coercion)
to file sets containing _all files under the given path_.
We can see this from the trace `/home/user/select (all files in directory)`

File sets _never_ add their files to the Nix store unless explicitly requested.
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

## Setting up a local experiment

To further experiment with the library, let's set up a local project.

To start out, create a new directory, enter it, and set up `niv` to pin the Nixpkgs dependency:
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
pkgs.callPackage ./package.nix { }
```

From now on we'll just change the contents of `package.nix` while keeping `default.nix` the same.

For now, let's have a simple `package.nix` to verify everything works so far:

```nix
{ runCommand }:
runCommand "hello" { } ''
  echo hello world
''
```

And try it out:
```shell-session
$ nix-build
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

## Adding files to the Nix store

The file set library wouldn't be very useful if you couldn't also add its files to the Nix store for use in derivations.
That's where [`toSource`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.toSource) comes in.
It allows us to create a Nix store path containing exactly only the files that are in the file set,
added to the Nix store rooted at a specific path.

Let's try it out by defining `package.nix` as follows:

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

But the real benefit of the file set library lies in its combinator functions.
These allow you to compose file sets in different ways to achieve complex behavior.

## Avoiding unnecessary rebuilds

To show some more motivation,
let's first use the file set library to include all files in the local directory in the build,
and have it succeed by coping the `string.txt` file to the output:

```nix
{ stdenv, lib }:
let
  fs = lib.fileset;
  sourceFiles = ./.;
in
fs.trace sourceFiles
stdenv.mkDerivation {
  name = "filesets";
  src = fs.toSource {
    root = ./.;
    fileset = sourceFiles;
  };
  postInstall = ''
    cp -v string.txt $out
  '';
}
```

Building this we get:

```shell-session
$ nix-build -A package
trace: /home/user/select (all files in directory)
this derivation will be built:
  /nix/store/d8mj3z49s24q46rncma6v9kvi6xbx4vq-filesets.drv
[...]
/nix/store/v5sx60xd9lvylgqcyqpchac1a2k8300c-filesets
```

But if you rebuild again, you get something different!
```shell-session
$ nix-build -A package
trace: /home/user/select (all files in directory)
this derivation will be built:
  /nix/store/1xb412x3fzavr8d8c3hbl3fv9kyvj77c-filesets.drv
[...]
/nix/store/n9i6gaf80hvbfplsv7zilkbfrz47s4kn-filesets
```

The problem here is that `nix-build` by default creates a symlink in the local directory, pointing to the result of the build:
```
$ ls -l result
result -> /nix/store/n9i6gaf80hvbfplsv7zilkbfrz47s4kn-filesets
```

In such a case, we can use the [`difference`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.difference) function.
It allows subtracting a file set from another,
resulting in a new file set that contains all files from the first argument that aren't in the second argument.

Let's use it to filter out `./result` by changing the `sourceFiles` definition:
```nix
  sourceFiles = fs.difference ./. ./result;
```

Building it now we get:
```shell-session
$ nix-build -A package
trace: /home/user/select
trace: - default.nix (regular)
trace: - nix (all files in directory)
trace: - package.nix (regular)
trace: - string.txt (regular)
this derivation will be built:
  /nix/store/7960rh64d4zlkspmf4h51g4zys3lcjyj-filesets.drv
[...]
/nix/store/aicvbzjvqzn06nbgpbrwqi47rxqdiqv9-filesets

$ nix-build
[...]
/nix/store/aicvbzjvqzn06nbgpbrwqi47rxqdiqv9-filesets
```

You can see that the trace now doesn't print "all files in directory" anymore,
because we don't include `./result` anymore.
Also, running the build always gives the same result, no more rebuilding necessary!

If we try to remove the `./result` symlink however, we run into a problem:
```shell-session
$ rm result
$ nix-build -A package
error: lib.fileset.difference: Second argument (negative set)
  (/home/user/select/result) is a path that does not exist.
  To create a file set from a path that may not exist, use `lib.fileset.maybeMissing`.
```

It helpfully explains to us that for files that may not exist,
we should use `maybeMissing` <!-- https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.maybeMissing -->,
so let's try it:

```nix
  sourceFiles = fs.difference ./. (fs.maybeMissing ./result);
```

This now works, reliably filtering out `./result` if it exists:

```
$ nix-build -A package
trace: /home/user/select (all files in directory)
this derivation will be built:
  /nix/store/ygpx17kshzc6bj3c71xlda8szw6qi1sr-filesets.drv
[...]
/nix/store/bzvhlr9h2zwqi7rr9i1j193z9hkskhmk-filesets

$ nix-build -A package
trace: /home/user/select
trace: - default.nix (regular)
trace: - nix (all files in directory)
trace: - package.nix (regular)
trace: - string.txt (regular)
/nix/store/bzvhlr9h2zwqi7rr9i1j193z9hkskhmk-filesets
```

## Adding file sets together

We still have a problem however:
Changing _any_ of the included files causes the derivation to be rebuilt,
even though it doesn't depend on those files.

```shell-session
$ echo "# Just a comment" >> package.nix

$ nix-build -A package
trace: /home/tweagysil/select
trace: - default.nix (regular)
trace: - nix (all files in directory)
trace: - package.nix (regular)
trace: - string.txt (regular)
this derivation will be built:
  /nix/store/zmgpqlpfz2jq0w9rdacsnpx8ni4n77cn-filesets.drv
[...]
/nix/store/6pffjljjy3c7kla60nljk3fad4q4kkzn-filesets
```

One way to fix this is to use [`unions`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.unions)
to create a file set containing all of the files we don't want:

```nix
  sourceFiles =
    fs.difference
      ./.
      (fs.unions [
        (fs.maybeMissing ./result)
        ./default.nix
        ./package.nix
        ./nix
      ]);
```

This also gives us the opportunity to show the [`fileFilter`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.fileFilter) function,
which as the name implies, allows filtering the files in a local path.
We use it to select all files whose name ends with `.nix`:

```nix
  sourceFiles =
    fs.difference
      ./.
      (fs.unions [
        (fs.maybeMissing ./result)
        (fs.fileFilter (file: lib.hasSuffix ".nix" file.name) ./.)
        ./nix
      ]);
```

Changing any of the removed files now doesn't necessarily require a rebuild anymore:

```shell-session
$ nix-build -A package
trace: /home/user/select
trace: - string.txt (regular)
/nix/store/clrd19vn5cv6n7x7hzajq1fv43qig7cp-filesets

$ echo "# Just a comment" >> package.nix

$ nix-build -A package
trace: /home/user/select
trace: - string.txt (regular)
/nix/store/clrd19vn5cv6n7x7hzajq1fv43qig7cp-filesets
```

Notable with this approach is that new files added to the current directory are **included by default**.
Depending on your project, this might be a better fit than the alternative in the next section.

## Git

## Only including necessary files

<!--

- git init
- Non-flakes only: gitTracked
- union to select some files

Section on file sets:
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
