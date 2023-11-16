# Frequently Asked Questions

## What is the origin of the name Nix?

> The name *Nix* is derived from the Dutch word *niks*, meaning *nothing*;
> build actions do not see anything that has not been explicitly declared as an input.
>
> &mdash; <cite>[Nix: A Safe and Policy-Free System for Software Deployment](https://edolstra.github.io/pubs/nspfssd-lisa2004-final.pdf), LISA XVIII, 2004</cite>

The Nix logo is inspired by [an idea for the Haskell logo](https://wiki.haskell.org/File:Sgf-logo-blue.png) and the fact that [*nix* is Latin for *snow*](https://nix-dev.science.uu.narkive.com/VDaaP1BY/nix-logo).

## Why are flakes controversial?

{ref}`Flakes <flakes>` were originally proposed in [RFC 49](https://github.com/NixOS/rfcs/pull/49), and have been in development since 2019.
Nix introduced the implementation as its first [experimental feature] in 2021.

[experimental feature]: https://nixos.org/manual/nix/unstable/contributing/experimental-features.html

The subject is considered controversial among Nix users and developers in terms of design, development processes, and community governance.
In particular:
- The RFC was closed without conclusion, and some design and implementation issues are not yet resolved.
  Examples include the notion of a global [flake registry], the [impossibility of parameterising flakes](https://github.com/NixOS/nix/issues/2861), and the [new command line interface and flakes being closely tied to each other](https://discourse.nixos.org/t/2023-03-06-nix-team-meeting-minutes-38/26056#cli-stabilisation-announcement-draft-4).
- The original implementation introduced [regressions](https://discourse.nixos.org/t/nix-2-4-and-what-s-next/16257) in the [Nix 2.4 release](https://nixos.org/manual/nix/stable/release-notes/rl-2.4.html), breaking some stable functionality without a [major version](https://semver.org/) increment.
- New Nix users were and still are encouraged by various individuals to adopt flakes despite there being no concrete plan or timeline for stabilisation.

[flake registry]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-registry.html

This led to a situation where the stable interface was only sparsely maintained for multiple years, and repeatedly suffered breakages due to ongoing development.
Meanwhile, the new interface was adopted widely enough for evolving its design without negatively affecting users to become very challenging.

As of the [2022 community survey](https://discourse.nixos.org/t/2022-nix-survey-results/18983), more than half of the user base, a third of which were relative beginners, relied on experimental features.
{term}`Nixpkgs` as a contrasting example, while featuring a `flake.nix` for compatibility, does not depend on Nix experimental features in its code base.

## Should I enable flakes?

You have to judge for yourself based on your needs.

[Flakes](https://nix.dev/concepts/flakes) and the `nix` command suite bring multiple improvements that are relevant for both software users and package authors:

- The new command-line interface, together with flakes, makes dealing with existing packages significantly more convenient.
- The constraints imposed on flakes strengthen reproducibility by default, and enable various performance improvements when interacting with a large Nix package repository like {term}`Nixpkgs`.
- Flake references allow for easier handling of version upgrades for existing packages or project dependencies.
- The [flake schema](https://nixos.wiki/wiki/Flakes#Flake_schema) helps with composing Nix projects from multiple sources in an orderly fashion.

Other than that, and below the surface of the flake schema, Nix and the Nix language work exactly the same in both cases.
In principle, the same level of reproducibility can be achieved with or without flakes.
In particular, the process of adding software to {term}`Nixpkgs` or maintaining {term}`NixOS` modules and configurations is not affected by flakes at all.

Both paradigms have their own set of unique concepts and support tooling that have to be learned, with varying ease of use, implementation quality, and support status.
At the moment, neither the stable nor the experimental interface is clearly superior to the other in all aspects.
While flakes reduce complexity in some regards, they also introduce additional mechanisms and you will have to learn more about the system to fully understand how it works.

There are downsides to relying on [experimental features](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-experimental-features) in general:

- Interfaces and behaviour of experimental features could still be changed by Nix developers.
  This may require you to adapt your code at some point in the future, which will be more effort when it has grown in complexity.
  Currently there is no agreed-upon plan or timeline for stabilising flakes.
- The [Nix maintainer team](https://nixos.org/community/teams/nix.html) focuses on fixing bugs and regressions in stable interfaces, supporting well-understood use cases, as well as improving the internal design and overall contributor experience in order to ease future development.
  Improvements to experimental features have a low priority.
- The [Nix documentation team](https://nixos.org/community/teams/documentation.html) focuses on improving documentation and learning materials for stable features and common principles.
  When using flakes, you will have to rely more heavily on user-to-user support, third-party documentation, and the source code.

## Which channel branch should I use?

Nixpkgs and NixOS have both stable and rolling releases.

### Stable

- On Linux (including NixOS and WSL), use [`nixos-*`](https://github.com/NixOS/nixpkgs/branches/all?query=nixos-).

  These branches point to commits where most Linux packages got pre-built and can be fetched from the binary cache.
  Furthermore, these commits passed the basic NixOS test suite.

- On macOS/Darwin, use [`nixpkgs-*-darwin`](https://github.com/NixOS/nixpkgs/branches/all?query=nixpkgs-)

  These branches point to commits where most Darwin packages got pre-built and can be fetched from the binary cache.

- On any other platform it doesn't matter which one of the above is used.

  Hydra doesn't pre-build any binaries for other platforms.

All of these "channel branches" follow the corresponding [`release-*`](https://github.com/NixOS/nixpkgs/branches/all?query=release-) branch.

:::{admonition} Example
`nixos-23.05` and `nixpkgs-23.05-darwin` are both based on `release-23.05`.
:::

### Rolling

- On Linux (including NixOS and WSL), use [`nixos-unstable`](https://github.com/NixOS/nixpkgs/branches/all?query=nixos-unstable).
- On any other platform, use [`nixpkgs-unstable`](https://github.com/NixOS/nixpkgs/branches/all?query=nixpkgs-unstable).

These branches follow `master`, the main development development branch.

[`*-small`](https://github.com/NixOS/nixpkgs/branches/all?query=-small) channel branches have passed a smaller test suite, which means they are more up-to-date with respect to their base branch but offer fewer stability guarantees.

Consult the [`nix-channel`](https://nixos.org/manual/nix/unstable/command-ref/nix-channel) entry in the Nix Reference Manual for more information on channels, and the [Nixpkgs contributing guide](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md#branch-conventions) on the Nixpkgs branching strategy.

## Are there any impurities left in sandboxed builds?

Yes. There is:

- CPU architecture—great effort being made to avoid compilation of native instructions in favour of hardcoded supported ones.
- System's current time/date.
- The filesystem used for building (see also [`TMPDIR`](https://nixos.org/manual/nix/stable/command-ref/env-common.html#env-TMPDIR)).
- Linux kernel parameters, such as:
  - [IPv6 capabilities](https://github.com/NixOS/nix/issues/5615).
  - binfmt interpreters, e.g., those configured with [`boot.binfmt.emulatedSystems`](https://search.nixos.org/options?show=boot.binfmt.emulatedSystems).
- Timing behaviour of the build system—parallel Make build does not get the correct inputs in some cases.
- Insertion of random values, e.g., from `/dev/random` or `/dev/urandom`.
- Differences between Nix versions. For instance, a new Nix version might introduce a new environment variable. A statement like `env > $out` is not promised by Nix to result in the same output, going into the future.
