# How to get help

If you need assistance with one of your contributions, there are a few places you
can go for help.

## How to find maintainers

For better efficiency and higher chance of success, you should try contacting individuals or groups with more specific knowledge first:

- If your contribution is for a package in Nixpkgs, look for its maintainers in the
  [`maintainers`](https://nixos.org/manual/nixpkgs/stable/#var-meta-maintainers)
  attribute.
- Check if any teams are responsible for the relevant subsystem:
  - On the [NixOS website](https://nixos.org/community/#governance-teams).
  - In the [list of Nixpkgs maintainer teams](https://github.com/NixOS/nixpkgs/blob/master/maintainers/team-list.nix).
  - In the `CODEOWNERS` files for [Nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/.github/CODEOWNERS) or
    [Nix](https://github.com/NixOS/nix/blob/master/.github/CODEOWNERS).
- Check the output of [`git blame`](https://git-scm.com/docs/git-blame) or [`git log`](https://www.git-scm.com/docs/git-log) for the files you need help with.
  Take note of the email addresses of people who committed relevant code.

## Which communication channels to use

Once you've found the people you're looking for, you can contact them on one of the following platforms:

- GitHub

  All the source code is maintained on GitHub.
  This is the right place to discuss implementation details.

  In issue comments or pull request descriptions, [mention the GitHub username](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#mentioning-people-and-teams) found in the [`maintainers-list.nix` file][maintainers-list].

- [Discourse](https://discourse.nixos.org)

  Discourse is used for announcements, coordination, and open-ended questions.

  Try the GitHub username found in the [`maintainers-list.nix` file][maintainers-list] to mention or directly contact a specific user.
  Note that some people use a different username on Discourse.

- [Matrix]

  Matrix is used for direct messages and short-lived, timely exchanges.

  To contact a maintainer, use their Matrix handle found in the [`maintainers-list.nix` file][maintainers-list].
  If no Matrix handle is present for a specific maintainer, try searching for their GitHub username, as most people tend to use the same one across channels.

  Maintainer teams sometimes have their own public Matrix room.

- Email

  Use email addresses found with `git log`.

## Other venues

If you haven't found any specific users or groups that could help you with your
contribution, you can resort to asking the community at large, using one of the following official
communication channels:

- A room related to your question in the [NixOS Matrix space][matrix].
- The [*Help* category](https://discourse.nixos.org/c/learn/9) on Discourse.
- The general [`#nix`](https://matrix.to/#/#nix:nixos.org) room on Matrix.

[matrix]: https://matrix.to/#/#community:nixos.org
[maintainers-list]: https://github.com/NixOS/nixpkgs/blob/master/maintainers/maintainer-list.nix
