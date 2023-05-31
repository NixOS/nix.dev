# Contributing Documentation

This guide shows how you can contribute documentation to Nix, Nixpkgs, or NixOS.
It is maintained by the [Nix documentation team](https://nixos.org/community/teams/documentation), your first point of contact if you want to help out.

## List of available documentation

### Manuals

The manuals for [Nix][nix manual] ([source][nix manual src]), [Nixpkgs][Nixpkgs manual] ([source][nixpkgs manual src]), and [NixOS][NixOS manual] ([source][nixos manual src]) are purely reference documentation, specifying interfaces and behavior.

They also show example interactions which demonstrate how to use its components, and explain mechanisms where necessary.

The documentation team watches all pull requests to the manuals and assists contributors to get their changes merged.

You can help by doing the following:

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

### nix.dev

The purpose of [nix.dev] ([source][nix.dev src]) is to guide newcomers by teaching essential Nix knowledge, show best practices, and help orient users in the Nix ecosystem.

It goes into breadth, not depth.
    
The documentation team maintains nix.dev as editors.
    
You can help by doing the following:
    
- working on [open issues][nix.dev issues]
- reviewing [pull requests][nix.dev prs] by testing new material or features
- adding guides or tutorials following the [proposed outline](https://github.com/NixOS/nix.dev/pull/265/files)

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

### nixos.org

The Nix project web site is [nixos.org] ([source][nixos website src]).

Website contents that concern learning Nix should reference or include material from nix.dev.
    
The [Nix marketing team] is responsible for the web site, and the documentation team assists with maintaining contents related to onboarding new users.

[nixos.org]: https://nixos.org
[nixos website src]: https://github.com/nixos/nixos-homepage
[Nix marketing team]: https://nixos.org/community/teams/marketing.html

## List of communication channels

### Matrix

Use Matrix for casual communication.
    
The documentation team frequents the [Nix* Documentation] room.
    
Old messages are extremely improbable to be read by anyone.

You can help by posting in the appropriate categories on [Discourse] what you have found valuable.

[Nix* Documentation]: https://matrix.to/#/#docs:nixos.org 
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

### External sources

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

## Values

### Be kind

Adapted from [Contributor Covenant] and [The Carpentries Code of Conduct]:

- Use welcoming and inclusive language
- Show empathy and respect towards other people
- Be respectful of different viewpoints and experiences
- Give and gracefully accept constructive criticism
- Focus on what is best for the community

[Contributor Covenant]: https://github.com/EthicalSource/contributor_covenant/blob/cd7fcf684249786b7f7d47ba49c23a6bcb3233eb/content/version/2/1/code_of_conduct.md
[The Carpentries Code of Conduct]: https://github.com/carpentries/docs.carpentries.org/blob/4691971d9f49544054410334140a4fd391a738da/topic_folders/policies/code-of-conduct.md

### Be truthful

The only thing more confusing than no documentation is misleading documentation.

#### Use and provide evidence

Documentation should enable readers to answer all their questions on their own.

Provide links to other resources, such as the manuals, if it would help guide readers on their learning journey.

It is explicitly encouraged to update or restructure the manuals where appropriate, to improve the overall experience.

Similarly, the other information surrounding documentation should enable contributors to answer most of their questions and correct obvious errors on their own, and only then resort to opening issues.

Errors get more obvious if we can measure execution against intent.

Therefore we ask you to always make explicit the motivation behind your proposed changes.

Add references to any relevant resources in commit messages, if it helps understand the reasoning behind a significant change.

#### Ensure working code samples

Code samples must always be working correctly when run as instructed.

Nix provides us with everything needed to make this happen.

### Be concise

> I would have written a shorter letter, but I did not have the time.
>
> — [Blaise Pascal][Blaise Pascal]

Readers' time and attention is limited.

Take the time to be extraordinarily respectful with their cognitive resources.

The same holds for communication directed to contributors and maintainers: This is a public project, and many people will read what you write. Use this leverage with care.

[Blaise Pascal]: https://en.m.wikiquote.org/w/index.php?title=Blaise_Pascal&oldid=2978584#Quotes

## Guidelines

### Writing style

- Follow the evidence-based [plain language guidelines].

- Describe the subject factually.

- Use imperative in direct instructions.

- Clarity and brevity outweighs emotional appeal.

  Do not presuppose a personal relationship with readers.
  
- Address the reader with "you" when necessary.

  Clarify identity if you use "we".
  Generally, "we" are the Nix community.

- Use culturally neutral language:

  - Avoid idioms.

    Idioms can be hard to understand for non-native English speakers.

  - Don't try to be funny.

    Humor is highly culturally sensitive.
    
    At best, jokes may obfuscate the relevant instructions.
    
    At worst, jokes may offend readers and invalidate our effort to help them learn.

  - Don't use references to popular culture.

    What you may consider well-known may be entirely obscure and distracting to people from different backgrounds.

[plain language guidelines]: https://www.plainlanguage.gov/guidelines/

### Links

Unless explicitly required to point to the latest version of an external resource, all references should be [permanent links].

Many web services offer permalinks, such as:

- [GitHub URLs to specific commits]
- [Wikipedia URLs to specific page versions]
- [Internet Archive "Save Page Now" for persisting web pages]

[permanent links]: https://en.m.wikipedia.org/wiki/Permalink
[GitHub URLs to specific commits]: https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files
[Wikipedia URLs to specific page versions]: https://en.m.wikipedia.org/wiki/Wikipedia:Linking_to_Wikipedia#Permanent_links_to_old_versions_of_pages
[Internet Archive "Save Page Now" for persisting web pages]: https://web.archive.org/save

### Markdown

- Write one sentence per line.

  This makes long sentences immediately visible, and makes it easier to manage changes.
  
  The rule is unambiguous and does not require tooling support to be applied easily.

  [Here is a discussion of different line wrapping styles.]

- Use [reference links] to keep the plain text readable.

  Collect links at the end of each section, which are delimited by headings.

[Here is a discussion of different line wrapping styles.]: https://web.archive.org/web/20220519121408/https://mtsknn.fi/blog/4-1-wrapping-styles-for-markdown-prose-and-code-comments/
[reference links]: https://github.github.com/gfm/#reference-link

