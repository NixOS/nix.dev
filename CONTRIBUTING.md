# Contributing to nix.dev

nix.dev is a community effort to collect, create, and maintain world-class learning resources for Nix.

We strongly encourage everyone interested to contribute by asking informed questions or directly proposing changes.

Make a [pull request] if you want to introduce an incremental change.
Note our [considerations on licensing and attribution](#licensing-and-attribution).

Open an [issue] if you want to clarify something not evident from what is provided in this repository, or if you want to discuss a significant change before starting to work on it.

[issues]: https://github.com/NixOS/nix.dev/issues
[pull request]: https://github.com/NixOS/nix.dev/pulls

## What you can do

### You want to learn and use Nix?

This project would not be possible without you.
Try to use it as your primary resource, however incomplete it may appear.

We ask you to liberally open issues and document all problems and questions that arise.
Please also state your learning goals and the paths you have taken so far.

Sharing your first-hand experience is invaluable to better guide our efforts, and will immediately help improve these guides for yourself and everyone else.

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

## Guides

> Please read ["Contributing Documentation"](./source/documentation/contributing.md) first.

### Licensing and attribution

When opening pull requests with your own contributions, you agree to licensing your work under [CC-BY-SA 4.0].
Before merging your work, you have to sign the [contributor agreement](cla/README.md).

Having a single legal entity hold non-exclusive copyright avoids disputes and ensures the material can be put to use more effectively, e.g. by eventually publishing it as a book.
You will still be considered co-author, as recorded by version history.

When adding material by third parties, make sure it has a matching license that permits this.
In that case, unambiguously state source, authors, and license.
Also [add the original author as co-author] to the respective change, so we can track authorship through version history.

Notify the authors *before* using their work.

[CC-BY-SA 4.0]: https://creativecommons.org/licenses/by-sa/4.0/
[add the original author as co-author]: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors

## Notes

### GitHub heading anchors fails linkcheck

Due to a [Sphinx bug][linkcheck gh bug], linkcheck fails when it verifies the
existence of GitHub heading anchors on rendered Markdown documents.

Until the bug is resolved, add the `user-content-` prefix to GitHub links
containing heading anchors.

For example, instead of
`https://github.com/cachix/install-nix-action#user-content-how-can-i-run-nixos-tests`,
use
`https://github.com/cachix/install-nix-action#user-content-how-can-i-run-nixos-tests`. 
