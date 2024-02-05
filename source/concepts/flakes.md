(flakes-definition)=
# Flakes

What is usually referred to as "flakes" is:
- A policy for managing dependencies between {term}`Nix expressions<Nix expression>`.
- An [experimental feature] in Nix, implementing that policy and supporting functionality.

[experimental feature]: https://nix.dev/manual/nix/2.18/contributing/experimental-features.html

## What are flakes?

Technically, a [flake](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-flake.html#description) is a file system tree that contains a file named `flake.nix` in its root directory.

Flakes add the following behavior to Nix:

1. A `flake.nix` file enforces a [schema], where:
   - Other flakes are referenced as dependencies providing {term}`Nix language` code or other files.
   - The values produced by the {term}`Nix expression`s in `flake.nix` are structured according to pre-defined use cases.

   [schema]: https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-flake.html#flake-format

1. References to other flakes can be specified using a dedicated [URL-like syntax](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-flake.html#flake-references).
   A [flake registry] allows using symbolic identifiers for further brevity.
   References can be automatically locked to their current specific version and later updated programmatically.

   [flake registry]: https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-registry.html

1. A [new command line interface], implemented as a separate experimental feature, leverages flakes by accepting flake references in order to build, run, or deploy software defined as a flake.

   [new command line interface]: https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix.html

Nix handles flakes differently than regular {term}`Nix files <Nix file>` in the following ways:

- The `flake.nix` file is checked for schema validity.

  In particular, the metadata fields cannot be arbitrary Nix expressions.
  This is to prevent complex, possibly non-terminating computations while querying the metadata.

- The entire flake directory is copied to Nix store before evaluation.

  This allows for effective evaluation caching, which is relevant for large expressions such as Nixpkgs, but also requires copying the entire flake directory again on each change.

- No external variables, parameters, or impure language values are allowed.

  It means full reproducibility of a Nix expression, and, by extension, the resulting build instructions by default, but also prohibits parameterisation of results by consumers.

(flakes-controversy)=
## Why are flakes controversial?

[Flakes](flakes-definition) were inspired by [Shea Levy's NixCon 2018 talk](https://www.youtube.com/watch?v=DHOLjsyXPtM), formally proposed in [RFC 49](https://github.com/NixOS/rfcs/pull/49), and have been in development since 2019.
Nix introduced the implementation as its first [experimental feature] in 2021.

The subject is considered controversial among Nix users and developers in terms of design, implementation quality, and decision making process.
In particular:
- The RFC was closed without conclusion, and some fundamental issues are not yet resolved.
  For example:
  - The notion of a [global flake registry](https://github.com/NixOS/flake-registry) saw [substantial criticism](https://github.com/NixOS/rfcs/pull/49#issuecomment-635635333) that was never addressed.
    Additionally, local registry names in Nix expressions [introduce mutable system state](https://github.com/NixOS/nix/issues/7422) and are thus no improvement over [channels](https://nix.dev/manual/nix/2.18/command-ref/nix-channel) in that regard.
  - It is [impossible to parameterise flakes](https://github.com/NixOS/nix/issues/2861).
    This means that [flakes downgrade ease of use of the `system` parameter](https://github.com/NixOS/nix/issues/3843) of derivations, for producers and consumers.
  - the flakes proposal was criticised for [trying to solve too many problems at once](https://github.com/nixos/rfcs/pull/49#issuecomment-521998933) and [at the wrong abstraction layer](https://discourse.nixos.org/t/nixpkgs-cli-working-group-member-search/30517).
    Part of this is that [the new command line interface and flakes are closely tied to each other](https://discourse.nixos.org/t/2023-03-06-nix-team-meeting-minutes-38/26056#cli-stabilisation-announcement-draft-4).
- As [predicted by RFC reviewers](https://github.com/NixOS/rfcs/pull/49#issuecomment-588990425), the original implementation introduced [regressions](https://discourse.nixos.org/t/nix-2-4-and-what-s-next/16257) in the [Nix 2.4 release](https://nix.dev/manual/nix/2.18/release-notes/rl-2.4.html), breaking some stable functionality without a [major version](https://semver.org/) increment.
- Copying sources to the Nix store prior to evaluation adds a [significant performance penalty](https://github.com/NixOS/nix/issues/3121), especially for large repositories such as {term}`Nixpkgs`.
  Work to address this has been [in progress since May 2022](https://github.com/NixOS/nix/pull/6530), but risks introducing [its own set of issues](https://github.com/NixOS/nix/pull/6530#issuecomment-1850565931).
- New Nix users were and still are encouraged by various individuals to adopt flakes despite there being no stability guarantees and no timeline to conclude the experiment.

This led to a situation where the stable interface was only sparsely maintained for multiple years, and repeatedly suffered breakages due to ongoing development.
Meanwhile, the new interface was adopted widely enough for evolving its design without negatively affecting users to become very challenging.

As of the [2022](https://discourse.nixos.org/t/2022-nix-survey-results/18983) and [2023](https://discourse.nixos.org/t/nix-community-survey-2023-results/33124) surveys, more than half of the respondents, a third of which are relative beginners, rely on experimental features.
{term}`Nixpkgs` as a contrasting example, while featuring a `flake.nix` for compatibility, does not depend on Nix experimental features in its code base.

## Should I use flakes in my project?

You have to judge for yourself based on your needs.

[Flakes](flakes-definition) emphasize reproducible artifacts and convenience for their consumers, while classic Nix tools center around composable building blocks and customisation options for developers.
Both paradigms have their own set of unique concepts and support tooling that have to be learned, with varying ease of use, implementation quality, and support status.
At the moment, neither the stable nor the experimental interface is clearly superior to the other in all aspects.

Flakes and the `nix` command suite bring multiple improvements that are relevant for both software users and package authors:

- The new command-line interface, together with flakes, makes dealing with existing packages significantly more convenient in many cases.
- The constraints imposed on flakes strengthen reproducibility by default, and enable some performance improvements when interacting with a large Nix package repository like {term}`Nixpkgs`.
- Flake references allow for easier handling of version upgrades for existing packages or project dependencies.
- The [flake schema][schema] helps with composing Nix projects from multiple sources in an orderly fashion.

At the same time, flakes have [fundamental architectural issues](flakes-controversy) and a number of [problems with the implementation](https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Aflakes+sort%3Areactions-%2B1-desc), and there is no coordinated effort to resolve them systematically.
There are also still many [open design questions around the `nix` command line interface](https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Anew-cli+sort%3Areactions-%2B1-desc), some of which are currently being worked on.

While flakes reduce complexity in some regards, they also introduce some with additional mechanisms.
You will have to learn more about the system to fully understand how it works.

Other than that, and below the surface of the flake schema, Nix and the Nix language work exactly the same in both cases.
In principle, the same level of reproducibility can be achieved with or without flakes.
In particular, the process of adding software to {term}`Nixpkgs` or maintaining {term}`NixOS` modules and configurations is not affected by flakes at all.
There is also no evidence that flakes could help solving the scalability challenges of either.

Finally, there are downsides to relying on [experimental features][experimental feature] in general:

- Interfaces and behavior of experimental features could still be changed by Nix developers.
  This may require you to adapt your code at some point in the future, which will be more effort when it has grown in complexity.
  [Currently there is no concrete timeline for stabilising flakes.](https://discourse.nixos.org/t/stabilising-the-new-nix-command-line-interface/35531#how-does-this-relate-to-flakes-3)
  In contrast, stable features in Nix can be considered stable indefinitely.
- The [Nix maintainer team](https://nixos.org/community/teams/nix.html) focuses on fixing bugs and regressions in stable interfaces, supporting well-understood use cases, as well as improving the internal design and overall contributor experience in order to ease future development.
  Improvements to experimental features have low priority.
- The [Nix documentation team](https://nixos.org/community/teams/documentation.html) focuses on improving documentation and learning materials for stable features and common principles.
  When using flakes, you will have to rely more heavily on user-to-user support, third-party documentation, and the source code.

## Further reading

- [Flakes aren't real and cannot hurt you: a guide to using Nix flakes the non-flake way](https://jade.fyi/blog/flakes-arent-real/) (Jade Lovelace, January 2024)
- [Nix Flakes is an experiment that did too much at once...](https://samuel.dionne-riel.com/blog/2023/09/06/flakes-is-an-experiment-that-did-too-much-at-once.html) ([comments](https://discourse.nixos.org/t/nix-flakes-is-an-experiment-that-did-too-much-at-once/32707)) (Samuel Dionne-Riel, September 2023)
- [Experimental does not mean unstable](https://determinate.systems/posts/experimental-does-not-mean-unstable) ([comments](https://discourse.nixos.org/t/experimental-does-not-mean-unstable-detsyss-perspective-on-nix-flakes/32703)) (Graham Christensen, September 2023)
- [The Nix Hour: comparing flakes to traditional Nix](https://www.youtube.com/watch?v=atmoYyBAhF4) (Silvan Mosberger, November 2022)

