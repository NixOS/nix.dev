# How to get help

If you need assistance with one of your contributions, there are a few places you
can go for help.

For better efficiency and chances of success, you should try contacting individuals or
groups with more specific knowledge first:

- If your contribution is for a package in Nixpkgs, look for its maintainers in the
  [`maintainers`](https://nixos.org/manual/nixpkgs/stable/#var-meta-maintainers)
  attribute.
- Check out if any teams are responsible for the relevant subsystem:
  - On the [NixOS website](https://nixos.org/community/#governance-teams).
  - In the [list of Nixpkgs maintainer teams](https://github.com/NixOS/nixpkgs/blob/master/maintainers/team-list.nix).
  - In the `CODEOWNERS` files for [Nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/.github/CODEOWNERS) or
    [Nix](https://github.com/NixOS/nix/blob/master/.github/CODEOWNERS).
- Look at the [git log](https://www.git-scm.com/docs/git-log) for the files you need help
  with, and take note of the email addresses of people who committed.

Once you've found the people you're looking for, you can contact them via:

- GitHub

  [Mention the GitHub username](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#mentioning-people-and-teams) found in the [`maintainers-list.nix` file][maintainers-list] in issue or pull request descriptions, or comments.

- [Discourse](https://discourse.nixos.org)

  Try the GitHub username found in the [`maintainers-list.nix` file][maintainers-list] to mention or directly contact a specific user.
  Note that some people use a different username on Discourse.

- [Matrix]

  Use the Matrix handle found in the [`maintainers-list.nix` file][maintainers-list].
  If no Matrix handle is present for a specific maintainer, try searching for them using their GitHub username, as most people tend to use the same one across channels.

- Email

  Use email addresses found with `git log`.

If you haven't found any specific users or groups that could help you with your
contribution, you can resort to asking the community at large, using one of the following official
communication channels:

- A room related to your question in the [NixOS Matrix space][matrix].
- The [*Help* category](https://discourse.nixos.org/c/learn/9) on Discourse.
- The general [`#nix`](https://matrix.to/#/#nix:nixos.org) room on Matrix.

[matrix]: https://matrix.to/#/#community:nixos.org
[maintainers-list]: https://github.com/NixOS/nixpkgs/blob/master/maintainers/maintainer-list.nix
