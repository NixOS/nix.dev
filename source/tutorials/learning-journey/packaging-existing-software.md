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

In this tutorial, you'll create your first Nix derivations to package C/C++ software, taking advantage of the [`nixpkgs` `stdenv`](https://nixos.org/manual/nixpkgs/stable/#chap-stdenv) which automates much of the work of building self-contained C/C++ packages.

The tutorial begins by considering `hello`, an implementation of "hello world" which only requires dependencies already in `stdenv`.

Next, you will build more complex packages with their own dependencies, leading you to use additional derivation features.

You'll encounter and address Nix error messages, build failures, and a host of other issues, developing your iterative debugging techniques along the way.

:::{note}
An important point of clarification: the term "package" is used conventionally by analogy to other systems, although the term does not refer to a proper concept in Nix.

For the purposes of this tutorial, "package" means something like "result of a derivation"; this is the artifact you or others will use, as a consequence of having "packaged existing software with Nix".
:::

## A Simple Project
To start, consider this skeleton derivation:

```nix
{ stdenv }:

stdenv.mkDerivation {	};
```

This is a function which takes an attribute set containing `stdenv`, and produces a derivation (which currently does nothing). As you progress through this tutorial, you will update this several times, adding more details while following the general pattern.

### Hello, World!
GNU Hello is an implementation of the "hello world" program, with source code accessible [from the GNU Project's FTP server](https://ftp.gnu.org/gnu/hello/).

To begin, you will download the [latest version](https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz) of `hello` using `fetchTarball`, which takes the URI path to the download file and a SHA256 hash of its contents.

The hash cannot be known until after the tarball has been downloaded and unpacked, but Nix will complain if the hash supplied to `fetchTarball` was incorrect, so it is common practice to supply a fake one with `lib.fakeSha256` and change the derivation definition after Nix reports the correct hash:

```nix
# hello.nix
{ lib
, stdenv
}:

stdenv.mkDerivation {
  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = lib.fakeSha256;
  };
}
```

Save this file to `hello.nix` and try to build it with `nix-build`, observing your first build failure:

```console
$ nix-build hello.nix
error: cannot evaluate a function that has an argument without a value ('lib')
       Nix attempted to evaluate a function as a top level expression; in
       this case it must have its arguments supplied either by default
       values, or passed explicitly with '--arg' or '--argstr'. See
       https://nixos.org/manual/nix/stable/language/constructs.html#functions.

       at /home/nix-user/hello.nix:2:3:

            1| # hello.nix
            2| { lib
             |   ^
            3| , stdenv
```

Problem: the expression in `hello.nix` is a *function*, which only produces its intended output if it is passed the correct *arguments*.

### A New Command
`lib` is available from `nixpkgs`, which must be imported with another Nix expression in order to pass it as an argument to this derivation. The `nix-build` command allows passing whole expressions as an argument following the `-E/--expr` flag, like this one:

```console
with import <nixpkgs> {}; callPackage ./hello.nix {}
```

`callPackage` automatically passes attributes from `nixpkgs` to the given function (here, the one in `hello.nix`), if they match attributes required by that function's argument attrset. Here, `callPackage` will supply `lib`, and `stdenv`.

To avoid having to execute `nix-build -E 'with import <nixpkgs> {}; callPackage ./hello.nix {}'` each time, create a `default.nix` in the same directory as `hello.nix`, with the following contents:

```nix
# default.nix
let
  pkgs = import <nixpkgs> { };
in
{
  hello = pkgs.callPackage ./hello.nix { };
}
```

This allows you to use `nix-build -A hello` to realize the derivation in `hello.nix`, similar to the current convention used in `nixpkgs`.

Now run the `nix-build` command with the new argument:

```console
$ nix-build -A hello
error: derivation name missing
```

This new failure occurs with the *derivation*, further down in the file than the initial error on line 2 about the `lib` argument not having a value; the previous error was successfully resolved by changing the expression passed to `nix-build`.

### Naming a Derivation
Every derivation needs a `name` attribute, which must either be set directly or constructed by `mkDerivation` from `pname` and `version` attributes, if they exist.

Update the file again to add a `name`:

```nix
# hello.nix
{ lib
, stdenv
}:

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
$ nix-build -A hello
error:
       … while calling the 'derivationStrict' builtin

         at /builtin/derivation.nix:9:12: (source not available)

       … while evaluating derivation 'hello'
         whose name attribute is located at /nix/store/5na8c1j0cn5wls2g2d8q357cz3aqlaqj-nixos-23.05.2478.bd836ac5e5a7/nixos/pkgs/stdenv/generic/make-derivation.nix:303:7

       … while evaluating attribute 'src' of derivation 'hello'

         at /home/nix-user/hello.nix:9:3:

            8|
            9|   src = builtins.fetchTarball {
             |   ^
           10|     url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";

       error: hash mismatch in file downloaded from 'https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz':
         specified: sha256:0000000000000000000000000000000000000000000000000000
         got:       sha256:0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn
```

### Finding The File Hash
As expected, the incorrect file hash caused an error, and Nix helpfully provided the correct one, which you can now substitute into `hello.nix` to replace `lib.fakeSha256`:

```nix
# hello.nix
{ lib
, stdenv
}:

stdenv.mkDerivation {
  name = "hello";

  src = builtins.fetchTarball {
    url = "https://ftp.gnu.org/gnu/hello/hello-2.12.1.tar.gz";
    sha256 = "0xw6cr5jgi1ir13q6apvrivwmmpr5j8vbymp0x6ll0kcv6366hnn";
  };
}
```

Now run the previous command again:

```console
$ nix-build -A hello
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
Great news: the derivation built successfully!

The console output shows that `configure` was called, which produced a `Makefile` that was then used to build the project; it wasn't necessary to write any build instructions in this case, because the `stdenv` build system is based on `autoconf`, which automatically detected the structure of the project directory.

### Build Result
Check your working directory for the result:

```console
$ ls
default.nix hello.nix  result
```

This result is a symbolic link to a Nix store location containing the built binary; you can call `./result/bin/hello` to execute this program:

```console
$ ./result/bin/hello
Hello, world!
```

Congratulations, you have successfully packaged your first program with Nix!

Next, you'll package another piece of software with external-to-`stdenv` dependencies that present new challenges, requiring you to make use of more `mkDerivation` features.

## Something Bigger
Now you will package a somewhat more complicated program, [`icat`](https://github.com/atextor/icat), which allows you to render images in your terminal.

To start, modify the `default.nix` from the previous section by adding a new attribute for `icat`:

```nix
# default.nix
let
  pkgs = import <nixpkgs> { };
in
{
  hello = pkgs.callPackage ./hello.nix { };
  icat = pkgs.callPackage ./icat.nix { };
}
```

Now copy `hello.nix` to a new file, `icat.nix`, and update the `name` attribute in that file:

```nix
# icat.nix
{ lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";

  src = builtins.fetchTarball {
	...
  };
}
```

Now to download the source code. `icat`'s upstream repository is hosted on [GitHub](https://github.com/atextor/icat), so you should slightly modify the previous [source fetcher](https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers), this time using `pkgs.fetchFromGitHub` instead of `builtins.fetchTarball`, updating the argument attribute set to the function accordingly:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
}:

stdenv.mkDerivation {
  name = "icat";

  src = pkgs.fetchFromGitHub {
    ...
  };
}
```

### Fetching Source from GitHub
While `fetchTarball` required `url` and `sha256` arguments, more are needed for [`fetchFromGitHub`](https://nixos.org/manual/nixpkgs/stable/#fetchfromgithub).

The source is hosted on GitHub at `https://github.com/atextor/icat`, which already gives the first two arguments:
- `owner`: the name of the account controlling the repository; `owner = "atextor"`
- `repo`: the name of the repository to fetch; `repo = "icat"`

You can navigate to the project's [Releases page](https://github.com/atextor/icat/releases) to find a suitable `rev`, such as the git commit hash or tag (e.g. `v1.0`) corresponding to the release you want to fetch. In this case, the latest release tag is `v0.5`.

As in the `hello` example, a hash must also be supplied. This time, instead of using `lib.fakeSha256` and letting `nix-build` report the correct one in an error, you can fetch the correct hash in the first place with the `nix-prefetch-url` command. You need the SHA256 hash of the *contents* of the tarball (as opposed to the hash of the tarball file itself), so you will need to pass the `--unpack` and `--type sha256` arguments too:

```console
$ nix-prefetch-url --unpack https://github.com/atextor/icat/archive/refs/tags/v0.5.tar.gz --type sha256
path is '/nix/store/p8jl1jlqxcsc7ryiazbpm7c1mqb6848b-v0.5.tar.gz'
0wyy2ksxp95vnh71ybj1bbmqd5ggp13x3mk37pzr99ljs9awy8ka
```

Now you can supply the correct hash to `fetchFromGitHub`:

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
}
```

### Missing Dependencies
Running `nix-build` with the new `icat` attribute,  an entirely new issue is reported:

```console
$ nix-build -A icat
these 2 derivations will be built:
  /nix/store/86q9x927hsyyzfr4lcqirmsbimysi6mb-source.drv
  /nix/store/l5wz9inkvkf0qhl8kpl39vpg2xfm2qpy-icat.drv
these 19 paths will be fetched (4.21 MiB download, 17.65 MiB unpacked):
...
trying https://github.com/atextor/icat/archive/v0.5.tar.gz
...
unpacking source archive /build/v0.5.tar.gz
building '/nix/store/l5wz9inkvkf0qhl8kpl39vpg2xfm2qpy-icat.drv'...
unpacking sources
unpacking source archive /nix/store/rx21f6fgnmxgp1sw0wbqll9wds4xc6v0-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/8fv91097mbh5049i9rglc73dx6kjg3qk-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_BSD_SOURCE -o icat.o icat.c
In file included from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/bits/libc-header-start.h:33,
                 from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/stdio.h:27,
                 from icat.c:31:
/nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/features.h:195:3: warning: #warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE" [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wcpp-Wcpp8;;]
  195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
      |   ^~~~~~~
icat.c:39:10: fatal error: Imlib2.h: No such file or directory
   39 | #include <Imlib2.h>
      |          ^~~~~~~~~~
compilation terminated.
make: *** [Makefile:16: icat.o] Error 1
error: builder for '/nix/store/l5wz9inkvkf0qhl8kpl39vpg2xfm2qpy-icat.drv' failed with exit code 2;
       last 10 log lines:
       >                  from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/stdio.h:27,
       >                  from icat.c:31:
       > /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/features.h:195:3: warning: #warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE" [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wcpp-Wcpp8;;]
       >   195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
       >       |   ^~~~~~~
       > icat.c:39:10: fatal error: Imlib2.h: No such file or directory
       >    39 | #include <Imlib2.h>
       >       |          ^~~~~~~~~~
       > compilation terminated.
       > make: *** [Makefile:16: icat.o] Error 1
       For full logs, run 'nix log /nix/store/l5wz9inkvkf0qhl8kpl39vpg2xfm2qpy-icat.drv'.
```

A compiler error! The `icat` source was pulled from GitHub, and Nix tried to build what it found, but compilation failed due to a missing dependency: the `imlib2` header. If you [search for `imlib2` on search.nixos.org](https://search.nixos.org/packages?channel=23.05&from=0&size=50&sort=relevance&type=packages&query=imlib2), you'll find that `imlib2` is already in `nixpkgs`.

You can add this package to your build environment by adding `imlib2` to the set of inputs to the expression in `icat.nix`, and then adding `imlib2` to the list of `buildInputs` in `stdenv.mkDerivation`:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
, imlib2
}:

stdenv.mkDerivation {
  name = "icat";

  src = pkgs.fetchFromGitHub {
    owner = "atextor";
	repo = "icat";
	rev = "v0.5";
	sha256 = "0wyy2ksxp95vnh71ybj1bbmqd5ggp13x3mk37pzr99ljs9awy8ka";
  };

  buildInputs = [ imlib2 ];
}
```

Another error, but compilation proceeds further this time:

```console
$ nix-build -A icat
this derivation will be built:
  /nix/store/bw2d4rp2k1l5rg49hds199ma2mz36x47-icat.drv
...
building '/nix/store/bw2d4rp2k1l5rg49hds199ma2mz36x47-icat.drv'...
unpacking sources
unpacking source archive /nix/store/rx21f6fgnmxgp1sw0wbqll9wds4xc6v0-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/8fv91097mbh5049i9rglc73dx6kjg3qk-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_BSD_SOURCE -o icat.o icat.c
In file included from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/bits/libc-header-start.h:33,
                 from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/stdio.h:27,
                 from icat.c:31:
/nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/features.h:195:3: warning: #warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE" [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wcpp-Wcpp8;;]
  195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
      |   ^~~~~~~
In file included from icat.c:39:
/nix/store/4fvrh0sjc8sbkbqda7dfsh7q0gxmnh9p-imlib2-1.11.1-dev/include/Imlib2.h:45:10: fatal error: X11/Xlib.h: No such file or directory
   45 | #include <X11/Xlib.h>
      |          ^~~~~~~~~~~~
compilation terminated.
make: *** [Makefile:16: icat.o] Error 1
error: builder for '/nix/store/bw2d4rp2k1l5rg49hds199ma2mz36x47-icat.drv' failed with exit code 2;
       last 10 log lines:
       >                  from icat.c:31:
       > /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/features.h:195:3: warning: #warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE" [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wcpp-Wcpp8;;]
       >   195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
       >       |   ^~~~~~~
       > In file included from icat.c:39:
       > /nix/store/4fvrh0sjc8sbkbqda7dfsh7q0gxmnh9p-imlib2-1.11.1-dev/include/Imlib2.h:45:10: fatal error: X11/Xlib.h: No such file or directory
       >    45 | #include <X11/Xlib.h>
       >       |          ^~~~~~~~~~~~
       > compilation terminated.
       > make: *** [Makefile:16: icat.o] Error 1
       For full logs, run 'nix log /nix/store/bw2d4rp2k1l5rg49hds199ma2mz36x47-icat.drv'.
```

You can see a few warnings which should be corrected in the upstream code, but the important bit for this tutorial is `fatal error: X11/Xlib.h: No such file or directory`: another dependency is missing.

In addition to the widespread practice of prefixing a project name with `lib` to indicate the libraries of that project, in Nixpkgs it's also common to separate headers, libraries, binaries, and documentation into different output attributes of a given [derivation](https://nixos.org/manual/nix/stable/language/derivations.html).

:::{note}
Determining from where to source a dependency is currently a somewhat-involved process: it helps to become familiar with searching the `nixpkgs` source for keywords, in addition to checking discussion platforms like [the official NixOS Discourse](https://discourse.nixos.org).
:::

You will need the `Xlib.h` headers from the `X11` C package, the Nixpkgs derivation for which is `libX11`, available in the `xorg` package set. The `Xlib` headers in turn live in the `dev` output of `xorg.libX11`. Add this to your derivation's input attribute set and to `buildInputs`:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
, imlib2
, xorg
}:

stdenv.mkDerivation {
  name = "icat";

  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "v0.5";
    sha256 = "0wyy2ksxp95vnh71ybj1bbmqd5ggp13x3mk37pzr99ljs9awy8ka";
  };

  buildInputs = [ imlib2 xorg.libX11.dev ];
}
```

:::{note}
Only add the top-level `xorg` derivation to the input attrset, rather than the full `xorg.libX11.dev`, as the latter would cause a syntax error. Because Nix is lazily-evaluated, including the dependency this way is safe to do and doesn't actually include all of `xorg` into the build context.
:::


### `buildInputs` and `nativeBuildInputs`
Run the last command again:
```console
$ nix-build -A icat
this derivation will be built:
  /nix/store/x1d79ld8jxqdla5zw2b47d2sl87mf56k-icat.drv
building '/nix/store/x1d79ld8jxqdla5zw2b47d2sl87mf56k-icat.drv'...
unpacking sources
unpacking source archive /nix/store/rx21f6fgnmxgp1sw0wbqll9wds4xc6v0-source
source root is source
patching sources
configuring
no configure script, doing nothing
building
build flags: SHELL=/nix/store/8fv91097mbh5049i9rglc73dx6kjg3qk-bash-5.2-p15/bin/bash
gcc -c -Wall -pedantic -std=c99 -D_BSD_SOURCE -o icat.o icat.c
In file included from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/bits/libc-header-start.h:33,
                 from /nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/stdio.h:27,
                 from icat.c:31:
/nix/store/hkj250rjsvxcbr31fr1v81cv88cdfp4l-glibc-2.37-8-dev/include/features.h:195:3: warning: #warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE" [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wcpp-Wcpp8;;]
  195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
      |   ^~~~~~~
icat.c: In function 'main':
icat.c:319:33: warning: ignoring return value of 'write' declared with attribute 'warn_unused_result' [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wunused-result-Wunused-result8;;]
  319 |                                 write(tempfile, &buf, 1);
      |                                 ^~~~~~~~~~~~~~~~~~~~~~~~
gcc -o icat icat.o -lImlib2
installing
install flags: SHELL=/nix/store/8fv91097mbh5049i9rglc73dx6kjg3qk-bash-5.2-p15/bin/bash install
make: *** No rule to make target 'install'.  Stop.
error: builder for '/nix/store/x1d79ld8jxqdla5zw2b47d2sl87mf56k-icat.drv' failed with exit code 2;
       last 10 log lines:
       >   195 | # warning "_BSD_SOURCE and _SVID_SOURCE are deprecated, use _DEFAULT_SOURCE"
       >       |   ^~~~~~~
       > icat.c: In function 'main':
       > icat.c:319:33: warning: ignoring return value of 'write' declared with attribute 'warn_unused_result' [8;;https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wunused-result-Wunused-result8;;]
       >   319 |                                 write(tempfile, &buf, 1);
       >       |                                 ^~~~~~~~~~~~~~~~~~~~~~~~
       > gcc -o icat icat.o -lImlib2
       > installing
       > install flags: SHELL=/nix/store/8fv91097mbh5049i9rglc73dx6kjg3qk-bash-5.2-p15/bin/bash install
       > make: *** No rule to make target 'install'.  Stop.
       For full logs, run 'nix log /nix/store/x1d79ld8jxqdla5zw2b47d2sl87mf56k-icat.drv'.
```

The missing dependency error is solved, but there is now another problem: `make: *** No rule to make target 'install'.  Stop.`

### installPhase
The `stdenv` is automatically working with the `Makefile` that comes with `icat`: you can see in the console output that `configure` and `make` are executed without issue, so the `icat` binary is compiling successfully. The failure occurs when the `stdenv` attempts to run `make install`: the `Makefile` included in the project happens to lack an `install` target, and the `README` in the `icat` repository only mentions using `make` to build the tool, leaving the installation step up to users.

To add this step to your derivation, use the [`installPhase` attribute](https://nixos.org/manual/nixpkgs/stable/#ssec-install-phase), which contains a list of command strings to execute to perform the installation.

Because the `make` step completes successfully, the `icat` executable is available in the build directory, and you only need to copy it from there to the output directory. In Nix, this location is stored in the `$out` variable, accessible in the derivation's component scripts; create a `bin` directory within that and copy the `icat` binary there:

```nix
# icat.nix
{ pkgs
, lib
, stdenv
, imlib2
, xorg
}:

stdenv.mkDerivation {
  name = "icat";

  src = pkgs.fetchFromGitHub {
    owner = "atextor";
    repo = "icat";
    rev = "v0.5";
    sha256 = "0wyy2ksxp95vnh71ybj1bbmqd5ggp13x3mk37pzr99ljs9awy8ka";
  };

  buildInputs = [ imlib2 xorg.libX11.dev ];

  installPhase = ''
    mkdir -p $out/bin
    cp icat $out/bin
  '';
}
```

### Phases and Hooks
Nixpkgs `stdenv.mkDerivation` derivations are separated into [phases](https://nixos.org/manual/nixpkgs/stable/#sec-stdenv-phases), each of which is intended to control some aspect of the build process.

You saw earlier how the `stdenv.mkDerivation` expected the project's `Makefile` to have an `install` target, and failed when it didn't. To fix this, you defined a custom `installPhase`, containing instructions for copying the `icat` binary to the correct output location, in effect installing it.

Up to that point, the `stdenv` automatically determined the `buildPhase` information for the `icat` package.

During derivation realisation, there are a number of shell functions ("hooks", in `nixpkgs`) which may execute in each derivation phase, which do things like set variables, source files, create directories, and so on. These are specific to each phase, and run both before and after that phase's execution, controlling the build environment and helping to prevent environment-modifying behavior defined within packages from creating sources of nondeterminism within and between Nix derivations.

It's good practice when packaging software with Nix to include calls to these hooks in the derivation phases you define, even when you don't make direct use of them; this facilitates easy [overriding](https://nixos.org/manual/nixpkgs/stable/#chap-overrides) of specific parts of the derivation later, in addition to the previously-mentioned reproducibility benefits.

You should now adjust your `installPhase` to call the appropriate hooks:

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

Running the `nix-build` command once more will finally do what you want, and more safely than before; you can `ls` in the local directory to find a `result` symlink to a location in the Nix store:

```console
$ ls
default.nix hello.nix icat.nix result
```

`result/bin/icat` is the executable built previously. Success!
