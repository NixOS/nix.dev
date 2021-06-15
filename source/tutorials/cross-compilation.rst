.. _ref-cross-compilation:

Cross-compilation
=================

Cross-compilation is the act of **compiling code** on the **build platform**
to the **host platform**, where the compiled **executable runs**. [#]_

It's needed when the host platform has limited resources (such as CPU)
or when it's not easily accessible for development.

The Nix community has world-class support for cross-compilation,
after years of hard work from our community.

.. [#] Terminology for cross-compilation platforms differs between build systems.
       We have chosen to follow 
       `autoconf terminology <https://www.gnu.org/software/autoconf/manual/autoconf-2.69/html_node/Hosts-and-Cross_002dCompilation.html>`_.

.. note:: macOS/Darwin is a special case, as not the whole OS is open-source. 
          It's only possible to cross-compile between ``aarch64-darwin`` and ``x86_64-darwin``.


What's a target platform?
-------------------------

There's actually a third platform named the target platform.

It matters in cases where you'd like to distribute a compiler binary, 
as you'd then like to build a compiler on the build platform, compile code on the
host plaform and run the final executable on the target platform.


Since that's rarely needed, we'll treat the target platform the same as the host.


Determining the host platform config
------------------------------------

The build platform is determined automatically by Nix
as it can just guess it during the configure phase.

The host platform is best determined by running on the host platform:

.. code:: shell-session 

  $ bash $(nix-build '<nixpkgs>' -A gnu-config)/config.guess
  aarch64-unknown-linux-gnu

In case that's not possible (when the host platform is not easily accessible
for development), the platform config has to be constructed manually via the following template:

.. code::

  <cpu>-<vendor>-<os>-<abi>

Note that ``<vendor>`` is often ``unknown`` and ``<abi>`` is optional. 
There's also no unique identifier for a platform, for example ``unknown`` and 
``pc`` are interchangeable (hence it's called config.guess).

If you can't install Nix, find a way to run ``config.guess`` (usually comes with
 the autoconf package) from the OS you're able to run on the host platform.

Some other common examples of platform configs:

- aarch64-apple-darwin14
- aarch64-pc-linux-gnu
- x86_64-w64-mingw32
- aarch64-apple-ios


Choosing the host platform with Nix
-----------------------------------

Nixpkgs comes with a set of predefined host platforms applied to all packages.

It's possible to list predefined attribute sets via shell completion:

.. code:: shell-session

  $ nix-build '<nixpkgs>' -A pkgsCross.<TAB>
  pkgsCross.aarch64-android             pkgsCross.musl32
  pkgsCross.aarch64-android-prebuilt    pkgsCross.musl64
  pkgsCross.aarch64be-embedded          pkgsCross.muslpi
  pkgsCross.aarch64-darwin              pkgsCross.musl-power
  pkgsCross.aarch64-embedded            pkgsCross.or1k
  pkgsCross.aarch64-multiplatform       pkgsCross.pogoplug4
  pkgsCross.aarch64-multiplatform-musl  pkgsCross.powernv
  pkgsCross.amd64-netbsd                pkgsCross.ppc64
  pkgsCross.arm-embedded                pkgsCross.ppc64-musl
  pkgsCross.armhf-embedded              pkgsCross.ppc-embedded
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


Cross-compilation package attribute names are made up, so it isn't always clear 
what is the corresponding platform config.

It's possible to query the platform config using:

  $ nix-instantiate '<nixpkgs>' -A pkgsCross.aarch64-darwin.hostPlatform.config --eval
  "aarch64-apple-darwin"

.. note:: In case the plaform you seek hasn't been defined yet, feel free to contribute one
          by `adding it upstream <https://github.com/NixOS/nixpkgs/blob/master/lib/systems/examples.nix>`_.


Cross-compiling for the first time!
-----------------------------------

To cross-compile a package like `hello <https://www.gnu.org/software/hello/>`_,
pick the platform attribute - ``aarch64-multiplatform`` in our case - and run:

.. code:: shell-session 

  $ nix-build '<nixpkgs>' -A pkgsCross.aarch64-multiplatform.hello
  ...
  /nix/store/pzi2h0d60nb4ydcl3nn7cbxxdnibw3sy-hello-aarch64-unknown-linux-gnu-2.10

`Search for a package <https://search.nixos.org/packages>`_ attribute name to find the
one that you're interested in building.


Real-world cross-compiling of a Hello World example
---------------------------------------------------
 
To show off the power of cross-compilation in Nix, let's build our own Hello World program 
by cross-compiling it as static executables to ``armv6l-unknown-linux-gnueabihf``
and ``x86_64-w64-mingw32`` (Windows) platforms and run the resulting executable
with `an emulator <https://en.wikipedia.org/wiki/Emulator>`_.

.. code:: nix 

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

If we build this example and print both resulting derivations, we should see "Hello, world!" for each: 

.. code:: shell-session

  $ cat $(nix-build cross-compile.nix)
  Hello, world!
  Hello, world!


Developer environment with a cross-compiler
-------------------------------------------

In the :ref:`tutorial for declarative reproducible environments <declarative-reproducible-envs>`,
we looked at how Nix helps us provide tooling and system libraries for our project.

It's also possible to provide an environment with a compiler configured for cross-compilation.

Given we have a ``shell.nix``:

.. code:: nix

  { nixpkgs ? fetchTarball "https://github.com/NixOS/nixpkgs/archive/bba3474a5798b5a3a87e10102d1a55f19ec3fca5.tar.gz"
  , pkgs ? (import nixpkgs {}).pkgsCross.aarch64-multiplatform
  }:

  # pkgs.callPackage is needed due to https://github.com/NixOS/nixpkgs/pull/126844
  pkgs.callPackage ({ mkShell, zlib, pkg-config, file }: mkShell {
    # these tools run on the build platform, but are configured to target the target platform
    nativeBuildInputs = [ pkg-config file ];
    # libraries needed for the target platform
    buildInputs = [ zlib ];
  }) {}

And ``hello.c``:

.. code:: c 

  #include <stdio.h>

  int main (void)
  {
    printf ("Hello, world!\n");
    return 0;
  }

We can cross-compile it:

.. code:: shell-session 

  $ nix-shell --run '$CC hello.c -o hello' cross-compile-shell.nix

And confirm it's aarch64:

.. code:: shell-session 

  $ nix-shell --run 'file hello' cross-compile-shell.nix 
  hello: ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /nix/store/733hzlw1hixdm6dfdsb8dlwa2h8fl5qi-glibc-2.31-74-aarch64-unknown-linux-gnu/lib/ld-linux-aarch64.so.1, for GNU/Linux 2.6.32, with debug_info, not stripped
  

Next steps
----------

- The `official binary cache <https://cache.nixos.org>`_ doesn't come with binaries
  for packages that are cross-compiled, so it's important to set up
  :ref:`a binary cache and CI (GitHub Actions and Cachix) <github-actions>`.

- While many compilers in nixpkgs support cross-compilation,
  not all of them do.

  On top of that, supporting cross-compilation is not trivial
  work and due to many possible combinations of what would
  need to be tested, some packages might not build.

  `A detailed explanation how of cross-compilation is implemented in Nix <https://nixos.org/manual/nixpkgs/stable/#chap-cross>`_ can help with fixing those issues.

- The Nix community has a `dedicated Matrix room <https://matrix.to/#/#cross-compiling:nixos.org>`_
  for help around cross-compiling.
