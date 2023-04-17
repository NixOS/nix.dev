# How to get help

If you need assistance with one of your contributions, there are a few places you
can go for help.

For better efficiency and chances of success, you should try to contact individuals or groups with more specific knowledge first:
- Look at the [git log](https://www.git-scm.com/docs/git-log) for the files you need help
  with, and take note of the email addresses of people who committed.
- Check out if any teams are responsible for the relevant subsystem:
  - On the [NixOS website](https://nixos.org/community/#governance-teams).
  - In the [team list
    file](https://github.com/NixOS/nixpkgs/blob/master/maintainers/team-list.nix).
  - In the [Nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/.github/CODEOWNERS) or
    [Nix](https://github.com/NixOS/nix/blob/master/.github/CODEOWNERS) `CODEOWNERS` files.
- If your contribution is for a nixpkgs package, look for its maintainers in the
  [`maintainers`](https://nixos.org/manual/nixpkgs/stable/#var-meta-maintainers)
  attribute.

Once you have found the people you're looking for (either their email address, or their
handles in [`maintainers-list.nix`][maintainers-list]), you can contact them via:

- Email.
- [Matrix], using the Matrix handle found in the [`maintainers-list.nix`
  file][maintainers-list]. If no Matrix handle is present for a specific maintainer, try
  searching for them using their GitHub username, as most people tend to use the same one
  across channels.
- [Discourse](https://discourse.nixos.org), again trying the GitHub username found in the
  [`maintainers-list.nix` file][maintainers-list] to search for a specific user.

If you haven't found any specific users or groups that could help you with your
contribution, you can resort to asking the community at large, using one of the following official
communication channels:

- A room related to your question in the [NixOS Matrix space][matrix].
- The *Help* category on the [Discourse Forum](https://discourse.nixos.org/c/learn/9).
- The general [`#nix`](https://matrix.to/#/#nix:nixos.org) room on Matrix.

[matrix]: https://matrix.to/#/#community:nixos.org
[maintainers-list]: https://github.com/NixOS/nixpkgs/blob/master/maintainers/maintainer-list.nix
