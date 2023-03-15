# Google Season of Docs 2023 Project Proposal

The Nix documentation team was established in mid 2022 in order to ease learning Nix for beginners and support community efforts in that direction.

Recently the team has gained many new members eager to tackle long-standing issues.
But from experience, volunteer work only gets us so far.
This year we are applying for funding through Google Season of Docs to make possible a substantial improvement of the onboarding experience.

References:
- [Documentation Team: Flattening the learning curve](https://discourse.nixos.org/t/documentation-team-flattening-the-learning-curve/20003)
- [Documentation Team: Call for maintainers](https://discourse.nixos.org/t/documentation-team-call-for-maintainers/25970)

> **Important**
>
> This document is **work in progress** until the submission deadline 2023-03-24.

# Learning Journey

## Problem statement

There is no obvious way how to learn using Nix most effectively.
There are too many different, contradictory, partially outdated resources all over the internet.

## Solution proposal

Design and implement a learning journey from the first encounter to mastering a particular set of use cases known to work well:

1. Cover all skills and procedures up to and including managing declarative environments with `shell.nix`.
  - TODO: determine the specific use cases we want to cover
2. Guide users to find their own path from there, given the basics they learned.

### Basis of work

1. Existing [usability studies](https://discourse.nixos.org/t/usability-studies/21404)
2. Survey of existing (third-party) documentation
    - Non-reference materials in the manuals
    - NixOS Wiki
    - Blog posts
    - TODO: migrate [existing survey](https://github.com/NixOS/nix-book/blob/main/resources.md) to maintainers' handbook

## Scope 

1. Rewrite reference documentation within the original scope
    - Architecture chapter (Nix manual)
    - Derivation (Nix manual)
    - System parameter (Nix manual)
    - Language frameworks (Nixpkgs manual)
    - `stdenv` (Nixpkgs manual)

2. Write tutorials
   - Based on updated reference documentation
   - Using as much existing (third-party) materials as possible
   - According to detailed requirements derived from usability studies
   - Notify owners of third-party documentation to link to authoritative sources
   - TODO: define tutorial topics
    
## Measure success

Run another round of usability studies on the changed materials and compare with existing results.

## Arguments for this approach

- we have the evidence in the usability studies
- direction determined by well-supported use cases
- scope can be clearly defined by tutorial topics
- as a result will reduce the scatteredness
- immediate user value by enabling quick onboarding
- reference documentation as a prerequisite also serves advanced users and contributors
  - writing tutorials without good reference documentation is **very** hard
