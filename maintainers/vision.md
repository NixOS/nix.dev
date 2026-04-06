# NixOS documentation vision

High-quality documentation is a prerequisite for growth, adoption, and contributor sustainability in the Nix ecosystem. This vision aligns contributors around a shared direction, lowers the barrier to contribution, and ensures documentation serves both newcomers and experienced users.

The core idea: if others understand where the documentation team is going, they can contribute in small or large steps toward it.

## Learning from other projects

Following our own documentation principle — show, don't tell — here is a successful example using the [Diataxis](https://diataxis.fr/) framework:

[**MDN Web Docs**](https://developer.mozilla.org/) breaks the web platform into well-defined domains: HTML, CSS, JavaScript, and Web APIs. These are immediately visible in navigation, so you can orient yourself and move between domains as needed.

Within each domain, MDN consistently separates two types of documentation:

- **Reference documentation**, for users who know what they're looking for. It answers: how do I call this function? What does this option do? Is this feature supported in my environment?
- **Guides and tutorials**, for learning and problem-solving. They explain how to accomplish concrete goals, often combining multiple technologies. For example: ["Adding interactivity"](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Adding_interactivity) connects HTML, CSS, and JavaScript in a practical way.

## Applying these insights to NixOS

The Nix ecosystem documents several tightly connected components:

- **Nix** — the package manager and build tool
- **The Nix language**
- **nixpkgs** — the package set
- **lib** — the standard library
- **NixOS** — the operating system and its configuration options

Understanding the distinction between these components — and the connection between them — is itself a key learning. Interconnected documentation is a prerequisite for that.

But components are not how users think. Users ask questions like:

- How do I run nginx on NixOS?
- What options does the PostgreSQL service expose?
- Which packages provide this tool?

## The vision

Long-term, a single authoritative documentation portal at [docs.nixos.org]() that:

- Serves as the source of truth for official Nix and NixOS documentation
- Separates reference documentation from guides and tutorials
- Structures content by component, making ownership and discoverability obvious
- Lets you navigate by application or service, not only by component
- Encourages incremental improvements and small pull requests

**A concrete roadmap for achieving this vision is maintained separately and updated regularly.**

Core principles:

- **Clear, accessible language.** Documentation is understandable without oversimplifying technical reality.
- **Structured by component.** Each major part has complete reference documentation and curated guides for common workflows.
- **Consolidation over duplication.** Move existing content into the right place, improve structure and cross-linking, and reduce scattered or redundant explanations.
- **Examples over explanation.** Concrete, working examples come first. Readers can adapt them to their needs.
- **Reference docs derive from source.** Where source code carries structured annotations, reference documentation is generated from it. This keeps docs accurate as the source evolves.

## Application and service navigation

You can browse documentation by service or application, not only by component. For example, navigating to nginx surfaces:

- The relevant `services.nginx.*` options, grouped by submodule
- Related packages
- Guides for common workflows

This view does not duplicate content. It connects existing reference data to the user-level question: how do I run this?

## Search

Search works across all components simultaneously. You can:

- Search by option path (`services.postgresql`) and see matching options, related packages, and relevant guides
- Filter by component (nixpkgs, NixOS options, lib, guides)
- Find a service's full option set without knowing the exact module path in advance

## Getting started guides (high priority)

A small set of high-value workflows for newcomers:

- How to install NixOS — target: under 15 minutes, end to end
- How to add packages and services
- How to manage system configuration safely
- How to upgrade and recover a system

These guides are concise, opinionated where appropriate, and link directly into reference documentation.

## docs.nixos.org vs wiki

docs.nixos.org is curated, reviewed, and authoritative. It covers common and important workflows, stays maintained over time, and does not need to cover every edge case.

The wiki is community-driven and fast-moving. It covers niche topics, experiments, early ideas, and rapidly evolving information. It acts as a documentation incubator.

When a wiki topic becomes widely useful and commonly referenced, it can move into docs.nixos.org. When it's niche or experimental, it can stay in the wiki.

## Ownership and governance

Maintainers of components are responsible for keeping reference documentation of their components accurate. The documentation team coordinates cross-cutting efforts, maintains shared infrastructure, and reviews contributions.

## Maintenance and sustainability

The documentation team support community driven maintenance of documentation. This keeps content accurate, relevant, and aligned with the overall structure.

## What success looks like

- You can find all relevant information in one place
- You can install and use NixOS without relying on external blogs
- Common workflows are documented once, clearly, and authoritatively
- Contributors know where to add or improve content
- Fewer outdated links and contradictory explanations across all components

## Get involved

Everyone who cares about NixOS documentation is explicitly invited to contribute.

You don't need to write large guides. Valuable contributions include:

- Improving clarity and structure
- Adding links and cross-references
- Consolidating existing content
- Turning commonly referenced wiki pages into polished documentation
- Reviewing and maintaining existing pages

Small, incremental pull requests are encouraged and highly valued.
