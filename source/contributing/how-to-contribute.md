(how-to-contribute)=
# How to contribute

The Nix ecosystem is developed by many volunteers and a few paid developers, maintaining one of the largest open source software distributions in the world.
Keeping it working and up to date – and improving it continuously – would not be possible without your support.

This guide shows how you can contribute to {term}`Nix`, {term}`Nixpkgs` or {term}`NixOS`.

## Getting started

Start with asking informed questions, after reading reference documentation and the code relevant to what you care about.

[Join our community communication platforms](https://nixos.org/community) to get in contact with other users and developers.
Check out and consider particpating in our [community teams](https://nixos.org/community/#governance-teams) if you're interested in a particular topic.

All the source code and documentation is on [GitHub](https://github.com/NixOS), and you need a GitHub account to propose changes.
Technical discussions happen in issue and pull request comments.

:::{tip}
If you are new to Nix, consider [contributing documentation](./documentation/index.md) first.

This is where we need the most help and where it is the easiest to begin.
:::

Documentation and contribution guides are often incomplete or outdated, much as we would like them to be otherwise.
We're working on it.
You can help and improve the situation for everyone by immediately solving problems with the contribution workflow as you encounter them.
While this may slow you down with addressing your original concern, it will make it a lot easier for anyone to make meaningful contributions in the future, and lead to better code and documentation in the long run.

:::{attention}
If you cannot contribute time, consider [donating to the NixOS Foundation on Open Collective](https://opencollective.com/nixos).

Currently the focus is on funding in-person events to share knowledge and grow the community of developers proficient with Nix.
With enough budget, it would be possible to pay for ongoing maintenance and development of critical infrastructure and code – demanding work that we cannot expect to be done by volunteers indefinitely.
:::

## Report an issue

We can only fix issues that we know of, so please report any issue you encounter.

- Issues with {term}`Nix` (including the [Nix reference manual](https://nixos.org/manual/nix/stable)) are reported at <https://github.com/NixOS/nix/issues>.

- Issues with {term}`Nixpkgs` or {term}`NixOS` (including packages, configuration modules, the [Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable), and the [NixOS manual](https://nixos.org/manual/nixos/stable)) are reported at <https://github.com/NixOS/nixpkgs/issues>.

Make sure that there is not already an open issue for your problem.
Please follow the issue template and fill in all requested information.

Take particular care to provide a minimal, easy-to-understand example to reproduce the problem you are facing.
You should also show what you have found in attempts to solve the problem yourself.
This makes it much more likely for the issue to be resolved eventually, and is important for multiple reasons:

- A reproducible sample is concise and unambiguous.

  This helps with triaging issues, understanding the problem, finding the root cause, and developing a solution.
  Preliminary research further helps with analysis.

- It allows anyone to determine if the issue is still relevant.

  Issues can remain unaddressed for a long time.
  Deciding what to do with them, even after months or years have passed, requires checking if the underlying problem persists or was resolved.
  This has to be easy to do: then anyone can help out with triaging, and notify maintainers to close or re-prioritise issues.

- The sample can be used for a regression test when solving the problem.

Ideally you would also propose or sketch a solution.
The perfect issue is, in fact, a pull request that solves the problem directly and ensures with tests that it cannot occur again.

:::{note}
Please use our [community communication platforms](https://nixos.org/community) for asking questions about the code or how to do things.
Open GitHub issues to state problems and propose solutions, and close them when the problem is resolved or invalidated.
:::

Please open issues to request new features (such as packages, modules, commands, ...) only if your are willing and able to implement them yourself.
Then the issue can be used to gauge user interest, to determine if the feature fits into the project, and to discuss implementation strategies.

## Contribute to Nix

{term}`Nix` is the cornerstone of the ecosystem, and is mostly written in C++.

If you want to help with development, check the [contributing guide in the Nix repository on GitHub](https://github.com/NixOS/nix/blob/master/CONTRIBUTING.md).

(contribute-nixpkgs)=
## Contribute to Nixpkgs

{term}`Nixpkgs` is a large software project with various areas of development.
You can find inspiration for things to improve in the [Nixpkgs issue tracker][nixpkgs issues].

[nixpkgs issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+-label%3A%226.topic%3A+nixos%22+-label%3A%226.topic%3A+module+system%22+-label%3A%226.+topic%3A+nixos-container%22+sort%3Areactions-%2B1-desc

If you want to help, start with the [contributing guide in the Nixpkgs repository on GitHub](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md) to get an overview of the code and the contribution process.
There are also [programming-language-specific instructions](https://nixos.org/manual/nixpkgs/unstable/#chap-language-support) for adding packages.

## Contribute to NixOS

{term}`NixOS` is a collectively developed Linux distribution that can be configured conveniently in a highly flexible way through declarative programming interfaces.
The code for modules and default configurations is in the [`nixos` directory of the `nixpkgs` GitHub repository](https://github.com/NixOS/nixpkgs/tree/master/nixos).

See the [NixOS manual's development section](https://nixos.org/manual/nixos/stable/index.html#ch-development) to get started with making improvements.
Contributor documentation specific to NixOS is still lacking, but most conventions for [Nixpkgs contributions](contribute-nixpkgs) apply.
Help with improving that is greatly appreciated.

Check [issues labeled `good-first-bug`](https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+label%3A%223.skill%3A+good-first-bug%22+label%3A%226.topic%3A+nixos%22) if you're a new contributor.
If you know your way around, working on [popular issues][nixos issues] will be highly appreciated by other NixOS users.

[nixos issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+nixos%22+sort%3Areactions-%2B1-desc

