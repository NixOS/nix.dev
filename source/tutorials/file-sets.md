(file-sets)=
# Working with local files
<!-- TODO: Switch all mentions of unstable to stable once 23.11 is out -->

To build a local project in a Nix derivation, its source files must be accessible to the [`builder` executable](https://nixos.org/manual/nix/stable/language/derivations#attr-builder).
Since by default the `builder` runs in an isolated environment that only allows reading from the Nix store,
the Nix language has built-in features to copy local files to the store and expose the resulting store paths.

Using these features directly can be tricky however:

- Coercion of paths to strings, such as the wide-spread pattern of `src = ./.`,
  makes the derivation dependent on the name of the current directory.
  It also doesn't allow being more precise about which files to use.

- The [`builtins.path`](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-path) function
  (and equivalently [`lib.sources.cleanSourceWith`](https://nixos.org/manual/nixpkgs/stable/#function-library-lib.sources.cleanSourceWith))
  can address these problems.
  However, it's often hard to express the desired path selection using the `filter` function interface.

In this tutorial you'll learn how to use the [file set library](https://nixos.org/manual/nixpkgs/unstable/#sec-fileset) to work with local files in derivations.
It abstracts over built-in functionality and offers a safer and more convenient interface.

## File sets

The file set library is based on the concept of _file sets_,
a data type representing a collection of local files.
File sets can be created, composed, and manipulated with the various functions of the library.

The easiest way to experiment with the library is to use it through [`nix repl`](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-repl):

```shell-session
$ nix repl -f channel:nixos-unstable
...
nix-repl> fs = lib.fileset
```

The [`trace`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.trace) function pretty-prints the files included in a given file set:

```shell-session
nix-repl> fs.trace ./. null
trace: /home/user (all files in directory)
null
```

All functions that expect a file set for an argument also accept a [path](https://nixos.org/manual/nix/stable/language/values#type-path).
Such path arguments are then [implicitly coerced](https://nixos.org/manual/nixpkgs/unstable/#sec-fileset-path-coercion), and the resulting file sets contain _all_ files under the given path.
In the previous trace this is indicated by `(all files in directory)`.

:::{tip}
The `trace` function pretty-prints its first agument and returns its second argument.
But since you often just need the pretty-printing in `nix repl`, you can omit the second argument:

```shell-session
nix-repl> fs.trace ./.
trace: /home/user (all files in directory)
«lambda @ /nix/store/1czr278x24s3bl6qdnifpvm5z03wfi2p-nixpkgs-src/lib/fileset/default.nix:555:8»
```
:::

Even though file sets conceptually contain local files, these files are *never* added to the Nix store unless explicitly requested.
You don't have to worry about accidentally copying secrets into the world-readable store.

In this example, although we pretty-printed the home directory, no files were copied.
This is also evident from the expression evaluating instantly.

:::{note}
This is in contrast to coercion of paths to strings such as in `"${./.}"`,
which copies the whole directory to the Nix store on evaluation!
:::

:::{warning}
With current experimental Flakes,
the local files always get copied into the Nix store
unless you use it within a Git repository!
:::

This implicit coercion also works for files:

```shell-session
nix-repl> fs.trace /etc/nix/nix.conf
trace: /etc/nix
trace: - nix.conf (symlink)
```

We can see that in addition to the included file,
it also prints its [file type](https://nixos.org/manual/nix/stable/language/builtins.html#builtins-readFileType).

But if we make a typo for a path that doesn't exist,
the library adequately complains about it:

```shell-session
nix-repl> fs.trace /etc/nix/nix.nix
error: lib.fileset.trace: Argument (/etc/nix/nix.nix)
  is a path that does not exist.
```

## A local directory

To further experiment with the library, let's set up a local directory.
To start out, create a new directory, enter it,
and set up `niv` to pin the Nixpkgs dependency:

```shell-session
$ mkdir select
$ cd select
$ nix-shell -p niv --run "niv init --nixpkgs nixos/nixpkgs --nixpkgs-branch nixos-unstable"
```

:::{note}
For now we're using the nixos-unstable channel, since no stable channel has all the features we need yet.
:::

Then create a `default.nix` file:

```{code-block} nix
:caption: default.nix
{
  system ? builtins.currentSystem,
  sources ? import ./nix/sources.nix,
}:
let
  pkgs = import sources.nixpkgs {
    config = { };
    overlays = [ ];
    inherit system;
  };
in
pkgs.callPackage ./package.nix { }
```

From now on we'll just change the contents of `package.nix` while keeping `default.nix` the same.

For now, let's have a simple `package.nix` to verify everything works so far:

```{code-block} nix
:caption: package.nix
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

```{code-block} nix
:caption: package.nix
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
let's first use the file set library to include all files from the local directory in the build,
and have it succeed by coping the `string.txt` file to the output:

```{code-block} nix
:caption: package.nix
:emphasize-lines: 4, 13-15
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
$ nix-build
trace: /home/user/select (all files in directory)
this derivation will be built:
  /nix/store/d8mj3z49s24q46rncma6v9kvi6xbx4vq-filesets.drv
...
/nix/store/v5sx60xd9lvylgqcyqpchac1a2k8300c-filesets
```

But if you rebuild again, you get something different!

```shell-session
$ nix-build
trace: /home/user/select (all files in directory)
this derivation will be built:
  /nix/store/1xb412x3fzavr8d8c3hbl3fv9kyvj77c-filesets.drv
...
/nix/store/n9i6gaf80hvbfplsv7zilkbfrz47s4kn-filesets
```

The problem here is that `nix-build` by default creates a symlink in the local directory, pointing to the result of the build:

```
$ ls -l result
result -> /nix/store/n9i6gaf80hvbfplsv7zilkbfrz47s4kn-filesets
```

In such a case, we can use the [`difference`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.difference) function.
It allows "subtracting" one file set from another,
resulting in a new file set that contains all files from the first argument
that aren't in the second argument.

Let's use it to filter out `./result` by changing the `sourceFiles` definition:

```{code-block} nix
:caption: package.nix
  sourceFiles = fs.difference ./. ./result;
```

Building it now we get:

```shell-session
$ nix-build
trace: /home/user/select
trace: - default.nix (regular)
trace: - nix (all files in directory)
trace: - package.nix (regular)
trace: - string.txt (regular)
this derivation will be built:
  /nix/store/7960rh64d4zlkspmf4h51g4zys3lcjyj-filesets.drv
...
/nix/store/aicvbzjvqzn06nbgpbrwqi47rxqdiqv9-filesets

$ nix-build
...
/nix/store/aicvbzjvqzn06nbgpbrwqi47rxqdiqv9-filesets
```

You can see that the trace now doesn't print "all files in directory" anymore,
because we don't include `./result` anymore.
Also, running the build always gives the same result, no more rebuilding necessary!

If we try to remove the `./result` symlink however, we run into a problem:

```shell-session
$ rm result
$ nix-build
error: lib.fileset.difference: Second argument (negative set)
  (/home/user/select/result) is a path that does not exist.
  To create a file set from a path that may not exist, use `lib.fileset.maybeMissing`.
```

It helpfully explains to us that for files that may not exist,
we should use `maybeMissing` <!-- https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.maybeMissing -->,
so let's try it:

```{code-block} nix
:caption: package.nix
  sourceFiles = fs.difference ./. (fs.maybeMissing ./result);
```

This now works, reliably filtering out `./result` if it exists:

```
$ nix-build
trace: /home/user/select (all files in directory)
this derivation will be built:
  /nix/store/ygpx17kshzc6bj3c71xlda8szw6qi1sr-filesets.drv
...
/nix/store/bzvhlr9h2zwqi7rr9i1j193z9hkskhmk-filesets

$ nix-build
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

$ nix-build
trace: /home/user/select
trace: - default.nix (regular)
trace: - nix (all files in directory)
trace: - package.nix (regular)
trace: - string.txt (regular)
this derivation will be built:
  /nix/store/zmgpqlpfz2jq0w9rdacsnpx8ni4n77cn-filesets.drv
...
/nix/store/6pffjljjy3c7kla60nljk3fad4q4kkzn-filesets
```

One way to fix this is to use [`unions`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.unions)
to create a file set containing all of the files we don't want,
and removing that instead:

```{code-block} nix
:caption: package.nix
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

```{code-block} nix
:caption: package.nix
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
$ nix-build
trace: /home/user/select
trace: - string.txt (regular)
/nix/store/clrd19vn5cv6n7x7hzajq1fv43qig7cp-filesets

$ echo "# Just a comment" >> package.nix

$ nix-build
trace: /home/user/select
trace: - string.txt (regular)
/nix/store/clrd19vn5cv6n7x7hzajq1fv43qig7cp-filesets
```

Notable with this approach is that new files added to the current directory are _included_ by default.
Depending on your project, this might be a better fit than the alternative in the next section.

## Only including necessary files

To contrast the above approach, we can also directly use `unions` to select only the files we want to _include_.
This means that new files added to the current directory would be _excluded_ by default.

To demonstrate, let's create some extra files to select:

```shell-session
$ mkdir src
$ touch build.sh src/select.{c,h}
```

And then create a file set from just the ones we're interested in:

```{code-block} nix
:caption: package.nix
  sourceFiles = fs.unions [
    ./build.sh
    ./string.txt
    (fs.fileFilter
      (file:
        lib.hasSuffix ".c" file.name
        || lib.hasSuffix ".h" file.name
      )
      ./src
    )
  ];
```

When building this you'll see that only the specified files are used, even when a new one is added:

```shell-session
$ nix-build
trace: /home/user/select
trace: - build.sh (regular)
trace: - src
trace:   - select.c (regular)
trace:   - select.h (regular)
trace: - string.txt (regular)
this derivation will be built:
  /nix/store/gzj9j9dk2qyd46y1g2wkpkrbc3f2nm5g-filesets.drv
building '/nix/store/gzj9j9dk2qyd46y1g2wkpkrbc3f2nm5g-filesets.drv'...
...
/nix/store/sb4g8skwvpwbay5kdpnyhwjglxqzim28-filesets

$ touch src/select.o

$ nix-build
trace: /home/user/select
trace: - build.sh (regular)
trace: - src
trace:   - select.c (regular)
trace:   - select.h (regular)
trace: - string.txt (regular)
/nix/store/sb4g8skwvpwbay5kdpnyhwjglxqzim28-filesets
```

## Git

In case we track files with Git, we can use [`gitTracked`](https://nixos.org/manual/nixpkgs/unstable/#function-library-lib.fileset.toSource) to re-use the same set of files by Git.

:::{note}
With current experimental Flakes,
it's [not really possible](https://github.com/NixOS/nix/issues/9292) to use this function,
even with `nix build path:.`.
However it's also not needed, because by default,
`nix build` only allows access to Git-tracked files.
:::

Let's create a local Git repository and add track all files except `src/select.o` and `./result` to it:

```shell-session
$ git init
Initialized empty Git repository in /home/user/select/.git/
$ git add -A
$ git reset src/select.o result
```

Now we can re-use this selection of files using `gitTracked`:

```{code-block} nix
:caption: package.nix
  sourceFiles = fs.gitTracked ./.;
```

Building we get

```shell-session
$ nix-build
warning: Git tree '/home/user/select' is dirty
trace: /home/user/select
trace: - build.sh (regular)
trace: - default.nix (regular)
trace: - nix (all files in directory)
trace: - package.nix (regular)
trace: - src
trace:   - select.c (regular)
trace:   - select.h (regular)
trace: - string.txt (regular)
this derivation will be built:
  /nix/store/vn21azx8y06cjq80lrvib8ia4xxpwn3d-filesets.drv
...
/nix/store/4xdfxm910x1i2qapv49caiibymfjhvla-filesets
```

This includes too much though, we don't need all of these files to build the derivation.

## Intersection

This is where `intersection` comes in.
It allows us to create a file set consisting only of files that are in _both_ of two file sets.
In this case we only want files that are both tracked by git, and included in our exclusive selection:

```{code-block} nix
:caption: package.nix
  sourceFiles =
    fs.intersection
      (fs.gitTracked ./.)
      (fs.unions [
        ./build.sh
        ./string.txt
        ./src
      ]);
```

At last we get what we expect:

```shell-session
$ nix-build
warning: Git tree '/home/user/select' is dirty
trace: /home/user/select
trace: - build.sh (regular)
trace: - src
trace:   - select.c (regular)
trace:   - select.h (regular)
trace: - string.txt (regular)
/nix/store/sb4g8skwvpwbay5kdpnyhwjglxqzim28-filesets
```

## Conclusion

You've now seen some examples on how to use all of the fundamental file set combinator functions.
But if you need more complex behavior, you can compose them however necessary.

For the complete list and more details, see the [reference documentation](https://nixos.org/manual/nixpkgs/unstable/#sec-functions-library-fileset).
