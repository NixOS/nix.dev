# NixOS documentation vision

High-quality documentation is a prerequisite for growth, adoption, and contributor sustainability in the Nix ecosystem. This vision is aimed at aligning contributors around a shared direction, lowering the barrier to contribution, and ensuring documentation serves both newcomers and experienced users effectively.

The core idea is simple: If others understand where we're going, they can contribute in small or large steps towards it.

## Learning from other projects

Following our own documentation principles — **show, don't tell** — let's look at a successful example that follows the [Diataxis](https://diataxis.fr/) documentation framework:

- [**MDN Web Docs.**](https://developer.mozilla.org/) Rather than trying to document "the Web" as one giant thing, MDN breaks it into well defined ecosystems: HTML, CSS, JavaScript, and Web APIs. These are immediately visible in navigation, so that users can orient themselves and move between domains as needed.

  Within each ecosystem, MDN consistently distinguishes between two types of documentation:
  - **Reference documentation**, optimized for experienced users who know what they're looking for. It answers: How do I call this function? What exactly does this option do? Is this feature supported in my environment?
  - **Guides and tutorials**, optimized for learning and problem-solving. They explain how to accomplish concrete goals, often by combining multiple technologies. For example: ["Adding interactivity"](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Adding_interactivity) connects HTML, CSS, and JavaScript in a practical way.

## Applying these insights to NixOS

The Nix ecosystem faces similar challenges. We're not documenting a single product, but multiple tightly connected ecosystems:

- **Nix** (the executable / package manager)
- The **Nix language**
- **nixpkgs** (the package set)
- **lib** (the standard library)
- **NixOS** (the operating system and its configuration options)

As a user understanding the distinction but also the connection between the different ecosystems is a key learning. Interconnected documentation for these ecosystems is a prerequisite for this.

## The vision

Long-term, we want a single authoritative documentation portal at [docs.nixos.org]() that:

- Serves as the source of truth for official Nix and NixOS documentation
- Clearly separates reference documentation from guides and tutorials
- Is structured by ecosystem, making ownership and navigation obvious
- Encourages incremental improvements and small pull requests

**A concrete roadmap for achieving this vision will be maintained separately and updated regularly as we make progress.**

This means following some core principles:

- **Clear, accessible language.** Documentation should be understandable by as many people as possible without oversimplifying technical reality.
- **Structured by ecosystem.** Each major part should have complete reference documentation and curated guides for common workflows.
- **Consolidation over duplication.** Where we already have sufficient content, we should move it into the right place, improve structure and cross-linking, and reduce scattered or redundant explanations.
- **Examples over explanation.** Following the "show, don't tell" principle from the start, documentation should provide concrete, working examples that readers can adapt to their needs.

## Getting started guides (high priority)

We should explicitly prioritize a small set of high-value workflows, especially for newcomers:

- How to install NixOS (target: ~15 minutes, end-to-end)
- How to add packages and services
- How to manage system configuration safely
- How to upgrade and recover a system

These guides should be concise, approachable, opinionated where appropriate, and link directly into further reference documentation.

## Documentation vs wiki

Documentation and wiki serve different but complementary roles.

Documentation is curated, reviewed, and authoritative. It focuses on common and important workflows, stays stable and maintained over time, and doesn't need to cover every edge case.

The wiki is community-driven and fast-moving. It's a space for niche topics, experiments and early ideas, and rapidly evolving information. It acts as a documentation incubator, not a replacement for documentation, but a feeder and experimentation space.

If a topic becomes widely useful and commonly referenced, it should be refined and moved into documentation. If it's niche or experimental, it belongs in the wiki.

## Ownership and governance

- Each ecosystem has designated maintainers responsible for keeping reference documentation accurate.
- The documentation team coordinates cross-ecosystem efforts, maintains shared infrastructure, and reviews contributions.

## Maintenance and sustainability

Documentation is curated and maintained by the documentation team in collaboration with the wider community. This ensures content remains accurate, relevant, and aligned with the overall structure of the ecosystem. Sustainable documentation requires not only contributions, but ongoing maintenance and coordination.

## What success looks like

- New users can install and use NixOS without relying on external blogs
- Common workflows are documented once, clearly, and authoritatively
- Contributors know where to add or improve content
- Fewer outdated links and contradictory explanations across the ecosystem

## Get involved

We explicitly invite everyone who cares about NixOS documentation to get involved.

You don't need to write large guides to contribute. Valuable contributions include improving clarity and structure, adding links and cross-references, consolidating existing content, turning commonly used wiki pages into polished documentation, reviewing and maintaining existing pages. Small, incremental pull requests are encouraged and highly valued.

Joining doesn't require prior documentation experience or large time commitments. Contributions can range from occasional small improvements to more sustained involvement.
