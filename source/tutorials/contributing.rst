How to Contribute
=================

This guide explains how you can contribute to Nix, Nix packages or
NixOS.

Report an issue
---------------

We can only fix issues that we know of, so please report any issue you
encounter.

Issues with the **package manager Nix** (including it's documentation)
are reported at https://github.com/NixOS/nix/issues.

Issues with **specific packages or NixOS** (including it's modules and
documentation) are reported at https://github.com/NixOS/nixpkgs/issues.

Make sure that there is not already an open issue for your problem.
Please follow the issue template and fill in all requested information
as they help us solve the problem.

You need a `GitHub`_ account for that.

Contribute to Nix
-----------------

The package manager Nix is mostly written in C++. If you are a developer
and want to contribute to it's development, you can find information on
`how to setup a development environment`_ in the manual.

You can find inspiration for things to improve in the `reported
issues`_. There are also some `issues tagged with easy`_ that are a good
start for new contributors.

Feel free to join the `#nixos-dev IRC channel`_ on `Freenode`_ to get in
contact with other developers.

Contribute to Nix packages
--------------------------

Packaging for Nix is simple when you have understood the basic concept.

`The manual`_ explains step-by-step how to add new packages to the Nix
package collection. There are also `programming language specific
instructions`_.

Contribute to NixOS
-------------------

It’s pretty easy to contribute to NixOS compared to other linux
distributions. All the code is on GitHub in the repository `nixpkgs`_.
Everyone can propose an improvement and most of them get merged after a
review of the maintainers. You will get feedback in the pull request.

See the `NixOS manual`_ to get started and find all the details.

You can find inspiration for things to improve in the `reported
issues <https://github.com/NixOS/nixpkgs/issues>`__. There are also
`issues tagged with good-first-bug`_ that are a good start for new
contributors.

Feel free to join the `#nixos-dev IRC channel`_ on Freenode.

.. _GitHub: https://github.com/
.. _how to setup a development environment: https://nixos.org/nix/manual/#chap-hacking
.. _reported issues: https://github.com/NixOS/nix/issues
.. _issues tagged with easy: https://github.com/NixOS/nix/labels/easy
.. _#nixos-dev IRC channel: irc://irc.freenode.net/nixos
.. _Freenode: https://freenode.net/
.. _The manual: https://nixos.org/nixpkgs/manual/#chap-quick-start
.. _programming language specific instructions: https://nixos.org/nixpkgs/manual/#chap-language-support
.. _nixpkgs: https://github.com/NixOS/nixpkgs
.. _NixOS manual: https://nixos.org/nixos/manual/index.html#ch-development
.. _issues tagged with good-first-bug: https://github.com/NixOS/nixpkgs/labels/3.skill%3A%20good-first-bug
