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

## Contribute to Nix

The package manager Nix is mostly written in C++. If you are a developer
and want to contribute to its development, you can find information on
[how to setup a development environment] in the manual.

You can find inspiration for things to improve in the [reported
issues][nix issues].

Feel free to [join our community] to get in
contact with other developers.

## Contribute to Nix packages

Packaging for Nix is simple when you have understood the basic concept.

[The manual] explains step-by-step how to add new packages to the Nix
package collection. There are also [programming language specific
instructions][programming language specific instructions].

You can find inspiration for things to improve in the [reported issues][nixpkgs issues].

## Contribute to NixOS

It’s pretty easy to contribute to NixOS compared to other linux
distributions. All the code is on GitHub in the repository [nixpkgs].
Everyone can propose an improvement and most of them get merged after a
review of the maintainers. You will get feedback in the pull request.

See the [NixOS manual] to get started and find all the details.

You can find inspiration for things to improve in the [reported
issues][nixos issues]. There are also
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
[the manual]: https://nixos.org/manual/nix/stable/quick-start.html
[nix issues]: https://github.com/NixOS/nix/issues
[nixos issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+nixos%22
[nixpkgs issues]: https://github.com/NixOS/nixpkgs/issues?page=3&q=is%3Aissue+is%3Aopen+label%3A%228.has%3A+package+%28update%29%22%2C%228.has%3A+package+%28new%29%22%2C%229.needs%3A+package+%28update%29%22%2C%229.needs%3A+package+%28new%29%22%2C%220.kind%3A+packaging+request%22%2C%220.kind%3A+build+failure%22
