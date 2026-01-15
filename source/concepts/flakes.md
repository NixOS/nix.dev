(flakes-definition)=
# Flakes

## What are flakes?

Flakes are an [experimental feature] in Nix, proposed in [RFC 49],
introduced in a [blog post], then added in [Nix 2.4].

Flakes are aimed at sharing Nix code in a way that makes it easy to build them with those same versions.
They do this by defining a [module structure] specifying outputs and (if needed) inputs.

Enabling the features flag `flakes` (with [`nix-command`]) adds a [`nix`] command line interface.
Its commands operate on [references] to local (e.g. `.`) or remote (e.g. `github:NixOS/nixpkgs`) project directories called flakes.

Such directories contain a `flake.nix` entrypoint using this structure in a subset[^subset] of Nix.
[`outputs`] include various [built-in types], but can be [extended].

[`inputs`] let you set dependencies. On build, these are then tracked in a JSON file [`flake.lock`].
If these have inputs of their own, Nix will check _their_ lock files to find the versions to use.
Using the same versions helps make sure programs work as intended, but inputs' `follows` field can override these.

Aliases to flakes can be stored in a [registry].
This can be extended by [command-line] or by {term}`NixOS` option [`nix.registry`].

[^subset]: Pure mode is enforced, preventing evaluation of [impurities].
Its `inputs` and metadata fields cannot be arbitrary Nix expressions.
This is to prevent complex, possibly non-terminating computations.
The `outputs` field's function parameter must be specified: it does not support [eta-reduction].

[experimental feature]: https://nix.dev/manual/nix/stable/development/experimental-features#xp-feature-flakes
[RFC 49]: https://github.com/NixOS/rfcs/pull/49
[blog post]: https://tweag.io/blog/2020-05-25-flakes/
[Nix 2.4]: https://nix.dev/manual/nix/stable/release-notes/rl-2.4.html#highlights
[module structure]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-format
[`nix-command`]: https://nix.dev/manual/nix/stable/development/experimental-features#xp-feature-nix-command
[`nix`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix.html
[references]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake#flake-references
[`outputs`]: https://wiki.nixos.org/wiki/Flakes#Output_schema
[built-in types]: https://github.com/NixOS/nix/blob/38c755f168b7c38cd4687aacf5d7e59f049658d3/src/nix/flake.cc#L594-L769
[extended]: https://github.com/NixOS/nix/blob/38c755f168b7c38cd4687aacf5d7e59f049658d3/src/nix/flake.cc#L772-L776
[`inputs`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-inputs
[`flake.lock`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake.html#lock-files
[impurities]: https://nix.dev/manual/nix/stable/tutorials/nix-language.html#impurities
[registry]: https://github.com/NixOS/flake-registry
[command-line]: https://nix.dev/manual/nix/2.28/command-ref/new-cli/nix3-registry.html
[`nix.registry`]: https://search.nixos.org/options?channel=unstable&show=nix.registry&query=registry
[eta-reduction]: https://wiki.haskell.org/Eta_conversion

## Should I use flakes in my project?

You have to judge for yourself based on your needs.

While flakes reduce complexity in some regards, they also introduce some complexity with additional mechanisms.
You will have to learn more about the system to fully understand how it works.

Both paradigms have their own set of unique concepts and support tooling that have to be learned, with varying ease of use, implementation quality, and support status.
At the moment, neither the stable nor the experimental interface is clearly superior to the other in all aspects.

There are different levels of buy-in in the use of flakes, with each stage introducing their own trade-offs:

### Discoverability

A first level of use of flakes consists of including a `flake.nix` file specifying `outputs`.

Pros:

- Allows use of the code through the flake, including the v3 command line interface, downstream flake projects, as well as flake registries.
- The `flake.nix` file is checked for schema validity.

Cons:

- Flakes are not [parameterized].
  This means that flakes [downgrade] ease of use of the `system` parameter of derivations, for producers and consumers,
  leading to related [utility functions].
- As an experimental feature, flakes could still be changed by Nix developers.

[parameterized]: https://github.com/NixOS/nix/issues/2861
[downgrade]: https://github.com/NixOS/nix/issues/3843
[utility functions]: https://github.com/numtide/flake-utils

Alternatives:

- Use flakes as thin wrappers over existing Nix code, so code can be used in both ways.
- Settle for exposing traditional Nix modules, and let flake users import the project with `flake = false;`.

[`import`]: https://nix.dev/tutorials/nix-language#import

### Running commands

Given the above, one may further access the created flake by Nix's [v3 command line interface], enabled by separate experimental feature [nix-command], which can build or run programs given a flake references.

[v3 command line interface]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix.html
[nix-command]: https://nix.dev/manual/nix/stable/development/experimental-features#xp-feature-nix-command

Pros:

- Flakes cache evaluations of builds to save time on subsequent identical builds, which can save time when say running unchanged builds in Continuous Integration.
- The v3 command-line interface, together with flakes, promotes making programs easy to run (using `nix run` to run executables in `outputs.apps`), including from remote repositories.
- Flakes default to running in [pure mode], promoting a style of writing programs more likely to make them reproducible[^reproducible].

[pure mode]: https://nix.dev/manual/nix/stable/tutorials/nix-language.html#impurities

[^reproducible]: Even in pure mode, reproducibility is [not actually guaranteed].

[not actually guaranteed]: https://discourse.nixos.org/t/nix-flakes-explained-what-they-solve-why-they-matter-and-the-future/72302/7

Cons:

- The entire flake directory is copied to Nix store before evaluation.
  This is used in evaluation caching, but also adds a [performance penalty], especially for large repositories such as {term}`Nixpkgs`.
- There are still various outstanding issues with the implementations of [flakes] and the [v3 `nix` command line interface].
- In projects using [Git] version control, files must be staged for flakes to see them.

[performance penalty]: https://github.com/NixOS/nix/issues/3121
[flakes]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Aflakes+sort%3Areactions-%2B1-desc
[v3 `nix` command line interface]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Anew-cli+sort%3Areactions-%2B1-desc

Alternatives:

- The [v2 command line interface] (e.g. [`nix-build`], [`nix-shell`]) is used to interfaces with traditional Nix files.
- The [`--file` flag] allows the v3 commands to operate on traditional Nix files.
- In {term}`NixOS`, to use the v3 commands with a package set `pkgs` rather than
  with a flake NixOS configuration's {term}`Nixpkgs` instantiation,
  one may use [`nixpkgs.flake.source = pkgs.path;`].
- One may also expose to v3 commands any dependencies pinned in NixOS, e.g. [using `npins`].
with the experimental feature enabled, #1202 handles nix run nixpkgs#hello
- Using [`builtins.fetchTree`] from experimental feature [`fetch-tree`], the [`nix run`] may be emulated[^emulated] for non-flake entrypoints.

[Git]: https://git-scm.com/
[v2 command line interface]: https://nix.dev/manual/nix/stable/command-ref/main-commands
[`--file` flag]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-build.html#options-that-change-the-interpretation-of-installables
[`nix-build`]: https://nix.dev/manual/nix/stable/command-ref/nix-build.html
[`nix-shell`]: https://nix.dev/manual/nix/stable/command-ref/nix-shell.html
[`nixpkgs.flake.source = pkgs.path;`]: https://search.nixos.org/options?channel=unstable&show=nixpkgs.flake.source&query=nixpkgs.flake.source
[using `npins`]: https://nix.dev/guides/recipes/dependency-management#managing-nixos-configurations
[`builtins.fetchTree`]: https://noogle.dev/f/builtins/fetchTree
[`fetch-tree`]: https://nix.dev/manual/nix/stable/development/experimental-features#xp-feature-fetch-tree
[`nix run`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-run.html

[^emulated]: `nix run github:NixOS/nixpkgs#hello` for non-flake projects may look like `nix-shell -p '(import (builtins.fetchTree "github:NixOS/nixpkgs").outPath { }).hello' --run 'hello'`. A drop-in command `nix-run` using the `nix run` syntax could be defined using a Bash alias like `alias nix-run='run() { $(nix-instantiate --raw --impure --eval --expr "(import <nixpkgs> {}).lib.getExe (import (builtins.fetchTree \"$(cut -d "#" -f 1 <<< "$1")\").outPath { }).$(cut -d "#" -f 2 <<< "$1")"); }; run'`.

### Dependency management

Flakes' `inputs` attribute may be used to manage dependencies. This approach by default handles recursive dependencies implicitly, allowing to explicitly override dependencies if desired.

Pros:

- Make it easy to reproduce published software, following the versions they used.
- Offers a way to override recursive inputs using `follows` statements.

Cons:

- As flakes by default follow versions declared in dependencies' flakes, if one does not actively override these using `follows` statements, one may end up with:
  - duplicate versions of the same (recursive) dependency.
  - outdated recursive dependencies if such versions are not actively updated throughout the chain.
- Dependencies are fetched eagerly, making for additional overhead
  in case (recursively) declared dependencies (not overridden to `null`) end up not used.
- There has not been a good way to facilitate overriding inputs for both flake-based and non-flake consumers without using flake inputs to manage dependencies.

Alternatives:

- Handle dependencies with [`npins`], which makes the user explictly specify any used dependencies.
  This makes the user responsible for versions used, solving drawbacks of flakes' implicit model.
  - If dependencies have only flake entrypoints, if needed load their flakes using library [`flake-inputs`].
  - Allow others to change your dependencies by having them in Nix entrypoints' module parameters _and_ exports:

  ```nix
  {
    sources ? import ./npins,
  }:
  {
    # ...
    inherit sources;
  }
  ```

[`flake-inputs`]: https://github.com/fricklerhandwerk/flake-inputs
[`npins`]: https://nix.dev/guides/recipes/dependency-management.html

### Flake-only Nix

Given flakes (largely) use Nix as an internal language, one could even place all of their Nix code in flake files.
This pattern is further facilitated by library [`flake-parts`](https://github.com/hercules-ci/flake-parts)
to help achieve something like this while spreading code across different files.

Pros:

- Helps use flakes' schema and inputs from any such Nix code.

Cons:

- Makes it harder to access such code without using flakes.

Alternatives:

- Use flakes as thin wrappers over existing Nix code, so code can be used in both ways.
- Use library [`flake-compat`] to expose a flake's default package or shell to non-flake users.

[`flake-compat`]: https://github.com/NixOS/flake-compat

### General considerations

- Design
  - The flakes proposal was criticised for trying to solve too many problems at once and at the wrong abstraction layer.
  - The design still has [various problems] including around versioning, composability, cross-compilation, and tight coupling with nixpkgs.
  - There are also still many [open design questions around the `nix` command line interface].
- Implementation
  - A number of [problems with the implementation] remain.
- Process
  - While there were still outstanding concerns about the design,
    the implementation was merged without the RFC having been accepted (and in fact being withdrawn on merge),
    raising questions about proper process.
  - The RFC was closed with no timeline to conclude the experiment.
  - Flakes had become depended on by many projects, making it harder to iterate on their design without breaking many people's code.
- Community
  - The design had not been accepted by all parts of the community, with e.g. {term}`Nixpkgs` not using it in its internal tooling.
    As a result of this, branching approaches to flakes have been made,
    with e.g. company Determinate Systems (which offers proprietary features around flakes) unilaterally declaring the feature stable,
    while community-driven Nix fork Lix [consolidated the featureset] to a de-facto 'v1'.
    Such branching could potentially end up breaking the promise of a unified interface that propelled the flakes experiment in the first place.

[various problems]: https://wiki.lix.systems/books/lix-contributors/page/flakes-feature-freeze#bkmrk-design-issues-of-fla
[open design questions around the `nix` command line interface]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Anew-cli+sort%3Areactions-%2B1-desc
[problems with the implementation]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Aflakes+sort%3Areactions-%2B1-desc
[consolidated the featureset]: https://wiki.lix.systems/books/lix-contributors/page/flake-stabilisation-proposal

## Further reading

- [Flakes aren't real and cannot hurt you: a guide to using Nix flakes the non-flake way](https://jade.fyi/blog/flakes-arent-real/) (Jade Lovelace, January 2024)
- [Nix Flakes is an experiment that did too much at once...](https://samuel.dionne-riel.com/blog/2023/09/06/flakes-is-an-experiment-that-did-too-much-at-once.html) ([comments](https://discourse.nixos.org/t/nix-flakes-is-an-experiment-that-did-too-much-at-once/32707)) (Samuel Dionne-Riel, September 2023)
- [Experimental does not mean unstable](https://determinate.systems/posts/experimental-does-not-mean-unstable) ([comments](https://discourse.nixos.org/t/experimental-does-not-mean-unstable-detsyss-perspective-on-nix-flakes/32703)) (Graham Christensen, September 2023)
- [The Nix Hour: comparing flakes to traditional Nix](https://www.youtube.com/watch?v=atmoYyBAhF4) (Silvan Mosberger, November 2022)

