# Documentation resources

This is an overview of documentation resources for Nix, Nixpkgs, and NixOS, with suggestions how you can help to improve them.

## Reference manuals

The reference manuals document interfaces and behavior, show examples, and define component-specific terms.

- [Nix reference manual](nix-manual)
  - [source](https://github.com/NixOS/nix/tree/master/doc/manual)
  - [issues](https://github.com/NixOS/nix/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation)
  - [pull requests](https://github.com/NixOS/nix/pulls?q=is%3Aopen+is%3Apr+label%3Adocumentation)
- [Nixpkgs reference manual](https://nixos.org/manual/nixpkgs)
  - [source](https://github.com/NixOS/nixpkgs/tree/master/doc)
  - [issues](https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+documentation%22+-label%3A%226.topic%3A+nixos%22)
  - [pull requests](https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%226.topic%3A+documentation%22+-label%3A%226.topic%3A+nixos%22)
- [NixOS reference manual](https://nixos.org/manual/nixos)
  - [source](https://github.com/NixOS/nixpkgs/tree/master/nixos/doc/manual)
  - [issues](https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%226.topic%3A+documentation%22+label%3A%226.topic%3A+nixos%22+)
  - [pull requests](https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%226.topic%3A+documentation%22+label%3A%226.topic%3A+nixos%22+)

The respective manual sections are maintained by developers of the code being documented.

How to help:

- Add links to definitions, commands, options, etc. where only the name is mentioned
- Ensure consistent use of technical terms
- Check that examples are self-contained and follow best practices
- Expand on sections that appear incomplete

## NixOS Wiki

[NixOS Wiki](https://wiki.nixos.org/) is a collection of NixOS user guides, configuration examples, and troubleshooting tips.
It is meant to be complementary to the NixOS reference manual.

It is collectively edited by the NixOS user community.

How to help:

- Improve discoverability by adding categorisation and links to reference documentation
- Remove redundant or outdated information
- Add guides and sample configurations for your use cases

## nix.dev

The purpose of [nix.dev](https://nix.dev) ([source](https://github.com/nixos/nix.dev)) is to orient beginners in the Nix ecosystem.

The documentation team maintains nix.dev as editors.

How to help:

- Work on [open issues](https://github.com/nixos/nix.dev/issues)
- Review [pull requests](https://github.com/nixos/nix.dev/pulls)
- Add guides or tutorials following the [proposed outline](https://github.com/NixOS/nix.dev/issues/572).
  New articles can be based on videos such as:

  - [The Nix Hour](https://www.youtube.com/watch?v=wwV1204mCtE&list=PLyzwHTVJlRc8yjlx4VR4LU5A5O44og9in) recordings
  - some of the ~100 [NixCon](https://www.youtube.com/c/NixCon) recordings
  - [Nix video guides](https://www.youtube.com/user/elitespartan117j27) by @jonringer.
  - [Summer of Nix 2022 talks](https://www.youtube.com/playlist?list=PLt4-_lkyRrOMWyp5G-m_d1wtTcbBaOxZk)

  Since writing a guide or tutorial is a lot of work, please make sure to coordinate with maintainers, for example by commenting on or opening an issue.

## Discourse

Nix users exchange information and support each other on these Discourse categories:

- [Help](https://discourse.nixos.org/c/learn/9)
- [Guides](https://discourse.nixos.org/c/howto/15)
- [Links](https://discourse.nixos.org/c/links/12)

How to help:

- Ask informed questions, show your work
- Answer other people's questions
- Address recurrent questions by updating or adding a NixOS Wiki article, nix.dev guide or tutorial, or one of the reference manuals.
- Encourage and help people to incorporate their insights into official documentation

## Nix Pills

[Nix Pills](https://nixos.org/guides/nix-pills/) is a series of low-level tutorials on building software packages with Nix, showing in detail how Nixpkgs is made from first principles.

The Nix Pills are not actively maintained.

