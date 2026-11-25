# Packaging: Tools & Techniques
One of Nix's primary use-cases is in addressing common difficulties encountered while packaging software, like *managing dependencies*.

In the long term, Nix helps tremendously in alleviating that stress, but when *first* (re)packaging existing software with Nix, it's common to encounter missing dependencies preventing builds from succeeding.

This page covers some tools and techniques for the following:
- tracking down these missing dependencies and including them in your derivations,
- determining whether to use `some_pkg` versus `some_pkg.dev` for missing headers or development libraries, and
- adding platform-specific dependencies.


## Dependency Discovery
If you're packaging software you wrote, you should already know what dependencies are needed.

In this case, you can find the Nix package names for these dependencies by checking the [NixOS Package Search](https://search.nixos.org/packages) site.

For packaging software other people wrote, check the upstream repository for this information (could be in a Makefile or requirements.txt or something similar), or in the case of prebuilt binaries, check system requirements and other documentation from the upstream.

Especially for proprietary software, prebuilt binaries will usually come with a list of additional required packages.

### Helpful Tools
There are a few programs that can be used to find a binary executable's dependencies.

`ldd` allows for viewing an executable file's shared object dependencies, and is an easy way to determine which libraries are needed to run an existing binary:

```console
$ ldd ./result/bin/hello
  linux-vdso.so.1 (0x00007ffc8938e000)
  libc.so.6 => /nix/store/3n58xw4373jp0ljirf06d8077j15pc4j-glibc-2.37-8/lib/libc.so.6 (0x00007f9461d28000)
  /nix/store/3n58xw4373jp0ljirf06d8077j15pc4j-glibc-2.37-8/lib/ld-linux-x86-64.so.2 => /nix/store/3n58xw4373jp0ljirf06d8077j15pc4j-glibc-2.37-8/lib64/ld-linux-x86-64.so.2 (0x00007f9461f10000)
```

In this case, `hello` requires `linux-vdso`, `libc`, and `ld`.

The first of these is part of the Linux kernel, while the latter two are part of the `stdenv` for Linux hosts.

Usually the output is more interesting:

```console
$ ldd /nix/store/sspk2i8rcj5h82zm2gd30xih5il2bw7l-emacs-28.2/bin/emacs
  	linux-vdso.so.1 (0x00007ffdb8592000)
	libXcursor.so.1 => /nix/store/29zrpf3c54d5zs1hj7bdzf97l9m2ay6h-libXcursor-1.2.0/lib/libXcursor.so.1 (0x00007f7b245b3000)
	libtiff.so.6 => /nix/store/j7zyv8fn0g2kb4bpa9li7i7akpkp07jw-libtiff-4.5.0/lib/libtiff.so.6 (0x00007f7b2452d000)
	libjpeg.so.62 => /nix/store/yxgca61a6rwhdhpbh966r8v0hzvfsyzj-libjpeg-turbo-2.1.5.1/lib/libjpeg.so.62 (0x00007f7b2447e000)
	libpng16.so.16 => /nix/store/m9dqylpdc52yw6mg6sq88w6zwfs6dw87-libpng-apng-1.6.39/lib/libpng16.so.16 (0x00007f7b24445000)
	... (87 lines omitted)
```

In this example, `ldd` output many dependencies on the left, along with their present link location in the Nix store on the right.

Users of Linux systems other than NixOS will see different but similar output.

In both cases, the Nix package name of the dependency listed on the left can be found by searching the [NixOS Package Search](https://search.nixos.org/packages) site.

:::{note}
`ldd` is not available on Darwin systems, but the `otool -L` command serves a similar purpose in that context.
:::

## Including Headers and Libraries
Because everything is a derivation in Nix, there is no distinction between headers, libraries, and anything else *from the perspective of package management*: everything is available in the same way from nixpkgs.

Of course, how you can actually *use* dependencies is another matter, and highly context-dependent.

Some derivations, sometimes called "split" derivations, contain multiple outputs like `lib`, `man`, and `bin`, respectively representing the runtime libraries, the manual pages, and compiled binaries.

### Library Include Dirs
When building a package from source, you often need to make subdirectories of some library packages available to the build system.

There are several ways to do this, but the best two options involve adding the path to the relevant library directories to `$PATH` or another environment variable, and either:
- (re-) exporting this via a bash command within `mkDerivation`'s `buildPhase` attribute, or
- letting Nix make the variable available in the build environment by declaring the environment as a new attribute in `mkDerivation`.

There are valid reasons to one or the other of these, but here we'll use the latter, after a brief interlude to examine some useful functions from nixpkgs.

#### Utility Functions
`lib.strings` in nixpkgs contains a family of handy functions for constructing Unix-style colon-separated path strings, used by build tools to search for dependencies.

A description of each is given below, along with sample `nix repl` output showing their use.

You'll often want to reach for these when packaging your software.

:::{note}
The last positional argument of all of these functions is a list containing strings representing filesystem paths, packages, or both.
:::

##### `makeLibraryPath`
This function returns a string containing the paths to the library subdirectory of everything in the given list.

```console
nix-repl> makeLibraryPath [ "/usr" "/usr/local" ]
=> "/usr/lib:/usr/local/lib"
nix-repl> makeLibraryPath [ pkgs.openssl pkgs.zlib ]
=> "/nix/store/zqhfl96qd58z9whx865sx1njnm2kxryi-openssl-3.0.5/lib:/nix/store/35236f66yj5n3ams20w873fkddlfvghm-zlib-1.2.12/lib"
```

##### `makeBinPath`
Similar to `makeLibraryPath`, `makeBinPath` constructs a search path for the `/bin` subdirectory of everything in the given list.

```console
nix-repl> makeBinPath ["/usr" "/usr/local"]
=> "/usr/bin:/usr/local/bin"
nix-repl> makeBinPath [pkgs.openssl pkgs.zlib]
=> "/nix/store/cr1998fn6rjmhrhwylqzq021zhn54zhp-openssl-3.0.5-bin/bin:/nix/store/35236f66yj5n3ams20w873fkddlfvghm-zlib-1.2.12/bin"
```

##### `makeSearchPath`
This function takes an additional string argument, which contains the name of a subdirectory to append to the paths of each element in the list.

```console
nix-repl> makeSearchPath "bin" [ pkgs.openssl pkgs.zlib ]
=> "/nix/store/cr1998fn6rjmhrhwylqzq021zhn54zhp-openssl-3.0.5-bin/bin:/nix/store/35236f66yj5n3ams20w873fkddlfvghm-zlib-1.2.12/bin"
nix-repl> makeSearchPath "bin" [ pkgs.openssl pkgs.zlib ]
"/nix/store/cr1998fn6rjmhrhwylqzq021zhn54zhp-openssl-3.0.5-bin/bin:/nix/store/35236f66yj5n3ams20w873fkddlfvghm-zlib-1.2.12/bin"
```

##### `makeSearchPathOutput`
In addition to the subdirectory name argument of `makeSearchPath`, `makeSearchPathOutput` also takes a string containing the name of an output attribute of a derivation, appending the subdirectory to the path of that output.

This function and `makeSearchPath` are especially handy when working with split derivations.

```console
nix-repl> makeSearchPathOutput "dev" "bin" [ pkgs.openssl pkgs.zlib ]
"/nix/store/iwigjmzk8nailq789i0sd35cc9lyqwml-openssl-3.0.5-dev/bin:/nix/store/45nwws8pg1qdr2s14vf2na1wwddj3bca-zlib-1.2.12-dev/bin"
```

## Platform-specific Dependencies
Every hardware and software platform comes with unique quirks, some of which impact the experience of building software targeting those platforms, necessitating additional dependencies not required elsewhere. Some examples:
- many compilers on aarch64-darwin and x86_64-darwin must include [Frameworks from Apple's SDKs](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)
- tasks in computationally-intensive areas like machine learning, numerical computing, and signal processing see significant speedup from hardware acceleration, with specialty devices requiring certain drivers
- producing self-contained, statically-compiled binaries often involves the use of different toolchains, like those targeting musl libc.

Determining _which_ of these dependencies are needed can occasionally be a challenge, as non-Linux platforms — particularly _newer_ ones like aarch64-darwin — tend to be less well-documented, and sometimes only supported experimentally.

### Darwin
As previously mentioned, Nix packages on macOS (aarch64-darwin, x86_64-darwin) often require functions from Apple's SDK Frameworks, available from Nixpkgs as `pkgs.darwin.apple_sdk.frameworks`.

There are other important differences, however.

- The Darwin `stdenv` uses `clang` instead of `gcc` (though `gcc` is still available for Darwin systems).

When referring to the compiler within a derivation, `$CC` or `cc` will work in both cases.

Some builds hardcode `gcc` or `g++` in their build scripts, which can usually be fixed by adding `makeFlags = [ "CC=cc" ];`, or by patching the build scripts directly.

```nix
stdenv.mkDerivation {
  name = "libfoo-1.2.3";
  # ...
  buildPhase = ''
    $CC -o hello hello.c
  '';
}
```

- On Darwin, libraries are linked using absolute paths, and are resolved by their `install_name` at link time.

Sometimes packages won’t set this correctly, which causes the library lookups to fail at runtime.

This can be fixed by adding extra linker flags pointing to the correct library paths, or by running `install_name_tool -id` during the `fixupPhase`.

```nix
stdenv.mkDerivation {
  name = "libfoo-1.2.3";
  # ...
  makeFlags = lib.optional stdenv.isDarwin "LDFLAGS=-Wl,-install_name,$(out)/lib/libfoo.dylib";
}
```

- Even if the libraries are linked using absolute paths and resolved correctly via their `install_name`, tests can sometimes fail to run binaries, because the `checkPhase` runs before the libraries are installed.

This can usually be solved by running the tests after the `installPhase`, or by using `DYLD_LIBRARY_PATH`.

More information about this variable can be found in the *dyld(1)* manpage.

```console
dyld: Library not loaded: /nix/store/7hnmbscpayxzxrixrgxvvlifzlxdsdir-jq-1.5-lib/lib/libjq.1.dylib
Referenced from: /private/tmp/nix-build-jq-1.5.drv-0/jq-1.5/tests/../jq
Reason: image not found
./tests/jqtest: line 5: 75779 Abort trap: 6
```

```nix
stdenv.mkDerivation {
  name = "libfoo-1.2.3";
  # ...
  doInstallCheck = true;
  installCheckTarget = "check";
}
```

- Some packages assume Xcode is available and use `xcrun` to resolve build tools like `clang`.

This causes errors like `xcode-select: error: no developer tools were found at '/Applications/Xcode.app'`, even though the build doesn’t actually depend on Xcode.

```nix
stdenv.mkDerivation {
  name = "libfoo-1.2.3";
  # ...
  prePatch = ''
    substituteInPlace Makefile \
        --replace '/usr/bin/xcrun clang' clang
  '';
}
```

The `xcbuild` package can be used to build projects that *do* depend on Xcode, but the replacement is not fully compatible with Xcode and can occasionally cause issues.

`x86_64-darwin` uses the 10.12 SDK by default, but some software is not compatible with that version of the SDK.

In that case, the 11.0 SDK used by aarch64-darwin is available for use on x86_64-darwin.

To use it, reference `apple_sdk_11_0` instead of `apple_sdk` in your derivation and use `pkgs.darwin.apple_sdk_11_0.callPackage` instead of `pkgs.callPackage`.

On Linux, this will have the same effect as `pkgs.callPackage`, so you can use `pkgs.darwin.apple_sdk_11_0.callPackage` regardless of platform.

### Including Platform-specific Dependencies
The Nix standard library contains a few helper functions useful for conditionally-including platform-specific dependencies.

Two of the most commonly used are `lib.optionals` and `lib.optionalString`, both of which take a boolean argument in the first position, followed by a string in the case of `lib.optionalString`, or any kind of attribute in the case of `lib.optionals`.

Here's an example using both of these to optionally include some packages and dynamically-linked libraries within a derivation:

```nix
...

frameworks = pkgs.darwin.apple_sdk.frameworks;
darwinInputs = lib.optionals pkgs.stdenv.isDarwin (with pkgs; [ libiconv frameworks.Security ]);
nixLdFlags = lib.optionalString pkgs.stdenv.isDarwin "-F${frameworks.CoreServices}/Library/Frameworks -framework CoreServices -L${pkgs.libiconv}/lib";

buildInputs = (with pkgs; [ gcc cmake ]) ++ darwinInputs;

NIX_LD_FLAGS = nixLdFlags;

...
```
