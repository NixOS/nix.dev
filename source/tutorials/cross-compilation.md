---
html_meta:
  "description lang=en": "Cross compilation tutorial using Nix"
  "keywords": "Nix, cross compilation, cross-compile, Nix"
---


(cross-compilation)=

# Cross compilation

When compiling code, we can distinguish between the **build platform**, where the executable
is *built*, and the **host platform**, where the compiled executable *runs*. [^id3]

**Native compilation** is the special case where those two platforms are the same.
**Cross compilation** is the general case where those two platforms are not.

Cross compilation needed when the host platform has limited resources (such as CPU)
or when it's not easily accessible for development.

The `nixpkgs` package collection has world-class support for cross compilation,
after many years of hard work by the Nix community.

[^id3]: Terminology for cross compilation platforms differs between build systems.
    We have chosen to follow
    [autoconf terminology](https://www.gnu.org/software/autoconf/manual/autoconf-2.69/html_node/Hosts-and-Cross_002dCompilation.html).

## What's a target platform?

There's actually a third platform named the target platform.

It matters in cases where you'd like to distribute a compiler binary,
as you'd then like to build a compiler on the build platform, compile code on the
host platform and run the final executable on the target platform.

Since that's rarely needed, we'll treat the target platform the same as the host.

## Pinning nixpkgs

To ensure reproducibility of this tutorial as explained in {ref}`the pinning tutorial <pinning-nixpkgs>`:

```shell-session
$ NIX_PATH=https://github.com/NixOS/nixpkgs/archive/9420363b95521e65a76eb5153de1eaee4a2e41c6.tar.gz
```

## Determining the host platform config

The build platform is determined automatically by Nix
as it can just guess it during the configure phase.

The host platform is best determined by running on the host platform:

```shell-session
$ bash $(nix-build '<nixpkgs>' -A gnu-config)/config.guess
aarch64-unknown-linux-gnu
```

In case that's not possible (when the host platform is not easily accessible
for development), the platform config has to be constructed manually via the following template:

```
<cpu>-<vendor>-<os>-<abi>
```

Note that `<vendor>` is often `unknown` and `<abi>` is optional.
There's also no unique identifier for a platform, for example `unknown` and
`pc` are interchangeable (hence it's called config.guess).

If you can't install Nix, find a way to run `config.guess` (usually comes with

: the autoconf package) from the OS you're able to run on the host platform.

Some other common examples of platform configs:

- aarch64-apple-darwin14
- aarch64-pc-linux-gnu
- x86_64-w64-mingw32
- aarch64-apple-ios

:::{note}
macOS/Darwin is a special case, as not the whole OS is open-source.
It's only possible to cross compile between `aarch64-darwin` and `x86_64-darwin`.
`aarch64-darwin` support was recently added, so cross compilation is barely tested.
:::

## Choosing the host platform with Nix

Nixpkgs comes with a set of predefined host platforms applied to all packages.

It's possible to explore predefined attribute sets via `nix repl`:

```shell-session
$ nix repl '<nixpkgs>'
Welcome to Nix version 2.3.12. Type :? for help.

Loading '<nixpkgs>'...
Added 14200 variables.

nix-repl> pkgsCross.<TAB>
pkgsCross.aarch64-android             pkgsCross.musl-power
pkgsCross.aarch64-android-prebuilt    pkgsCross.musl32
pkgsCross.aarch64-darwin              pkgsCross.musl64
pkgsCross.aarch64-embedded            pkgsCross.muslpi
pkgsCross.aarch64-multiplatform       pkgsCross.or1k
pkgsCross.aarch64-multiplatform-musl  pkgsCross.pogoplug4
pkgsCross.aarch64be-embedded          pkgsCross.powernv
pkgsCross.amd64-netbsd                pkgsCross.ppc-embedded
pkgsCross.arm-embedded                pkgsCross.ppc64
pkgsCross.armhf-embedded              pkgsCross.ppc64-musl
pkgsCross.armv7a-android-prebuilt     pkgsCross.ppcle-embedded
pkgsCross.armv7l-hf-multiplatform     pkgsCross.raspberryPi
pkgsCross.avr                         pkgsCross.remarkable1
pkgsCross.ben-nanonote                pkgsCross.remarkable2
pkgsCross.fuloongminipc               pkgsCross.riscv32
pkgsCross.ghcjs                       pkgsCross.riscv32-embedded
pkgsCross.gnu32                       pkgsCross.riscv64
pkgsCross.gnu64                       pkgsCross.riscv64-embedded
pkgsCross.i686-embedded               pkgsCross.scaleway-c1
pkgsCross.iphone32                    pkgsCross.sheevaplug
pkgsCross.iphone32-simulator          pkgsCross.vc4
pkgsCross.iphone64                    pkgsCross.wasi32
pkgsCross.iphone64-simulator          pkgsCross.x86_64-embedded
pkgsCross.mingw32                     pkgsCross.x86_64-netbsd
pkgsCross.mingwW64                    pkgsCross.x86_64-netbsd-llvm
pkgsCross.mmix                        pkgsCross.x86_64-unknown-redox
pkgsCross.msp430
```

Cross compilation package attribute names are made up, so it isn't always clear
what is the corresponding platform config.

It's possible to query the platform config using:

```
nix-repl> pkgsCross.aarch64-multiplatform.stdenv.hostPlatform.config
"aarch64-unknown-linux-gnu"
```

In case the host platform you seek hasn't been defined yet:

1. [Contribute it upstream](https://github.com/NixOS/nixpkgs/blob/master/lib/systems/examples.nix).

2. Pass the host platforms to `crossSystem` when importing `<nixpkgs>`:

   ```
   nix-repl> (import <nixpkgs> { crossSystem = { config = "aarch64-unknown-linux-gnu"; }; }).hello
   «derivation /nix/store/qjj23s25kg4vjqq19vxs4dg7k7h214ns-hello-aarch64-unknown-linux-gnu-2.10.drv»
   ```

   Or using passing it as an argument to `nix-build`:

   ```
   $ nix-build '<nixpkgs>' -A hello --arg crossSystem '{ config = "aarch64-unknown-linux-gnu"; }'
   ```

## Cross compiling for the first time!

To cross compile a package like [hello](https://www.gnu.org/software/hello/),
pick the platform attribute - `aarch64-multiplatform` in our case - and run:

```shell-session
$ nix-build '<nixpkgs>' -A pkgsCross.aarch64-multiplatform.hello
...
/nix/store/pzi2h0d60nb4ydcl3nn7cbxxdnibw3sy-hello-aarch64-unknown-linux-gnu-2.10
```

[Search for a package](https://search.nixos.org/packages) attribute name to find the
one that you're interested in building.

## Real-world cross compiling of a Hello World example

To show off the power of cross compilation in Nix, let's build our own Hello World program
by cross compiling it as static executables to `armv6l-unknown-linux-gnueabihf`
and `x86_64-w64-mingw32` (Windows) platforms and run the resulting executable
with [an emulator](https://en.wikipedia.org/wiki/Emulator).

```nix
{ pkgs ? import <nixpkgs> {}
}:

let
  # Create a C program that prints Hello World
  helloWorld = pkgs.writeText "hello.c" ''
    #include <stdio.h>

    int main (void)
    {
      printf ("Hello, world!\n");
      return 0;
    }
  '';

  # A function that takes host platform packages
  crossCompileFor = hostPkgs:
    # Run a simple command with the compiler available
    hostPkgs.runCommandCC "hello-world-cross-test" {} ''
      # Wine requires home directory
      HOME=$PWD

      # Compile our example using the compiler specific to our host platform
      $CC ${helloWorld} -o hello

      # Run the compiled program using user mode emulation (Qemu/Wine)
      # buildPackages is passed so that emulation is built for the build platform
      ${hostPkgs.stdenv.hostPlatform.emulator hostPkgs.buildPackages} hello > $out

      # print to stdout
      cat $out
    '';
in {
  # Statically compile our example using the two platform hosts
  rpi = crossCompileFor pkgs.pkgsCross.raspberryPi;
  windows = crossCompileFor pkgs.pkgsCross.mingwW64;
}
```

If we build this example and print both resulting derivations, we should see "Hello, world!" for each:

```shell-session
$ cat $(nix-build cross-compile.nix)
Hello, world!
Hello, world!
```

## Developer environment with a cross compiler

In the {ref}`tutorial for declarative reproducible environments <declarative-reproducible-envs>`,
we looked at how Nix helps us provide tooling and system libraries for our project.

It's also possible to provide an environment with a compiler configured for **cross-compilation
to static binaries using musl**.

Given we have a `shell.nix`:

```nix
{ nixpkgs ? fetchTarball "https://github.com/NixOS/nixpkgs/archive/bba3474a5798b5a3a87e10102d1a55f19ec3fca5.tar.gz"
, pkgs ? (import nixpkgs {}).pkgsCross.aarch64-multiplatform
}:

# callPackage is needed due to https://github.com/NixOS/nixpkgs/pull/126844
pkgs.pkgsStatic.callPackage ({ mkShell, zlib, pkg-config, file }: mkShell {
  # these tools run on the build platform, but are configured to target the host platform
  nativeBuildInputs = [ pkg-config file ];
  # libraries needed for the host platform
  buildInputs = [ zlib ];
}) {}
```

And `hello.c`:

```c
#include <stdio.h>

int main (void)
{
  printf ("Hello, world!\n");
  return 0;
}
```

We can cross compile it:

```shell-session
$ nix-shell --run '$CC hello.c -o hello' cross-compile-shell.nix
```

And confirm it's aarch64:

```shell-session
$ nix-shell --run 'file hello' cross-compile-shell.nix
hello: ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV), statically linked, with debug_info, not stripped
```

## Next steps

- The [official binary cache](https://cache.nixos.org) has very limited number of binaries
  for packages that are cross compiled, so to save time recompiling, configure
  {ref}`a binary cache and CI (GitHub Actions and Cachix) <github-actions>`.

- While many compilers in nixpkgs support cross compilation,
  not all of them do.

  On top of that, supporting cross compilation is not trivial
  work and due to many possible combinations of what would
  need to be tested, some packages might not build.

  [A detailed explanation how of cross compilation is implemented in Nix](https://nixos.org/manual/nixpkgs/stable/#chap-cross) can help with fixing those issues.

- The Nix community has a [dedicated Matrix room](https://matrix.to/#/#cross-compiling:nixos.org)
  for help around cross compiling.
