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
  If it doesn't, find the latest commit that is [built by Hydra](https://hydra.nixos.org/project/nix). For example, to pin Nix 2.18:

  ```bash
  niv update nix_2-18 -r f5f4de6a550327b4b1a06123c2e450f1b92c73b6
  ```

- On each new Nix release:

  1. Add the latest version in [`default.nix`](./default.nix).
     For example, to add Nix 2.19:

     ```bash
     niv add nixos/nix -n nix_2-19 -b 2.19-maintenance
     ```

  2. Reference the latest version in [`source/reference/nix-manual.md`](./source/reference/nix-manual.md).

- If an unstable or stable release of Nixpkgs adopt a new version of Nix, update the corresponding references here.

  Also update URLs to the the Nix manual to the version used by Nixpkgs unstable.
  For example, if one wants to move from 2.18 to 2.19:
  ```bash
  sed -i 's#https://nix.dev/manual/nix/2.18/#https://nix.dev/manual/nix/2.19/#g' $(ls **/*.md)
  ```

## What you can do

### You want to learn and use Nix?

This project would not be possible without you.
Try to use it as your primary resource, however incomplete it may appear.

We ask you to liberally open issues and document all problems and questions that arise.
Please also state your learning goals and the paths you have taken so far.

Sharing your first-hand experience is invaluable to better guide our efforts, and will immediately help improve these guides for yourself and everyone else.

### You are a beginner and want to get involved in improving documentation

The documentation team is currently carrying out a documentation survey. As we work through this project, updates are made to this [Documentation Survey](./maintainers/working_groups/learning_journey/documentation-survey.md) markdown page.
Its purpose is to provide overview of the types, topics, and volume of existing documentation resources and inform future work.

We would love for you to get involved.
Here is how you can help:

1. Familiarize yourself with the format described at the top of the Documentation Survey page.
2. Contribute by making pull requests. Your change should add details to one individual link (bullet point) following the specified format.
3. Ensure consistency with existing entries. Your contributions should align with the style and format of previously added bullet points.
4. When dealing with a larger resource like the [Nixpkgs manual](https://nixos.org/manual/nixpkgs), start by creating a pull request with a structured outline. Then fill in the details section-by-section, submitting separate pull requests for each section.

### You have experience teaching Nix?

You will probably have observed where learners get stuck most often, and which typical needs and questions they have.
You may have your own written notes for classes, trainings, or presentations.

Please share your experience and help us inform the structure and detailed contents the guides.
It would be great if you could contribute examples, wordings, or illustrations that proved helpful to your students.

### You are a domain expert using Nix?

If you are proficient in applying Nix to a domain-specific problem, and want to share your expertise on best practices, please check the table of contents.
Does existing material on your subject meet your standards?
How could we improve it?
Is there a popular application of Nix' capabilities not yet covered?
We would be glad to incorporate your insights.

## Contributor guides

Please read [Contributing Documentation](https://nix.dev/contributing/documentation).
