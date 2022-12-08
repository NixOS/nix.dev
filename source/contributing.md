# How to Contribute

This guide explains how you can contribute to Nix, Nix packages or
NixOS.

## Report an issue

We can only fix issues that we know of, so please report any issue you
encounter.

Issues with the **package manager Nix** (including its documentation)
are reported at <https://github.com/NixOS/nix/issues>.

Issues with **specific packages or NixOS** (including its modules and
documentation) are reported at <https://github.com/NixOS/nixpkgs/issues>.

Make sure that there is not already an open issue for your problem.
Please follow the issue template and fill in all requested information
as they help us solve the problem.

You need a [GitHub] account for that.

[github]: https://github.com/

## Contribute to documentation

Documentation on the Nix ecosystem is divided into several domains based on purpose.

The manuals for [Nix][nix manual], [Nixpkgs][nixpkgs manual], and [NixOS][nixos manual] 
are reference documentation, specifying interfaces and behavior.

[nix.dev] is a curated repository of guides and tutorials aimed
to teach beginners essential Nix knowledge, show best practices, and help orient
users in the Nix ecosystem.

[Guidelines for contributing to documentation] are available in the nix.dev repository.

A [detailed overview of the entire Nix documentation ecosystem] is available
in the Nix documentation team repository.

[nix manual]: https://nixos.org/manual/nix/stable/quick-start.html
[nixpkgs manual]: https://nixos.org/manual/nixpkgs/stable
[nixos manual]: https://nixos.org/manual/nixos/stable
[nix.dev]: https://nix.dev
[Guidelines for contributing to documentation]: https://github.com/NixOS/nix.dev/blob/master/CONTRIBUTING.md#user-content-guidelines
[detailed overview of the entire Nix documentation ecosystem]: https://github.com/NixOS/nix.dev/blob/master/maintainers/how-to-contribute-to-documentation.md

## Contribute to Nix

The package manager Nix is mostly written in C++.

If you want to contribute to its development, you can find
information on [how to setup a development environment] in the manual.

You can find inspiration for things to improve on the [issue tracker][nix issues].

Feel free to [join our community] to get in
contact with other developers.

[how to setup a development environment]: https://nixos.org/manual/nix/unstable/contributing/hacking.html
[nix issues]: https://github.com/NixOS/nix/issues
[join our community]: https://nixos.org/community

## Contribute to Nixpkgs

Packaging for Nix is simple when you have understood the basic concept.

[The Nixpkgs manual][nixpkgs quick-start] explains step-by-step how to add new packages to
the Nix package collection. There are also [programming language specific instructions].

You can find inspiration for things to improve in the [reported issues][nixpkgs issues].

[nixpkgs quick-start]: https://nixos.org/manual/nixpkgs/stable/#chap-quick-start 
[programming language specific instructions]: https://nixos.org/manual/nixpkgs/stable/#chap-language-support
[nixpkgs issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+-label%3A%226.topic%3A+nixos%22+-label%3A%226.topic%3A+module+system%22+-label%3A%226.+topic%3A+nixos-container%22

## Contribute to NixOS

It’s pretty easy to contribute to NixOS compared to other linux
distributions. All the code is on GitHub in the repository [nixpkgs].
Everyone can propose an improvement and most of them get merged after a
review of the maintainers. You will get feedback in the pull request.

See the [NixOS manual][nixos manual dev] to get started and find all the details.

You can find inspiration for things to improve in the [reported issues][nixos issues].

There are also [issues tagged with good-first-bug] that are a good start for new
contributors.

Feel free to [join our community] of developers!

[nixpkgs]: https://github.com/NixOS/nixpkgs
[nixos manual dev]: https://nixos.org/manual/nixos/stable/index.html#ch-development
[nixos issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+nixos%22
[issues tagged with good-first-bug]: https://github.com/NixOS/nixpkgs/labels/3.skill%3A%20good-first-bug
