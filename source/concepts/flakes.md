# Flakes

## What are flakes?

What is usually referred to as "flakes" is:
- A policy for managing dependencies between {term}`Nix expression`s.
- An [experimental feature] in Nix, implementing that policy and supporting functionality.

[experimental feature]: https://nixos.org/manual/nix/unstable/contributing/experimental-features.html

Technically, a [flake](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#description) is a file system tree that contains a file named `flake.nix` in its root directory.

Flakes add the following behavior to Nix:

1. A `flake.nix` file offers a uniform [schema](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-format) , where:
   - Other flakes can be referenced as dependencies providing {term}`Nix language` code or other files.
   - The values produced by the {term}`Nix expression`s in `flake.nix` are structured according to pre-defined use cases.

1. References to other flakes can be specified using a dedicated [URL-like syntax](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-references).
   A [flake registry] allows using symbolic identifiers for further brevity.
   References can be automatically locked to their current specific version and later updated programmatically.

   [flake registry]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-registry.html

1. A [new command line interface], implemented as a separate experimental feature, leverages flakes by accepting flake references in order to build, run, or deploy software defined as a flake.

   [new command line interface]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix.html

Nix handles flakes differently than regular {term}`Nix file`s in the following ways:

- The `flake.nix` file is checked for schema validity.

  In particular, the metadata fields cannot be arbitrary Nix expressions.
  This is to prevent complex, possibly non-terminating computations while querying the metadata.

- The entire flake directory is copied to Nix store before evaluation.

  This allows for effective evaluation caching, which is relevant for large expressions such as Nixpkgs, but also requires copying the entire flake directory again on each change.

- No external variables, parameters, or impure language values are allowed.

  It means full reproducibility of a Nix expression, and, by extension, the resulting build instructions by default, but also prohibits parameterisation of results by consumers.

## Why are flakes controversial?

Originally proposed in [RFC 49](https://github.com/NixOS/rfcs/pull/49), flakes have been in development since 2019.
Nix introduced the implementation as its first [experimental feature] in 2021.

The subject is considered controversial among Nix users and developers in terms of design, development processes, and community governance.
In particular:
- The RFC was closed without conclusion, and some design and implementation issues are not yet resolved.
  Examples include the notion of a global [flake registry], the [impossibility of parameterising flakes](https://github.com/NixOS/nix/issues/2861), and implementations of the new command line interface and flakes being [closely tied](https://discourse.nixos.org/t/2023-03-06-nix-team-meeting-minutes-38/26056#cli-stabilisation-announcement-draft-4).
- The original implementation introduced [regressions](https://discourse.nixos.org/t/nix-2-4-and-what-s-next/16257) in the [Nix 2.4 release](https://nixos.org/manual/nix/stable/release-notes/rl-2.4.html), breaking some stable functionality without a [major version](https://semver.org/) increment.
- New Nix users were and still are encouraged by various individuals to adopt flakes despite there being no concrete plan or timeline for stabilisation.

This led to a situation where the stable interface was only sparsely maintained for multiple years, and repeatedly suffered breakages due to ongoing development.
Meanwhile, the new interface was adopted widely enough for evolving its design without negatively affecting users to become very challenging.

As of the [2022 community survey](https://discourse.nixos.org/t/2022-nix-survey-results/18983), more than half of the user base, a third of which were relative beginners, relied on experimental features.
{term}`Nixpkgs` as a contrasting example, while featuring a `flake.nix` for compatibility, does not depend on Nix experimental features in its code base.
