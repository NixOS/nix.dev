# How to contribute

The Nix ecosystem is developed by many volunteers and a few paid developers, maintaining one of the largest open source software distributions in the world.
Keeping it working and up to date would not be possible without your support.

This guide shows how you can contribute to {term}`Nix`, {term}`Nixpkgs` or {term}`NixOS`.

## Getting started

[Join our community communication platforms](https://nixos.org/community) to get in contact with other users and developers.
Check out our [community teams](https://nixos.org/community/#governance-teams) if you're interested in a particular topic.

All the source code and documentation is on [GitHub](https://github.com/), and you need a GitHub account to propose changes.
Technical discussions happen in issue and pull request comments.

:::{tip}
If you are new to Nix, consider [contributing documentation](./documentation.md) first.

This is where we need the most help and where it is the easiest to begin.
:::

## Report an issue

We can only fix issues that we know of, so please report any issue you encounter.

Issues with {term}`Nix` (including the [Nix reference manual](https://nixos.org/manual/nix/stable)) are reported at <https://github.com/NixOS/nix/issues>.

Issues with {term}`Nixpkgs` or {term}`NixOS` (including packages, configuration modules, the [Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable), and the [NixOS manual](https://nixos.org/manual/nixos/stable)) are reported at <https://github.com/NixOS/nixpkgs/issues>.

Make sure that there is not already an open issue for your problem.
Please follow the issue template and fill in all requested information.

## Contribute to Nix

Nix is the cornerstone of the ecosystem, and is mostly written in C++.

If you want to contribute to its development, you can find information on [how to setup a development environment](https://nixos.org/manual/nix/unstable/contributing/hacking.html) in the manual.

[Issues tagged `good-first-issue`](https://github.com/NixOS/nix/issues?q=is%3Aopen+is%3Aissue+label%3Agood-first-issue) are a great opportunity for taking your first steps as a Nix contributor.

If you are proficient with C++, addressing one of the [popular issues](https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A%22idea+approved%22) will be highly appreciated by maintainers and Nix users all over the world.

## Contribute to Nixpkgs

Contributing to {term}`Nixpkgs` is simple when you have understood the basic concepts.

[The Nixpkgs manual quick start guide][https://nixos.org/manual/nixpkgs/stable/#chap-quick-start] explains step-by-step how to add new packages.
There are also [programming-language-specific instructions](https://nixos.org/manual/nixpkgs/stable/#chap-language-support).

You can find inspiration for things to improve in the [Nixpkgs issue tracker][nixpkgs issues].

[nixpkgs issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+-label%3A%226.topic%3A+nixos%22+-label%3A%226.topic%3A+module+system%22+-label%3A%226.+topic%3A+nixos-container%22+sort%3Areactions-%2B1-desc

## Contribute to NixOS

It’s pretty easy to contribute to NixOS compared to other Linux distributions.
All the code is on GitHub in the [`nixpkgs`] repository.
Everyone can propose an improvement and most of them get merged after a review by maintainers.
You will get feedback in the pull request.

See the [NixOS manual's development section](https://nixos.org/manual/nixos/stable/index.html#ch-development) to get started.

[Issues tagged with `good-first-bug`](https://github.com/NixOS/nixpkgs/labels/3.skill%3A%20good-first-bug) are a good resource for new contributos.
If you know your way around, working on [popular issues][nixos issues] will be highly appreciated by other NixOS users.

[`nixpkgs`]: https://github.com/NixOS/nixpkgs
[nixos issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+nixos%22+sort%3Areactions-%2B1-desc

