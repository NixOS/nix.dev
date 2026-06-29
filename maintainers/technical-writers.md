# How technical writers can help with official Nix/NixOS/Nixpkgs documentation

- Read the [NixOS documentation vision](https://github.com/NixOS/nix.dev/tree/master/maintainers/vision.md)
- Read the [styleguide](https://github.com/NixOS/nixpkgs/blob/master/doc/styleguide.md)

## Verify and improve NixOS onboarding

- Go through the instructions to install Nix and/or NixOS https://nixos.org/download/
- Improve any problems with documentation you run into

## Reference manual cleanup

- Pick a set of generally useful guides in the official reference manuals ([NixOS](https://nixos.org/manual/nixos/unstable/), [Nixpkgs](https://nixos.org/manual/nixpkgs/unstable/), [Nix](https://nixos.org/manual/nix), [home-manager](https://nix-community.github.io/home-manager/)
- Check/rewrite it according to the [style guidelines](https://github.com/NixOS/nixpkgs/blob/master/doc/styleguide.md)
- Check that content is in the right reference manual and move it if necessary
- Simplify and reorganise the content if necessary
- NixOS installation section: https://nixos.org/manual/nixos/unstable/#ch-installation

### Cleanup mega language guides

Four language docs are massively oversized and violate the styleguide, which makes them hard to approach:

- Nixpkgs Python section: https://nixos.org/manual/nixpkgs/unstable/#python
- Nixpkgs Haskell section: https://nixos.org/manual/nixpkgs/unstable/#haskell
- Nixpkgs Rust section: https://nixos.org/manual/nixpkgs/unstable/#rust
- Nixpkgs Javascript section: https://nixos.org/manual/nixpkgs/unstable/#language-javascript

The styleguide demands: "Start with the minimal working code. Progressive disclosure. Introduce concepts only when needed."
These sections do the opposite: "Start with abstract explanations, reference tables, pragraphs and callouts before the first working example"

### Cleanup stdenv hook guides

- Some hook docs are here: https://nixos.org/manual/nixpkgs/unstable/#chap-hooks
- Many are underdocumented. Some are missing entirely.
- None of the hooks states when a user would want to use it.
- Missing examples: Writers can find examples from the existing language-docs and nixpkgs source

## Nixpkgs manual editorial work

Source: https://github.com/NixOS/nixpkgs/tree/master/doc#readme
Rendered: https://nixos.org/manual/nixpkgs/unstable/

- Style-guide compliance pass
- re-structure where content is hard to understand

## Check NixOS Wiki and migrate to sources when reasonable

- Pick a NixOS wiki pages: https://wiki.nixos.org/w/index.php?title=Special:AllPages&hideredirects=1
- Test its parts, categorise them (perhaps https://diataxis.fr/) and determine which official project (if any) they belongs to (NixOS, Nixpkgs, home-manager)
- Check/rewrite it according to the [style guidelines](https://github.com/NixOS/nixpkgs/blob/master/doc/styleguide.md) while moving it to the official project it belongs to
- Replace the respective part in https://wiki.nixos.org/ by a link to the rendered NixOS manual

# Brainstorming space

- The three manuals have very different quality levels
- The nixpkgs manual is the largest by topics and most complex
- The documentation has structural issues (monolithic chapters, inconsistent formatting)

- A technical writer without Nix expertise could tackle structural and editorial improvements like standardizing formatting, fixing broken links, reorganizing large pages into smaller sections, adding missing metadata, improving cross-references between manuals, and general auditing
    - Part of what the new styleguide also enforces.

- Add new "try nixos", "try nix" guides - i.e. NixOS via VirtualBox, nix as package-manager

- Nixos & nixpkgs manual
    - Enforce the newly added stylguide
        - Once voice in all manuals
        - The styleguide is designed to ease onboarding
        - Inform structure, means every guide feels similar.
- Content deduplication
- Add more examples & put examples first

- guides etc.

- deduplicate NixOS services also documented in the wiki
  - Move to NixOS manual

Problematic Nixpkgs sources:
- https://github.com/NixOS/nixpkgs/tree/master/doc/stdenv/stdenv.chapter.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/build-helpers/images/dockertools.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/languages-frameworks/haskell.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/languages-frameworks/go.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/languages-frameworks/javascript.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/languages-frameworks/python.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/stdenv/cross-compilation.chapter.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/languages-frameworks/beam.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/languages-frameworks/dhall.section.md
- https://github.com/NixOS/nixpkgs/tree/master/doc/build-helpers/fetchers.chapter.md


nix.dev consolidate tutorials & guides
- Into just "guides"
