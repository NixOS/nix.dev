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

```shell-session
nix-shell --run update-nixpkgs-releases
nix-shell --run update-nix-releases
```

## Contributor guides

Please read [Contributing Documentation](https://nix.dev/contributing/documentation).
