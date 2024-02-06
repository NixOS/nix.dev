# Contributing to nix.dev

nix.dev is a community effort to collect, create, and maintain world-class learning resources for Nix.

We strongly encourage everyone interested to contribute by asking informed questions or directly proposing changes.

Make a [pull request](https://github.com/NixOS/nix.dev/pulls) if you want to introduce an incremental change.
Note our [considerations on licensing and attribution](#licensing-and-attribution).

Open an [issue](https://github.com/NixOS/nix.dev/issues) if you want to clarify something not evident from what is provided in this repository, or if you want to discuss a significant change before starting to work on it.

## Code of conduct

Adapted from the [Contributor Covenant] and [The Carpentries Code of Conduct]:

- Use welcoming and inclusive language
- Show empathy and respect towards other people
- Be respectful of different viewpoints and experiences
- Give and gracefully accept constructive criticism
- Focus on what is best for the community

[Contributor Covenant]: https://github.com/EthicalSource/contributor_covenant/blob/cd7fcf684249786b7f7d47ba49c23a6bcb3233eb/content/version/2/1/code_of_conduct.md
[The Carpentries Code of Conduct]: https://github.com/carpentries/docs.carpentries.org/blob/4691971d9f49544054410334140a4fd391a738da/topic_folders/policies/code-of-conduct.md

## Updating reference manuals

With the current setup, the Nix manual hosted on nix.dev does not get updated automatically with new releases.
The following manual steps are required:

- Regularly update the inputs to use the latest versions of the Nix release branches with `nix shell --run "niv update"`

  To avoid long build times, make sure Nix can be fetched from the cache.
  If it doesn't, find the latest commit that is [built by Hydra](https://hydra.nixos.org/project/nix). For example, to update the latest Nix release to 2.20:

  ```bash
  niv update nix-stable -b 2.20-maintenance -r 7599d4bbed3c188c72b547fc08c7b022e7d1c54f
  ```

- On each new Nix release, update the `nix-latest` to the corresponding release branch:

  ```bash
  niv update nix-latest -b 2.20-maintenance
  ```

- On each new Nixpkgs release, update `nixpkgs-stable` and `nixpkgs-prev-stable` and the corresponding Nix versions:

  ```bash
  niv update nixpkgs-stable -b nixos-24.05
  niv update nix-stable -b 2.19-maintenance
  niv update nixpkgs-prev-stable -b nixos-23.11
  niv update nix-prev-stable -b 2.18-maintenance
  ```

It would be nice to have *efficient* automatic updates.

## Contributor guides

Please read [Contributing Documentation](https://nix.dev/contributing/documentation).
