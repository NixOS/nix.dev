# How to Contribute

This guide explains how you can contribute to Nix, Nix packages or
NixOS.

## Report an issue

We can only fix issues that we know of, so please report any issue you
encounter.

Issues with the **package manager Nix** (including it's documentation)
are reported at <https://github.com/NixOS/nix/issues>.

Issues with **specific packages or NixOS** (including it's modules and
documentation) are reported at <https://github.com/NixOS/nixpkgs/issues>.

Make sure that there is not already an open issue for your problem.
Please follow the issue template and fill in all requested information
as they help us solve the problem.

You need a [GitHub] account for that.

## Contribute to Nix

The package manager Nix is mostly written in C++. If you are a developer
and want to contribute to it's development, you can find information on
[how to setup a development environment] in the manual.

You can find inspiration for things to improve in the [reported
issues][reported issues].

Feel free to [join our community] to get in
contact with other developers.

## Contribute to Nix packages

Packaging for Nix is simple when you have understood the basic concept.

[The manual] explains step-by-step how to add new packages to the Nix
package collection. There are also [programming language specific
instructions][programming language specific instructions].

## Contribute to NixOS

It’s pretty easy to contribute to NixOS compared to other linux
distributions. All the code is on GitHub in the repository [nixpkgs].
Everyone can propose an improvement and most of them get merged after a
review of the maintainers. You will get feedback in the pull request.

See the [NixOS manual] to get started and find all the details.

You can find inspiration for things to improve in the [reported
issues](https://github.com/NixOS/nixpkgs/issues). There are also
[issues tagged with good-first-bug] that are a good start for new
contributors.

Feel free to [join our community] of developers!

[github]: https://github.com/
[how to setup a development environment]: https://nixos.org/manual/nix/stable/contributing/hacking.html
[issues tagged with good-first-bug]: https://github.com/NixOS/nixpkgs/labels/3.skill%3A%20good-first-bug
[join our community]: https://github.com/NixOS/nixpkgs#community
[nixos manual]: https://nixos.org/manual/nixos/stable/index.html#ch-development
[nixpkgs]: https://github.com/NixOS/nixpkgs
[programming language specific instructions]: https://nixos.org/manual/nixpkgs/stable/#chap-language-support
[reported issues]: https://github.com/NixOS/nix/issues
[the manual]: https://nixos.org/manual/nix/stable/quick-start.html
