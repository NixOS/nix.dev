# Frequently Asked Questions

## Should I enable flakes?

You have to judge for yourself based on your needs.

[Flakes](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake) and the [`nix`](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix) command suite bring multiple improvements that are relevant for both software users and package authors:

- The new command line interface, together with flakes, make dealing with existing packages significantly more convenient.
- The constraints imposed on flakes strengthen reproducibility by default, and enable various performance improvements when interacting with a large Nix package repository like {term}`Nixpkgs`.
- Flake references allow for easier handling of version upgrades for existing packages or project dependencies.
- The flake schema helps with composing Nix projects from multiple sources in an ordered fashion.

Other than that, and below the surface of the flake schema, Nix and the Nix language work exactly the same in both cases.
In principle, the same level of reproducibility can be achieved with or without flakes.
In particular, the process of adding software to {term}`Nixpkgs` or maintaining {term}`NixOS` modules and configurations is not affected by flakes at all.

Both paradigms have their own set of unique concepts and support tooling that have to be learned, with varying ease of use, implementation quality, and support status.
At the moment, neither the stable nor the experimental interface is clearly superior to the other in all aspects.
While flakes reduce complexity in some regards, they introduce additional concepts and you will have to learn more about the system to fully understand how it works.

There are downsides to relying on [experimental features](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-experimental-features) in general:

- Interfaces and behavior of experimental features could still be changed by Nix developers.
  This may require you to adapt your code at some point in the future, which will require more effort once it has grown in complexity.
  Currently there is no agreed-upon plan or timeline for stabilising flakes.
- The [Nix maintainer team](https://nixos.org/community/teams/nix.html) focuses on fixing bugs and regressions in stable interfaces, supporting well-understood use cases, as well as improving the internal design and overall contributor experience in order to ease future development.
  Improvements to experimental features have low priority.
- The [Nix documentation team](https://nixos.org/community/teams/documentation.html) focuses on improving documentation and learning materials for stable features and common principles.
  When using flakes, you will have to rely more heavily on user-to-user support, third-party documentation, and the source code.

## What Nix channels are available and what are their different branches on GitHub?

See <https://nixos.wiki/wiki/Nix_channels>.

## Are there some known impurities in builds?

Yes.

- CPU (we try hard to avoid compiling native instructions, but rather hardcode supported ones).
- Current time/date.
- FileSystem (ext4 has a known bug creating [empty files on power loss](https://github.com/NixOS/nixpkgs/issues/15581).)
- Kernel.
- Timing behaviour of the build system (parallel Make not getting the correct inputs in some cases).
