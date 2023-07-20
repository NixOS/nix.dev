---
myst:
  html_meta:
    "description lang=en": "Packaging Existing Software With Nix"
    "keywords": "Nix, packaging"
---


(packaging-existing-software)=


# Packaging Existing Software With Nix

One of Nix's primary use-cases is in addressing common difficulties encountered while packaging software, like *managing dependencies*.

In the long term, Nix helps tremendously in alleviating that stress, but when *first* (re)packaging existing software with Nix, it's common to encounter missing dependencies preventing builds from succeeding.

If you haven't already read the tutorial on making a derivation, please go do so before reading this!

In this tutorial, we'll see how to create Nix derivations to package C/C++ software, taking advantage of the [`nixpkgs` `stdenv`](https://nixos.org/manual/nixpkgs/stable/#chap-stdenv) which automates much of the work of building self-contained C/C++ packages.

We'll begin by considering `hello`, a feature-complete implementation of the famous "hello world", which requires no external dependencies.

Then we'll move to progressively more complex packages with their own separate dependencies, leading us to use additional derivation features.

Along the way, we'll encounter and address Nix error messages, build failures, and a host of other issues, developing our iterative debugging techniques as we go.

## Packages in Nix
Before we proceed, an important point of clarification: we conventionally use the term "package" by analogy to other systems, although this term is not a proper concept in Nix.

For the purposes of this tutorial, by "package" we mean "a Nix function which takes an attribute set of 'dependencies' and produces a derivation", where "dependencies" could be other packages or configuration parameters.

## A Simple Project
To start, we'll write a skeleton derivation, updating this as we go:

```nix
{ pkgs, stdenv }:
stdenv.mkDerivation {	};
```

### Hello, World!
Since GNU Hello is a popular (in a certain sense) package from the GNU Project, we can easily access its source code [from GNU's FTP](https://ftp.gnu.org/gnu/hello/).

In this case, we'll download the [latest version](https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz) of `hello`, currently `2.12.1`.

Downloading that into our build context is a good first step; we can do this in several ways, but it's best to use one of the nixpkgs builtin fetcher functions.

In this case, we'll use `fetchTarball`, which takes the URI path to the download file and a SHA256 hash of its contents.

Here is our first iterative debugging technique: we can't actually know the hash until after we've downloaded and unpacked the tarball, but Nix will complain at us if the hash we supplied was incorrect, so we can just supply a fake one with `lib.fakeSha256` and change our derivation after Nix informs us of the correct hash:

```nix
# hello.nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = lib.fakeSha256;
  };
}
```

Let's save this file to `hello.nix` and try to build it. To do so, we'll use `nix-build`...

```console
$ nix-build hello.nix
error: cannot evaluate a function that has an argument without a value ('pkgs')
       Nix attempted to evaluate a function as a top level expression; in
       this case it must have its arguments supplied either by default
       values, or passed explicitly with '--arg' or '--argstr'. See
       https://nixos.org/manual/nix/stable/language/constructs.html#functions.

       at /home/nix-user/hello.nix:2:3:

            1| # hello.nix
            2| { pkgs, stdenv }:
             |   ^
            3| stdenv.mkDerivation {
```

... and immediately run into a problem: every derivation is a *function*, and functions need *arguments*!

### Your New Favorite Command
In order to pass the `pkgs` argument to our derivation, we'll need to import `nixpkgs` in another Nix expression. The `nix-build` command lets us pass whole expressions as an argument following the `-E/--expr` flag.

We'll use the following expression:

```console
with import <nixpkgs> {}; callPackage ./hello.nix {}
^    ^      ^         ^   ^           ^           ^
1    2      3         4   5           6           7
```

`callPackage` automatically passes attributes from `pkgs` to the given function, if they match attributes required by that function's argument attrset. Here, `callPackage` will supply `pkgs`, `lib`, and `stdenv`.

From `nixpkgs`, we use the `callPackage` function (5) to import our `hello.nix` (6). Since the `hello.nix` derivation [is a function](https://nixos.org/manual/nix/stable/language/derivations.html) which takes two arguments [it will already be passed](), we also apply it to an empty attribute set (7). Although `hello.nix` takes a `pkgs` argument, we don't need to apply the function to `nixpkgs`, because the `with` statement has already included the `nixpkgs` we just imported into the local context.

Let's run this now:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./hello.nix {}'
error: derivation name missing
```
Progress! The new failure occurs with the *derivation*, further down in the file than the initial error on line 2 about the `pkgs` argument not having a value; we successfully resolved the previous error by importing `nixpkgs` in the expression we passed to `nix-build`.

### Naming a Derivation
Every derivation needs a `name` attribute, which must either be set directly or constructed by `mkDerivation` from `pname` and `version` attributes, if they exist.

Let's update the file again to add a `name`:

```nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  name = "hello";
  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = lib.fakeSha256;
  };
}
```
and then re-run the command:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./hello.nix {}'
error:
       … while calling the 'derivationStrict' builtin

         at /builtin/derivation.nix:9:12: (source not available)

       … while evaluating derivation 'hello'
         whose name attribute is located at /nix/store/i6w7hmdjp1jg71g7xbjgz5rn96q443c6-nixos-23.05.1471.b72aa95f7f0/nixos/pkgs/stdenv/generic/make-derivation.nix:303:7

       … while evaluating attribute 'src' of derivation 'hello'

         at /home/nix-user/hello.nix:5:3:

            4|   name = "hello";
            5|   src = builtins.fetchTarball {
             |   ^
            6|     url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";

       error: hash mismatch in file downloaded from 'https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz':
         specified: sha256:0000000000000000000000000000000000000000000000000000
         got:       sha256:0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn
```

### Finding The File Hash
As expected, Nix complained at us for lying about the file hash, and helpfully provided the correct one. We can substitute this into our `hello.nix` file, replacing `lib.fakeSha256`:

```nix
# hello.nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  name = "hello";
  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = "0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn";
  };
}
```

Now let's run that command again:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./hello.nix {}'
this derivation will be built:
  /nix/store/rbq37s3r76rr77c7d8x8px7z04kw2mk7-hello.drv
building '/nix/store/rbq37s3r76rr77c7d8x8px7z04kw2mk7-hello.drv'...
unpacking sources
unpacking source archive /nix/store/xdbysilxxgbs55rrdxniglqg9m1v61h4-source
source root is source
patching sources
configuring
configure flags: --disable-dependency-tracking --prefix=/nix/store/y55w1djfnxkl2jk9w0liancp83zqb7ki-hello
...
configure: creating ./config.status
config.status: creating Makefile
...
building
build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
... <many more lines omitted>
```
Great news: our derivation built successfully!

:::{important}
But how? This looks magical!
:::

We can see from the console output that `configure` was called, which produced a `Makefile` that was then used to build the project; we didn't actually write any build instructions, so we can surmise that Nix automatically detected the structure of the project directory. Indeed, the build system in Nix is based on `autoconf`.

### Build Result
We can check our working directory for the result:

```console
$ ls
hello.nix  result
```

This result is a symbolic link to a Nix store location containing the built binary; we can call `./result/bin/hello` to execute this program:

```console
$ ./result/bin/hello
Hello, world!
```

We've successfully packaged our first program with Nix! The experience was a little bit *too* magical though, so up next we'll package another piece of software which has external dependencies and a different means of building, which will require us to lean more on `mkDerivation`.

## Something Bigger
The `hello` program is a simple and common place to start packaging, but it's not very useful or interesting, so we can't stop there.

Now, we'll look at packaging a somewhat more complicated program, `icat`, which allows us to render images in our terminal.

Though there are at least two alternative similar tools already in `nixpkgs`, at the time of writing, this particular tool hasn't been packaged, and it is used in  {ref}`another tutorial <ref-module-system-introduction>`.) *fixme: complete and merge https://github.com/NixOS/nix.dev/pull/645, then link it here*, so this is a good opportunity to do something both informative and useful.

We'll start by copying the `hello.nix` from the previous section to a new file, `icat.nix`:

```nix
# icat.nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  name = "hello";
  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = "0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn";
  };
}
```

While Nix can sometimes feel magic, it's not *actually* magic, so unfortunately this won't magically produce `icat` for us, and we'll need to make several changes.

To start, we'll need to change the `name` attribute:

```nix
# icat.nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  name = "icat";
  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = "0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn";
  };
}
```

Now we'll download the source code. `icat`'s upstream repository is hosted on [GitHub](https://github.com/atextor/icat), so we should slightly modify our previous [source fetcher](https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers): instead of `fetchTarball`, we'll use [`fetchFromGitHub`](https://nixos.org/manual/nixpkgs/stable/#fetchfromgithub):

```nix
# icat.nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  name = "icat";
  src = builtins.fetchFromGitHub {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = "0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn";
  };
}
```


Updating our file accordingly:

```nix
# icat.nix
{ pkgs, stdenv }:
stdenv.mkDerivation {
  name = "icat";
  src = builtins.fetchFromGitHub {
    owner = "atextor";
	repo = "icat";
	rev = "master";
	sha256 = lib.fakeSha256;
  };
}
```

Running our previous `nix-build` invocation:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
error:
       … while evaluating a branch condition

         at /nix/store/i6w7hmdjp1jg71g7xbjgz5rn96q443c6-nixos-23.05.1471.b72aa95f7f0/nixos/lib/customisation.nix:179:8:

          178|
          179|     in if missingArgs == [] then makeOverridable f allArgs else abort error;
             |        ^
          180|

       … while calling the 'attrNames' builtin

         at /nix/store/i6w7hmdjp1jg71g7xbjgz5rn96q443c6-nixos-23.05.1471.b72aa95f7f0/nixos/lib/customisation.nix:139:21:

          138|       # wouldn't be passed to it
          139|       missingArgs = lib.attrNames
             |                     ^
          140|         # Filter out arguments that have a default value

       (stack trace truncated; use '--show-trace' to show the full trace)

       error: undefined variable 'lib'

       at /home/nix-user/icat.nix:9:12:

            8|     rev = "master";
            9|     hash = lib.fakeSha256;
             |            ^
           10|   };
```

### Namespacing
This one is easy: `lib` lives in the `pkgs` namespace, so we can either fix this by invoking `pkgs.lib.fakeSha256` instead, or by taking `lib` as an argument to the whole expression. The latter option is more common, so we'll do that. This is also a good time to rearrange our set of arguments to better conform to the [Nixpkgs syntactic conventions](https://nixos.org/manual/nixpkgs/stable/#chap-conventions):

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = builtins.fetchFromGitHub {
    owner = "atextor";
	repo = "icat";
	rev = "master";
	sha256 = lib.fakeSha256;
  };
}
```

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
error:
       … while calling the 'derivationStrict' builtin

         at /builtin/derivation.nix:9:12: (source not available)

       … while evaluating derivation 'icat'
         whose name attribute is located at /nix/store/i6w7hmdjp1jg71g7xbjgz5rn96q443c6-nixos-23.05.1471.b72aa95f7f0/nixos/pkgs/stdenv/generic/make-derivation.nix:303:7

       … while evaluating attribute 'src' of derivation 'icat'

         at /home/nix-user/icat.nix:9:3:

            8|   name = "icat";
            9|   src = builtins.fetchFromGitHub {
             |   ^
           10|     owner = "atextor";

       error: attribute 'fetchFromGitHub' missing

       at /home/nix-user/icat.nix:9:9:

            8|   name = "icat";
            9|   src = builtins.fetchFromGitHub {
             |         ^
           10|     owner = "atextor";
```

Another issue, and the converse of the previous one: `fetchFromGitHub` doesn't live in `builtins`, it lives in `pkgs`:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
	repo = "icat";
	rev = "master";
	sha256 = lib.fakeSha256;
  };
}
```

### Fetching Source from GitHub
While `fetchTarball` required `url` and `sha256` arguments, we'll need more than that for [`fetchFromGitHub`](https://nixos.org/manual/nixpkgs/stable/#fetchfromgithub).

The source we want is hosted on GitHub at `https://github.com/atextor/icat`, which already gives us the first two arguments:
- `owner`: the name of the account controlling the repository; `owner = "atextor"`
- `repo`: the name of the repository we want to fetch; `repo = "icat"`

We can navigate to the project's [Releases page](https://github.com/atextor/icat/releases) to find a suitable `rev`, such as the git commit hash or tag (e.g. `v1.0`) corresponding to the release we want to fetch. In this case, the latest release tag is `v0.5`.


```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
...
unpacking source archive /build/master.tar.gz
error: hash mismatch in fixed-output derivation '/nix/store/lgjf8cq63ahqnd3b117g1q58g4nkprmj-source.drv':
         specified: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
            got:    sha256-b/2mRzCTyGkz2I1U+leUhspvW77VcHN7Awp+BVdVNRM=
error: 1 dependencies of derivation '/nix/store/afiw4a1l04pi82k6w630d42iflgfxbl6-icat.drv' failed to build
```

:::{note}
We've been faking the hash and letting `nix-build` report the correct one in an error, but we could also fetch the correct hash in the first place with one of the `nix-prefetch` commands, or by downloading the tarball and passing it to the appropriate `nix-hash` invocation. We'll use the `nix-prefetch` trick in the next section.
:::

Now that we have the correct hash, we'll replace `lib.fakeSha256` in the file and re-run the command:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "master";
    sha256 = "sha256-b/2mRzCTyGkz2I1U+leUhspvW77VcHN7Awp+BVdVNRM=";
  };
}
```

### Missing Dependencies
Now we run into an entirely new issue:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
this derivation will be built:
  /nix/store/dvqbkap31salw9mbr2xhxnnnb0089x3v-icat.drv
building '/nix/store/dvqbkap31salw9mbr2xhxnnnb0089x3v-icat.drv'...
unpacking sources
unpacking source archive /nix/store/y4750c9xljqy21b62a03z5xqvl3sd92q-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_DEFAULT_SOURCE `pkg-config --cflags imlib2` -o icat.o icat.c
/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found
icat.c:39:10: fatal error: Imlib2.h: No such file or directory
   39 | #include <Imlib2.h>
      |          ^~~~~~~~~~
compilation terminated.
make: *** [Makefile:20: icat.o] Error 1
error: builder for '/nix/store/dvqbkap31salw9mbr2xhxnnnb0089x3v-icat.drv' failed with exit code 2;
       last 10 log lines:
       > no configure script, doing nothing
       > building
       > build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
       > gcc -c -Wall -pedantic -std=c99 -D_DEFAULT_SOURCE `pkg-config --cflags imlib2` -o icat.o icat.c
       > /nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found
       > icat.c:39:10: fatal error: Imlib2.h: No such file or directory
       >    39 | #include <Imlib2.h>
       >       |          ^~~~~~~~~~
       > compilation terminated.
       > make: *** [Makefile:20: icat.o] Error 1
       For full logs, run 'nix log /nix/store/dvqbkap31salw9mbr2xhxnnnb0089x3v-icat.drv'.
```

Finally, a compiler error! We've successfully pulled the `icat` source from GitHub, and Nix tried to build what it found, but is missing a dependency: the `imlib2` header. If we [search for `imlib2` on search.nixos.org](https://search.nixos.org/packages?channel=23.05&from=0&size=50&sort=relevance&type=packages&query=imlib2), we'll find that `imlib2` is already in `nixpkgs`.

We can add this package to our build environment by either
- adding `imlib2` to the set of inputs to the expression in `icat.nix`, and then adding `imlib2` to the list of `buildInputs` in `stdenv.mkDerivation`, or
- adding `pkgs.imlib2` to the `buildInputs` directly, since `pkgs` is already in-scope.

We'll do the latter of these here:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "master";
    sha256 = "sha256-b/2mRzCTyGkz2I1U+leUhspvW77VcHN7Awp+BVdVNRM=";
  };

  buildInputs = [ pkgs.imlib2 ];
}

```

Another error, but we get further this time:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
this derivation will be built:
  /nix/store/0csqp747mfw0v9n103abxgx611s6dkxm-icat.drv
building '/nix/store/0csqp747mfw0v9n103abxgx611s6dkxm-icat.drv'...
unpacking sources
unpacking source archive /nix/store/y4750c9xljqy21b62a03z5xqvl3sd92q-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_DEFAULT_SOURCE `pkg-config --cflags imlib2` -o icat.o icat.c
/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found
In file included from icat.c:39:
/nix/store/hkgbjcr182m3q9xs0j1qmp3dh08mbg31-imlib2-1.11.1-dev/include/Imlib2.h:45:10: fatal error: X11/Xlib.h: No such file or directory
   45 | #include <X11/Xlib.h>
      |          ^~~~~~~~~~~~
compilation terminated.
make: *** [Makefile:20: icat.o] Error 1
error: builder for '/nix/store/0csqp747mfw0v9n103abxgx611s6dkxm-icat.drv' failed with exit code 2;
       last 10 log lines:
       > building
       > build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
       > gcc -c -Wall -pedantic -std=c99 -D_DEFAULT_SOURCE `pkg-config --cflags imlib2` -o icat.o icat.c
       > /nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found
       > In file included from icat.c:39:
       > /nix/store/hkgbjcr182m3q9xs0j1qmp3dh08mbg31-imlib2-1.11.1-dev/include/Imlib2.h:45:10: fatal error: X11/Xlib.h: No such file or directory
       >    45 | #include <X11/Xlib.h>
       >       |          ^~~~~~~~~~~~
       > compilation terminated.
       > make: *** [Makefile:20: icat.o] Error 1
       For full logs, run 'nix log /nix/store/0csqp747mfw0v9n103abxgx611s6dkxm-icat.drv'.
```

In Nixpkgs, `Xlib` lives in the `dev` output of `xorg.libX11`, which we can add to `buildInputs` again with `pkgs.xorg.libX11.dev`. To avoid repeating ourselves, we can add `pkgs` to the local scope in `buildInputs` by using the [`with` statement](https://nixos.org/guides/nix-pills/basics-of-language.html#idm140737320521984):

```nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "master";
    sha256 = "sha256-b/2mRzCTyGkz2I1U+leUhspvW77VcHN7Awp+BVdVNRM=";
  };

  buildInputs = with pkgs; [ imlib2 xorg.libX11.dev ];
}
```

### `buildInputs` and `nativeBuildInputs`
Running our favorite command again, yet more errors arise:

```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
this derivation will be built:
  /nix/store/0q6x7g7sz4pds3pgs8yb197fnf4r7rl2-icat.drv
building '/nix/store/0q6x7g7sz4pds3pgs8yb197fnf4r7rl2-icat.drv'...
unpacking sources
unpacking source archive /nix/store/y4750c9xljqy21b62a03z5xqvl3sd92q-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_DEFAULT_SOURCE `pkg-config --cflags imlib2` -o icat.o icat.c
/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found
icat.c: In function 'main':
icat.c:319:33: warning: ignoring return value of 'write' declared with attribute 'warn_unused_result' [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wunused-result-Wunused-result8;;]
  319 |                                 write(tempfile, &buf, 1);
      |                                 ^~~~~~~~~~~~~~~~~~~~~~~~
gcc -o icat icat.o  `pkg-config --libs imlib2`
/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.o: in function `resize_image_if_necessary':
icat.c:(.text+0x12a): undefined reference to `imlib_create_cropped_scaled_image'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text+0x132): undefined reference to `imlib_free_image_and_decache'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text+0x13a): undefined reference to `imlib_context_set_image'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.o: in function `main':
icat.c:(.text.startup+0x25b): undefined reference to `imlib_load_image_immediately'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x26c): undefined reference to `imlib_context_set_image'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x271): undefined reference to `imlib_image_get_width'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x27a): undefined reference to `imlib_image_get_height'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x2ea): undefined reference to `imlib_image_query_pixel'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x2f8): undefined reference to `imlib_image_query_pixel'
/nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x33c): undefined reference to `imlib_free_image_and_decache'
collect2: error: ld returned 1 exit status
make: *** [Makefile:23: icat] Error 1
error: builder for '/nix/store/0q6x7g7sz4pds3pgs8yb197fnf4r7rl2-icat.drv' failed with exit code 2;
       last 10 log lines:
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.o: in function `main':
       > icat.c:(.text.startup+0x25b): undefined reference to `imlib_load_image_immediately'
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x26c): undefined reference to `imlib_context_set_image'
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x271): undefined reference to `imlib_image_get_width'
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x27a): undefined reference to `imlib_image_get_height'
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x2ea): undefined reference to `imlib_image_query_pixel'
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x2f8): undefined reference to `imlib_image_query_pixel'
       > /nix/store/dx8hynidprz3kf4ngcjipnwaxp6h229f-binutils-2.40/bin/ld: icat.c:(.text.startup+0x33c): undefined reference to `imlib_free_image_and_decache'
       > collect2: error: ld returned 1 exit status
       > make: *** [Makefile:23: icat] Error 1
       For full logs, run 'nix log /nix/store/0q6x7g7sz4pds3pgs8yb197fnf4r7rl2-icat.drv'.
```

There are several issues here, but the first one we can solve is `/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash: line 1: pkg-config: command not found`. According to the [Nixpkgs Manual](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-dependencies), we should add dependencies to `buildInputs` if they're going to be copied or linked into the final output, or otherwise used somehow at runtime, but we should add dependencies to the `nativeBuildInputs` list if those dependencies are used at *build* time. `pkg-config` isn't needed after we build `icat`, so we'll add it to `nativeBuildInputs`:

```nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "master";
    sha256 = "sha256-b/2mRzCTyGkz2I1U+leUhspvW77VcHN7Awp+BVdVNRM=";
  };

  nativeBuildInputs = with pkgs; [ pkg-config ];
  buildInputs = with pkgs; [ imlib2 xorg.libX11.dev ];
}
```

### Debugging with a Development Shell
This solves some of the errors we just saw, but not all; the `ld` error produced by all the undefined references is gone, but we still see a non-zero `make` return value: `make: *** No rule to make target 'install'`.

Nix is automatically working with the `Makefile` that comes with `icat`, which indeed lacks an `install` target. The `README` in the `icat` repository only mentions using `make` to build the tool, presumably leaving installation up to us. We've now discovered one limit to what Nix can do for us automatically: it doesn't read minds. Fortunately, it does still make the fix quite straightforward to implement.

If you haven't read the tutorials on creating [ad-hoc](https://nix.dev/tutorials/first-steps/dev-environment) or [declarative](https://nix.dev/tutorials/first-steps/declarative-and-reproducible-developer-environments) development environments, do that now before proceeding through the rest of this tutorial; dropping into a `nix-shell` is a crucial component in the Nix user toolbox, and indispensible for debugging.

To enter a useful development shell, we'll pass the dependencies from `nativeBuildInputs` and `buildInputs` to `nix-shell -p`. We'll also make sure to include `git`, so we can clone the `icat` GitHub repository:

```console
$ nix-shell -p pkg-config imlib2 xorg.libX11.dev git
```

After many lines of output about Nix copying dependencies, we can use the following commands to retrieve and build the `icat` source code:

```console
$ git clone https://github.com/atextor/icat
$ cd icat
$ make
```

In the current `master` branch of `icat`, a warning is thrown when building:

```console
[nix-shell:~/icat]$ make
gcc -c -Wall -pedantic -std=c99 -D_DEFAULT_SOURCE `pkg-config --cflags imlib2` -o icat.o icat.c
icat.c: In function ‘main’:
icat.c:319:33: warning: ignoring return value of ‘write’ declared with attribute ‘warn_unused_result’ [-Wunused-result]
  319 |                                 write(tempfile, &buf, 1);
      |                                 ^~~~~~~~~~~~~~~~~~~~~~~~
gcc -o icat icat.o  `pkg-config --libs imlib2`
```

However, this does not prevent the binary from being produced; an `icat` executable is now present in the local directory, and it's up to us to decide what to do with it.

### installPhase
In order to make packages available for other packages to depend on, Nix copies everything to the Nix store (at `/nix/store`), and symlinks them from there into build contexts and development environments.

The `Makefile` doesn't provide an installation step, so we must produce one for our derivation, using the [`installPhase` attribute](https://nixos.org/manual/nixpkgs/stable/#ssec-install-phase), which contains a list of command strings to execute to accomplish the installation.

The `icat` executable is only used at runtime, and isn't a compile-time input for anything else at this point, so we only need to concern ourselves with the `bin` output. In Nix, the result of a build is copied to a location stored in the `$out` variable accessible in the derivation's component scripts; we'll create a `bin` directory within that, and then copy our `icat` executable there:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "master";
    sha256 = "sha256-b/2mRzCTyGkz2I1U+leUhspvW77VcHN7Awp+BVdVNRM=";
  };

  nativeBuildInputs = with pkgs; [ pkg-config ];
  buildInputs = with pkgs; [ imlib2 xorg.libX11.dev ];

  installPhase = ''
    mkdir -p $out/bin
    cp icat $out/bin
  '';
}
```

After running our `nix-build` command one last time, we can `ls` in the local directory to find a `result` symlink to the Nix store, with `result/bin/icat` the executable we built. Success!

## Contributing our Work
Now that we've packaged `icat`, it's time to prepare it for submission upstream to Nixpkgs.

### Building a Release Version
Our `icat.nix` definition uses the `master` revision of the upstream repository, which is suitable for individual use but not a great practice for submission to Nixpkgs; it would be better to use a fixed revision, corresponding to a particular release version of the software, at least so maintainers (perhaps you!) could easily check when this package should be updated.

The upstream GitHub repository has [several tags available](https://github.com/atextor/icat/tags), which correspond to released versions. We'll modify our existing `icat.nix` to download and build the latest tag instead of what's available on `master`. This time, instead of using the `lib.fakeSha256` trick, we'll use [`nix-prefetch-url`](https://nixos.org/manual/nix/stable/command-ref/nix-prefetch-url.html) to retrieve the hash we need:

```console
$ nix-prefetch-url --unpack https://github.com/atextor/icat/archive/refs/tags/v0.5.tar.gz
path is '/nix/store/p8jl1jlqxcsc7ryiazbpm7c1mqb6848b-v0.5.tar.gz'
0wyy2ksxp95vnh71ybj1bbmqd5ggp13x3mk37pzr99ljs9awy8ka
```

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";
  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "v0.5";
    sha256 = "0wyy2ksxp95vnh71ybj1bbmqd5ggp13x3mk37pzr99ljs9awy8ka";
  };

  nativeBuildInputs = with pkgs; [ pkg-config ];
  buildInputs = with pkgs; [ imlib2 xorg.libX11.dev ];

  installPhase = ''
    mkdir -p $out/bin
    cp icat $out/bin
  '';
}
```

And it builds!
```console
$ nix-build -E 'with import <nixpkgs> {}; callPackage ./icat.nix {}'
these 2 derivations will be built:
  /nix/store/vvjyrngklzxbcsfiyp4hr1z2qcdqm8j7-source.drv
  /nix/store/x6h1kfd4h16vhj0cxlakrm5igbbbz7v3-icat.drv
building '/nix/store/vvjyrngklzxbcsfiyp4hr1z2qcdqm8j7-source.drv'...

trying https://github.com/atextor/icat/archive/v0.5.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 46232    0 46232    0     0  60947      0 --:--:-- --:--:-- --:--:-- 60947
unpacking source archive /build/v0.5.tar.gz
building '/nix/store/x6h1kfd4h16vhj0cxlakrm5igbbbz7v3-icat.drv'...
unpacking sources
unpacking source archive /nix/store/rx21f6fgnmxgp1sw0wbqll9wds4xc6v0-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/7q1b1bsmxi91zci6g8714rcljl620y7f-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_BSD_SOURCE -o icat.o icat.c
In file included from /nix/store/dpk5m64n0axk01fq8h2m0yl9hhpq2nqk-glibc-2.37-8-dev/include/bits/libc-header-start.h:33,
                 from /nix/store/dpk5m64n0axk01fq8h2m0yl9hhpq2nqk-glibc-2.37-8-dev/include/stdio.h:27,
                 from icat.c:31:
/nix/store/dpk5m64n0axk01fq8h2m0yl9hhpq2nqk-glibc-2.37-8-dev/include/features.h:195:3: warning: #warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE" [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wcpp-Wcpp8;;]
  195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
      |   ^~~~~~~
icat.c: In function 'main':
icat.c:319:33: warning: ignoring return value of 'write' declared with attribute 'warn_unused_result' [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wunused-result-Wunused-result8;;]
  319 |                                 write(tempfile, &buf, 1);
      |                                 ^~~~~~~~~~~~~~~~~~~~~~~~
gcc -o icat icat.o -lImlib2
installing
post-installation fixup
shrinking RPATHs of ELF executables and libraries in /nix/store/g6w508vxwr3df25dnl4k3xvcr4pqxprj-icat
shrinking /nix/store/g6w508vxwr3df25dnl4k3xvcr4pqxprj-icat/bin/icat
checking for references to /build/ in /nix/store/g6w508vxwr3df25dnl4k3xvcr4pqxprj-icat...
patching script interpreter paths in /nix/store/g6w508vxwr3df25dnl4k3xvcr4pqxprj-icat
stripping (with command strip and flags -S -p) in  /nix/store/g6w508vxwr3df25dnl4k3xvcr4pqxprj-icat/bin
/nix/store/g6w508vxwr3df25dnl4k3xvcr4pqxprj-icat
```

We still see the unused-result warning thrown by the compiler, but the package successfully built, and the very last line of output tells us where Nix put the result.

### Phases and Hooks
Nix package derivations are separated into [phases](https://nixos.org/manual/nixpkgs/unstable/#sec-stdenv-phases), each of which is intended to control some aspect of the build process.

During derivation realisation, there are a number of shell functions ("hooks", in `nixpkgs`) which may execute in each derivation phase, which do things like set variables, source files, create directories, and so on. These are run both before and after each phase, controlling the build environment and helping to prevent environment-modifying behavior defined within packages from creating sources of nondeterminism within and between Nix derivations.

It's good practice when packaging for `nixpkgs` to include calls to these hooks in the derivation phases you define, even when you don't make direct use of them; this facilitates easy [overriding](https://nixos.org/manual/nixpkgs/stable/#chap-overrides) of specific parts of the derivation later, in addition to the previously-mentioned reproducibility benefits.

Nix automatically determined the `buildPhase` information for our `icat` package, but we needed to define a custom `installPhase` which we should now adjust to call the appropriate hooks:

```nix
# icat.nix
...
  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin
    cp icat $out/bin
	runHook postInstall
  '';
...
```

### Package Metadata
By convention, all packages in Nixpkgs have a `meta` attribute in their derivation, which contains information like a description of the package, the homepage of the project it belongs to, the software license, the platforms the package can be built for, and a list of Nixpkgs maintainers for the package. In this case, I'm the contributing user, so I'll add myself to the maintainers list for this package.

:::{note}
Before contributing your first package, you must add your information to `nixpkgs/maintainers/maintainers-list.nix`, following the instructions [here](https://nixos.org/manual/nixpkgs/stable/#var-meta-maintainers).
:::

Before we contribute our package, we should add this metadata to the `meta` attribute passed to `mkDerivation`, following the [contribution guidelines](https://nixos.org/manual/nixpkgs/stable/#reviewing-contributions-new-packages):

```nix
# icat.nix
...
  meta = with lib; {
    description = "icat (Image cat) outputs images in 256-color capable terminals.";
    homepage = "https://github.com/atextor/icat";
    license = licenses.bsdOriginal;
    platforms = platforms.unix;
    maintainers = [ maintainers.proofconstruction ];
  };
...
```


```console
```

