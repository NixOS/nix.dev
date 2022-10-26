# Contributing to nix.dev

nix.dev is a community effort to collect, create, and maintain world-class learning resources for Nix.

We strongly encourage everyone interested to contribute by asking informed questions or directly proposing changes.

Make a [pull request] if you want to introduce an incremental change.
Note our [considerations on licensing and attribution](#licensing-and-attribution).

Open an [issue] if you want to clarify something not evident from what is provided in this repository, or if you want to discuss a significant change before starting to work on it.

[issues]: https://github.com/NixOS/nix.dev/issues
[pull request]: https://github.com/NixOS/nix.dev/pulls

## You want to learn and use Nix?

This project would not be possible without you.
Try to use it as your primary resource, however incomplete it may appear.

We ask you to liberally open issues and document all problems and questions that arise.
Please also state your learning goals and the paths you have taken so far.

Sharing your first-hand experience is invaluable to better guide our efforts, and will immediately help improve these guides for yourself and everyone else.

## You have experience teaching Nix?

You will probably have observed where learners get stuck most often, and which typical needs and questions they have.
You may have your own written notes for classes, trainings, or presentations.

Please share your experience and help us inform the structure and detailed contents the guides.
It would be great if you could contribute examples, wordings, or illustrations that proved helpful to your students.

## You are a domain expert using Nix?

If you are proficient in applying Nix to a domain-specific problem, and want to share your expertise on best practices, please check the table of contents.
Does existing material on your subject meet your standards?
How could we improve it?
Is there a popular application of Nix' capabilities not yet covered?
We would be glad to incorporate your insights.

# Guidelines

Here are values and practical guidelines to go by when contributing.

## Values

### Be kind

Adapted from [Contributor Covenant] and [The Carpentries Code of Conduct]:

- Use welcoming and inclusive language
- Show empathy and respect towards other people
- Be respectful of different viewpoints and experiences
- Give and gracefully accept constructive criticism
- Focus on what is best for the community

[Contributor Covenant]: https://github.com/EthicalSource/contributor_covenant/blob/cd7fcf684249786b7f7d47ba49c23a6bcb3233eb/content/version/2/1/code_of_conduct.md?plain=1#L25-L31
[The Carpentries Code of Conduct]: https://github.com/carpentries/docs.carpentries.org/blob/4691971d9f49544054410334140a4fd391a738da/topic_folders/policies/code-of-conduct.md?plain=1#L15-L19

### Be truthful

The only thing more confusing than no documentation is misleading documentation.

#### Use and provide evidence

The guides should enable readers to answer all their questions on their own.

Provide [links](#links) to the [Nix manual] or other resources, if it would help guide readers on their learning journey.
It is explicitly within scope of this project, and encouraged by Nix maintainers, to update or restructure the [Nix manual source code] where appropriate, to improve the overall experience.

Similarly, the other information in this repository should enable contributors to answer most of their questions and correct obvious errors on their own, and only then resort to opening issues.

Errors get more obvious if we can measure execution against intent.
Therefore we ask you to always make explicit the motivation behind your proposed changes.

Add references to any relevant resources in commit messages, if it helps understand the reasoning behind a significant change.

[Nix Manual]: https://nixos.org/manual/nix/stable/
[Nix manual source code]: https://github.com/NixOS/nix/tree/master/doc/manual

#### Ensure working code samples

Code samples must always be working correctly when run as instructed.
Nix provides us with everything needed to make this happen.

### Be concise

> I would have written a shorter letter, but I did not have the time.
>
> — [Blaise Pascal][Blaise Pascal]

Readers' time and attention is limited.
Take the time to be extraordinarily respectful with their cognitive resources.

You can use diagrams or illustrations to support written descriptions.
[GitHub allows creating Mermaid diagrams within Markdown.]

The same holds for communication directed to contributors and maintainers:
This is a public project, and many people will read what you write.
Use this leverage with care.

[Blaise Pascal]: https://en.m.wikiquote.org/w/index.php?title=Blaise_Pascal&oldid=2978584#Quotes
[GitHub allows creating Mermaid diagrams within Markdown.]: https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/

## Guides

### Writing style

Follow the evidence-based [plain language guidelines].

In addition:

Describe the subject factually.
Use imperative in direct instructions.

Clarity and brevity outweighs emotional appeal.
Do not presuppose a personal relationship with readers.

Address the reader with "you" when necessary.
Clarify identity if you use "we".
Generally, "we" are the Nix community and, more specifically, nix.dev authors.

Use culturally neutral language:

- Avoid idioms.

  Idioms can be hard to understand for non-native English speakers.

- Don't try to be funny.

  Humour is highly culturally sensitive.
  At best, jokes may obfuscate the relevant instructions.
  At worst, jokes may offend readers and invalidate our effort to help them learn.

- Don't use references to popular culture.

  What you may consider well-known may be entirely obscure and distracting to people from different backgrounds.

- Use consistent spelling.

  Different cultures spell certain words differently.
  The choice of spelling is arbitrary, so we have chosen one that is the most widespread and culturally inclusive.
  The development shell provides the `spellcheck` utility to check the spelling in all the content files.

[plain language guidelines]: https://www.plainlanguage.gov/guidelines/

### Licensing and attribution

When opening pull requests with your own contributions, you agree to licensing your work under [CC-BY-SA 4.0].
Before merging your work, you have to sign the [contributor agreement](cla/README.md).

Having a single legal entity hold non-exclusive copyright avoids disputes and ensures the material can be put to use more effectively, e.g. by eventually publishing it as a book.
You will still be considered co-author, as recorded by version history.

When adding material by third parties, make sure it has a matching license that permits this.
In that case, [unambiguously](#links) state source, authors, and license.
Also [add the original author as co-author] to the respective change, so we can track authorship through version history.

Notify the authors *before* using their work.

[CC-BY-SA 4.0]: https://creativecommons.org/licenses/by-sa/4.0/
[add the original author as co-author]: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors

### Links

Unless explicitly required to point to the latest version of an external resource, all references should be [permanent links].

Many web services offer permalinks.
Examples:
- [GitHub URLs to specific commits]
- [Wikipedia URLs to specific page versions]
- [Internet Archive "Save Page Now" for persisting web pages]

[permanent links]: https://en.m.wikipedia.org/wiki/Permalink
[GitHub URLs to specific commits]: https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files
[Wikipedia URLs to specific page versions]: https://en.m.wikipedia.org/wiki/Wikipedia:Linking_to_Wikipedia#Permanent_links_to_old_versions_of_pages
[Internet Archive "Save Page Now" for persisting web pages]: https://web.archive.org/save

### Markdown

Write one sentence per line.
This makes long sentences immediately visible, and makes it easier to manage changes.

The rule is unambiguous and does not require tooling support to be applied easily.
[Here is a discussion of different line wrapping styles.]

Use [reference links] to keep the plain text readable.
Collect links at the end of each section, which are delimited by headings.

[Here is a discussion of different line wrapping styles.]: https://web.archive.org/web/20220519121408/https://mtsknn.fi/blog/4-1-wrapping-styles-for-markdown-prose-and-code-comments/
[reference links]: https://github.github.com/gfm/#reference-link

### Terminology

To avoid confusion around all the things called Nix, always use the following terms with capitalisation as given.

- Nix

  Build system and package manager.

  Read /nɪks/ ("Niks").

- Nix language

    Programming language to declare packages and configurations for Nix.

  - Nix expression

    Expression written in the Nix language.

  - Nix file

    File (`.nix`) containing a Nix expression.

- Nixpkgs

  Software distribution built with Nix.

  Read /nɪks ˈpækɪʤɪz/ ("Niks packages").

- NixOS

  Linux distribution based on Nix and Nixpkgs.

  Read /nɪks oʊ ɛs/ ("Niks Oh Es").
