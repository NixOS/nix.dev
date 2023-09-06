# Contributing Documentation

This is an overview of documentation resources for Nix, Nixpkgs, and NixOS, with suggestions how you can help to improve them.
Documentation contributions should follow the [style guide](./style-guide.md).

Feel free to get in touch with the [Nix documentation team](https://nixos.org/community/teams/documentation) if you want to help out.

:::{attention}
If you cannot contribute time, consider [donating to the NixOS Foundation's documentation project on Open Collective](https://opencollective.com/nixos/projects/documentation-project) to fund ongoing maintenance and development of reference documentation and learning materials.
:::

## Documentation framework
We aim to build our documentation according to the [Diataxis][diataxis] framework, which divides documentation into four categories:

[diataxis]: https://diataxis.fr

- Reference
- How-to
- Explanation
- Tutorial

We've found that contributors struggle to understand the differences between these categories, and while we _strongly_ recommend reading up on the Diataxis framework, we can summarize them as follows:

- Reference
  - Reference material includes technical documentation, API documentation, etc.
  - Reference material should be relatively terse, simply listing which functions/classes/etc exist, but should still clearly define how to use the code and how it relates to the rest of the ecosystem.
  - Reference material should focus on "what's out there", with the text and layout optimized for scanning and random access.
  - Reference material should be supplemented with examples.
- Tutorial
  - Tutorials walk the user through a particular activity to teach them about common tools and patterns in the ecosystem.
  - While the activity itself is important, the goal is also to connect the dots between other things the reader has learned.
- How-to (we call these "Recipes")
  - Recipes are a list of steps showing how to achieve a specific goal or solve a specific problem.
  - The goal is to help the reader reach a specific end, not understand the theory or greater context.
  - A recipe assumes that the reader already has the background to understand the topic at hand and therefore doesn't need to explain the introduction of each new concept.
- Explanation (we call these "Concepts")
  - Concepts describe the internals of a piece of code or how to think about a particular idea or entity in the ecosystem.
  - A concept can also describe the historical context behind why something works the way that it does today.
  - If you find yourself wanting to write about the nitty gritty details of how something works, you most likely want to write an explanation.

### Recipe vs. tutorial
We find that contributors primarily struggle with the difference between a How-to/Recipe and a Tutorial.

Here are several explanations to help you understand the difference.

- A recipe is used in a "working" context where the reader just wants a sequence of instructions to achieve an outcome.
  - In this context the reader may already know or may not care how or why these instructions work, they just want to know what to do in order to achieve the desired result.
- A tutorial is used in a "learning" context where the reader is following a sequence of instructions to gain practice performing a certain task.
  - Some small bits of motivation or explanation are helpful in this context to help a reader connect the dots with other things they may have already learned, but the focus is not on _how_ or _why_.

A helpful analogy is landing an airplane in two different contexts.

Let's say the pilot is unconscious and you now have to land the plane to avoid a crash landing.
In this context you just want to know how not to die.
You don't care about how or why, you just want to be on the ground in one piece.
This is the context for a recipe.

A pilot training in a flight simulator wants to practice landing the plane.
The pilot-in-training needs practice knowing when to deploy the landing gear, when to adjust flaps, etc.
Actually landing the plane during the flight simulation is less important than learning the individual skills that make up a successful landing.
This is the context for a tutorial.

Finally, one last way of thinking about the difference between How-to/Recipe and Tutorial is like this:
- Recipe: "step 1: do this, step 2: do that, etc"
- Tutorial: "take my hand as I show you how to do this"

## Reference manuals

The manuals for [Nix][nix manual] ([source][nix manual src]), [Nixpkgs][Nixpkgs manual] ([source][nixpkgs manual src]), and [NixOS][NixOS manual] ([source][nixos manual src]) are purely reference documentation, specifying interfaces and behavior.

They also show example interactions which demonstrate how to use its components, and explain mechanisms where necessary.

The documentation team watches all pull requests to the manuals and assists contributors to get their changes merged.

You can help by

- picking up documentation-related issues on [Nix][nix docs issues], [Nixpkgs][nixpkgs docs issues], and [NixOS][nixos docs issues].

- reviewing documentation-related pull requests on [Nix][nix docs prs], [Nixpkgs][nixpkgs docs prs], and [NixOS][nixos docs prs].

- making pull requests which improves existing documentation, such as:

  - add links to definitions, commands, options, etc. where only the name is mentioned
  - correct obvious errors
  - clarify language
  - expanding on sections that appear incomplete
  - identifying sections that are not reference documentation and should be moved to nix.dev

[Nix manual]: https://nixos.org/manual/nix
[nix manual src]: https://github.com/NixOS/nix/tree/master/doc/manual
[Nixpkgs manual]: https://nixos.org/manual/nixpkgs
[nixpkgs manual src]: https://github.com/NixOS/nixpkgs/tree/master/doc
[NixOS manual]: https://nixos.org/manual/nixos
[nixos manual src]: https://github.com/NixOS/nixpkgs/tree/master/nixos/doc/manual

[nix docs issues]: https://github.com/NixOS/nix/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation
[nixpkgs docs issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+documentation%22+-label%3A%226.topic%3A+nixos%22
[nixos docs issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+documentation%22+label%3A%226.topic%3A+nixos%22+

[nix docs prs]: https://github.com/NixOS/nix/pulls?q=is%3Aopen+is%3Apr+label%3Adocumentation
[nixpkgs docs prs]: https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%226.topic%3A+documentation%22+-label%3A%226.topic%3A+nixos%22
[nixos docs prs]: https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%226.topic%3A+documentation%22+label%3A%226.topic%3A+nixos%22+

## nix.dev

The purpose of [nix.dev] ([source][nix.dev src]) is to guide newcomers by teaching essential Nix knowledge, show best practices, and help orient users in the Nix ecosystem.

It goes into breadth, not depth.

The documentation team maintains nix.dev as editors.

You can help by

- working on [open issues][nix.dev issues]
- reviewing [pull requests][nix.dev prs] by testing new material or features
- adding guides or tutorials following the [proposed outline](https://github.com/NixOS/nix.dev/blob/master/CONTRIBUTING.md#user-content-vision)

New articles can be based on videos such as:

- [The Nix Hour] recordings
- some of the ~100 [NixCon][nixcon yt] recordings
- [Nix video guides] by @jonringer.
- [Summer of Nix 2022 talks]

Since writing a guide or tutorial is a lot of work, please make sure to coordinate with nix.dev maintainers, for example by commenting on or opening an issue to make sure it will be worthwhile.

[nix.dev]: https://nix.dev
[nix.dev src]: https://github.com/nixos/nix.dev
[nix.dev issues]: https://github.com/nixos/nix.dev/issues
[nix.dev prs]: https://github.com/nixos/nix.dev/pulls

[The Nix Hour]: https://www.youtube.com/watch?v=wwV1204mCtE&list=PLyzwHTVJlRc8yjlx4VR4LU5A5O44og9in
[nixcon yt]: https://www.youtube.com/c/NixCon
[Nix video guides]: https://www.youtube.com/user/elitespartan117j27
[Summer of Nix 2022 talks]: https://www.youtube.com/playlist?list=PLt4-_lkyRrOMWyp5G-m_d1wtTcbBaOxZk

## nixos.org

The Nix project web site is [nixos.org] ([source][nixos website src]).

Website contents that concern learning Nix should reference or include material from nix.dev.

The [Nix marketing team] is responsible for the web site, and the documentation team assists with maintaining contents related to onboarding new users.

[nixos.org]: https://nixos.org
[nixos website src]: https://github.com/nixos/nixos-homepage
[Nix marketing team]: https://nixos.org/community/teams/marketing.html

## Communication channels

### Matrix

Use Matrix for casual communication.

The documentation team frequents the [Nix\* Documentation] room.

Old messages are extremely improbable to be read by anyone.

You can help by posting in the appropriate categories on [Discourse] what you have found valuable.

[Nix\* Documentation]: https://matrix.to/#/#docs:nixos.org
[Discourse]: https://discourse.nixos.org/

### Discourse

[Discourse] is the central community hub.

This is the place for your questions, suggestions, and discussion.

The documentation team monitors the [Documentation category].

Old threads and especially posts in long threads are improbable to be read by many people.

You can help by

- asking informed questions, showing what you have done so far
- answering other people's questions
- writing down what you have learned by updating or adding a [NixOS Wiki] article, nix.dev guide or tutorial, or one of the manuals
- encouraging and helping people to incorporate their insights in the official documentation

[Documentation category]: https://discourse.nixos.org/c/dev/documentation/25

### Meetings and Events

Check the [Discourse community calendar] for real-time events.

The documentation team holds regular meetings and posts meeting notes in the [Documentation category].

You can help by joining meetings to take notes or clean them up before publishing.

[Discourse community calendar]: https://discourse.nixos.org/t/community-calendar/18589

## External sources

The Internet is full of helpful resources concerning Nix.

You can help by sharing in the [Links category] on Discourse what you have found valuable.

[Links category]: https://discourse.nixos.org/c/links/12

### Wiki

[NixOS Wiki](https://nixos.wiki/) is a collection of interlinked guides to solve common problems which are otherwise not well-documented.

It is collectively edited by the community, covers a broad range of topics.
It is only loosely organized, and does not impose quality standards.
Its purpose is to quickly and conveniently collect insights and make them readily available for everyone.

We recommend to use it as a dumping ground for more obscure Nix knowledge, and strive to make it *smaller* over time (see [NixCon 2015: Make Nix friendlier for Beginners]), by incrementally incorporating its contents into authoritative documentation and curated learning material.

The documentation team **does not maintain** the Wiki.

You can still help with

- improving discoverability by adding categorization and relevant links
- clarifying articles and correcting errors
- removing redundant information that is already present in curated sources
- migrating information to other resources.

Where to migrate what:

- Nix interaction: [Nix manual]
- Language-specific build instructions: [Nixpkgs manual]
- Package, service, or hardware configuration: [NixOS manual]
- Overviews, tutorials, guides, best practices: [nix.dev]

[NixOS Wiki]: https://nixos.wiki/
[NixCon 2015: Make Nix friendlier for Beginners]: https://media.ccc.de/v/nixcon2015-3-MakeNixfriendlierforBeginners#video

### Nix Pills

[Nix Pills](https://nixos.org/guides/nix-pills/) is a series of low-level tutorials on building software packages with Nix, showing in detail how Nixpkgs is made from first principles.
Work is currently being done to bring the Nix Pills up-to-date with the current state of Nix and current best-practices of Nixpkgs.
Furthermore, work is underway to migrate the technical infrastructure of Nix Pills to improve maintainability and make it easier for others to contribute.

You can help by

- opening [issues](https://github.com/NixOS/nix-pills/issues) for any errors or outdated information you find
- addressing [good first issues](https://github.com/NixOS/nix-pills/labels/good-first-issue) by opening [pull requests](https://github.com/NixOS/nix-pills/pulls)
- Test code examples to ensure correctness and completeness.
- Add links to reference documentation where needed.

## Licensing and attribution

When opening pull requests with your own contributions, you agree to licensing your work under [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

When adding material by third parties, make sure it has a license that permits this.
In that case, unambiguously state source, authors, and license in the newly added material.
Notify the authors *before* using their work.

[Add the original author as co-author](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors) to the first commit of your pull request, which should contain the original document verbatim, so we can track authorship and changes through version history.

Using free licenses other than CC-BY-SA 4.0 is possible for individual documents, and by contributing changes to those documents you agree to license your work accordingly.
