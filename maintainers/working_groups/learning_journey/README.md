# Learning Journey Working Group

## Goals
The primary goal of the Learning Journey Working Group is to provide Nix users with adequate resources to learn Nix on their own. This means that it is the job of the WG to determine the most effective methods for teaching Nix, including:
- Ensuring that adequate documentation exists
- Ensuring that the documentation is structured in an intuitive way
- Ensuring that the documentation is discoverable
- Ensuring that the documentation meets a minimum standard of quality
- Establishing guidelines for contributions

By extension the WG will be responsible for practical aspects such as:
- Some portion of the structure of `nix.dev` so that documentation is discoverable and organized intuitively
- Ensuring that bare minimum authoring tools exist to keep the barrier low for contributions from new contributors

## Membership
Leads: @zmitchell

Members:
- @infinisil
- @brianmcgee
- @henrik-ch
- @erooke
- @asymmetric

Membership is open to anyone that wants to contribute.

## Meetings
Meetings will be held every week to ensure that progress can be made between meetings.

## Immediate projects
### Decide on documentation structure
This project will decide on a high level structure for the documentation so that contributors know the audience they are speaking to and where their contributions fit into the Nix documentation landscape.

The documentation will follow the [Diataxis](https://diataxis.fr) framework to the degree that it makes sense. This project will produce a proposal to be submitted to the Documentation Team.

The first draft of this structure is as follows:
- Tutorials
    - Installation of Nix
    - Walking a user through their first derivation
    - Packaging an existing project for Nix for the first time
- How-To
    - Packaging for specific languages
    - Packaging idioms
        - `callPackage`, "import from derivation", "fixed output derivation", etc
    - Day-to-day development and workflows
        - Integration with IDEs/editors
        - Nix in CI
        - Nix and NixOS deployments
        - Building containers
    - Rollbacks
    - Contributing in various ways
- Explanation
    - Concepts
    - What is a derivation?
    - Cross-compilation as a first-class citizen
        - Where to put your dependencies (`buildInputs`, `nativeBuildInputs`, etc)
    - The Nix Store and the database
    - Channels, profiles, etc
    - Overlays, overrides, `follows`
- Reference
    - Command reference
    - How store paths are computed
    - Build phases
    - How derivations work
    - Nix language reference
    - Flake schema

### Set standards for documentation pages
In order to provide a level of consistent quality for the documentation, we should decide on the bare minimum standards for documentation pages.

Examples:
- Pages should have a table of contents
- Pages should refrain from first person voice
- Decide how/whether different documentation sections should be handled differently (e.g. tutorial vs reference material)
- etc

### Establish tooling and workflow
We should have tooling that supports authors and enables them to contribute to the documentation with minimal boilerplate.

Examples:
- Macros or snippets to insert callouts ("Note:", "Warning:", etc)
- etc

## Long term projects
### Migrate existing documentation
There is a large body of existing documentation that should not be discounted. We should use the existing documentation to bootstrap the new, reorganized documentation.

Prior art: [Nix Book - Resources](https://github.com/NixOS/nix-book/blob/main/resources.md)
