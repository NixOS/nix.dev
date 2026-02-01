(flakes-definition)=
# Flakes

## What are flakes?

Flakes offer an entrypoint file `flake.nix` aimed at sharing Nix code.
They make it easy to build programs with the same version.

`flake.nix` is a file that declares inputs and outputs with a [standard structure].

> Note: [Experimental], requires [Nix 2.4].

This file can look like:

```nix
{
  description = "My example flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {
    packages.x86_64-linux = {
      default = self.packages.x86_64-linux.hello;
      hello = nixpkgs.legacyPackages.x86_64-linux.hello;
    };
  };
}
```

[`outputs`] include various [built-in types], but can be [extended].
You can find an overview of these on the [wiki].

[`inputs`] let you declare dependencies.

Nix creates a [`flake.lock`] to pin dependencies once you run a [`nix` command].

If these dependencies have `inputs` of their own, Nix will check _their_ lock files to find the versions to use.
Using the same versions helps make sure programs work as intended, but you can override these.

[`nix` command]s natively integrate with flakes by default.

```bash
nix build github:NixOS/nixpkgs#hello
```

You may pass [references] to local (e.g. `.`) or remote (e.g. `github:NixOS/nixpkgs`) project directories.
For further details see the reference on [`nix` command]s.

Aliases to flakes are stored in a [registry].
This can be extended by [command-line] or by {term}`NixOS` option [`nix.registry`].

[^subset]: Flakes default to pure mode, isolating builds from the host environment.
This is also called hermetic evaluation, and prevents evaluating (non-network) [impure] functions.
Flake `inputs` and metadata fields cannot be arbitrary Nix expressions.
This is to prevent complex, possibly non-terminating computations.
The `outputs` field's function parameter must be specified: it does not support [eta-reduction].

The NixOS manual further explains [flake-based installs].

[Experimental]: https://nix.dev/manual/nix/stable/development/experimental-features#xp-feature-flakes
[Nix 2.4]: https://nix.dev/manual/nix/stable/release-notes/rl-2.4.html#highlights
[standard structure]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-format
[`nix` command]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix.html
[references]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake#flake-references
[`outputs`]: https://wiki.nixos.org/wiki/Flakes#Output_schema
[built-in types]: https://github.com/NixOS/nix/blob/38c755f168b7c38cd4687aacf5d7e59f049658d3/src/nix/flake.cc#L594-L769
[extended]: https://github.com/NixOS/nix/blob/38c755f168b7c38cd4687aacf5d7e59f049658d3/src/nix/flake.cc#L772-L776
[wiki]: https://wiki.nixos.org/wiki/Flakes#Output_schema
[`inputs`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-inputs
[`flake.lock`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-flake.html#lock-files
[impurities]: https://nix.dev/manual/nix/stable/tutorials/nix-language.html#impurities
[registry]: https://github.com/NixOS/flake-registry
[command-line]: https://nix.dev/manual/nix/2.28/command-ref/new-cli/nix3-registry.html
[`nix.registry`]: https://search.nixos.org/options?channel=unstable&show=nix.registry&query=registry
[eta-reduction]: https://wiki.haskell.org/Eta_conversion
[flake-based installs]: https://nixos.org/manual/nixos/stable/#sec-installation-manual-installing

## Should I use flakes in my project?

Flakes are an experimental extension format with outstanding issues.
Its functionality can generally be achieved without them as well.

If you need to run existing software that already used flakes, or want to contribute to their development, feel free to use them.
If you want to write Nix code yourself, consider also our guide on [dependency management].[^flake-inputs]
This overview can help get what you need from flakes while preserving compatibility.

[dependency management]: https://nix.dev/guides/recipes/dependency-management.html

[^flake-inputs]: Nix repositories offering only flake entrypoints may be imported using [`flake-inputs`].

### Discoverability

A first step in use of flakes is to add a `flake.nix` file specifying `outputs`.

Pros:

- Use the code from other flake projects.
- Nix checks `flake.nix`'s structure is valid.

Cons:

- Flakes have no [parameters].
  This means `flake.nix` and its end-user must be explicit about the used [`system`].
  This is made easier by say [`flake-utils`].
- As an experimental feature, flakes can still change.

[parameters]: https://github.com/NixOS/nix/issues/2861
[`system`]: https://github.com/NixOS/nix/issues/3843
[`flake-utils`]: https://github.com/numtide/flake-utils

Alternatives:

- Use flakes as thin wrappers over existing Nix code.
  This way, code can be used in both ways.
- Use Nix modules: flake users can import these with `flake = false;`.

[`import`]: https://nix.dev/tutorials/nix-language#import

### Running commands

Flakes are used from Nix's [v3 `nix` command line interface].
It can build or run programs by a reference like `.` or `github:NixOS/nixpkgs`.

You can enable this for one command by adding:

```
 --experimental-features 'nix-command flakes'
````

Or permanently in NixOS or Home Manager configurations using:

```
nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

To build the derivation in your `flake.nix`'s `packages.x86_64-linux.default`, run:

```bash
nix build .#packages.x86_64-linux.default
```

You can shorten this to `nix build .#default`, or just `nix build`.

`nix run` runs programs in `outputs.apps`.
`nix run .#default` runs `outputs.apps.default`.
Just `nix run` also runs that.

For example, to run the `hello` package from {term}`Nixpkgs`:

```bash
nix run nixpkgs#hello -- --greeting "hello from flakes"
```

This uses the version set by your registry's alias `nixpkgs`.

To run the `hello` package from {term}`Nixpkgs`' `nixpkgs-unstable` branch:

```bash
nix run github:NixOS/nixpkgs/nixpkgs-unstable#hello
```

[v3 `nix` command line interface]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix.html

Pros:

- Flakes cache builds to save time on later identical builds.
  This can save time if you run unchanged builds in Continuous Integration, for example.
- Flakes promote making programs easy to run, also from remote repositories.
- Flakes default to running in [pure mode].
  This promotes a style of writing programs more likely to make them reproducible[^reproducible].
- Flakes build only tracked files, for projects using [Git].
  This helps prevent rebuilds.

[pure mode]: https://nix.dev/manual/nix/stable/tutorials/nix-language.html#impurities

[^reproducible]: Even in pure mode, reproducibility is [not actually guaranteed].

[not actually guaranteed]: https://discourse.nixos.org/t/nix-flakes-explained-what-they-solve-why-they-matter-and-the-future/72302/7

Cons:

- Builds copy the whole flake directory to the Nix store.
  This caches them, but can be [slower] for large repositories like {term}`Nixpkgs`.
- The implementation still has issues for both [flakes] and the [v3 CLI].
- Files must be staged for flakes to see them.

[slower]: https://github.com/NixOS/nix/issues/3121
[flakes]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Aflakes+sort%3Areactions-%2B1-desc
[v3 CLI]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Anew-cli+sort%3Areactions-%2B1-desc

Alternatives:

- Plain Nix files can be used with the [v2 commands] (like [`nix-build`], [`nix-shell`]), or with v3 commands' [`--file` flag] or `-f`.
- In {term}`NixOS`, you can make v3 commands' `nixpkgs` to a package set `pkgs` by setting [`nixpkgs.flake.source = pkgs.path;`] in your NixOS configuration.
  Also see [managing dependencies].
- Using [`builtins.fetchTree`] from experimental feature [`fetch-tree`], [`nix run`] may be emulated[^emulated] for non-flake entrypoints.

[Git]: https://git-scm.com/
[v2 CLI]: https://nix.dev/manual/nix/stable/command-ref/main-commands
[`--file` flag]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-build.html#options-that-change-the-interpretation-of-installables
[`nix-build`]: https://nix.dev/manual/nix/stable/command-ref/nix-build.html
[`nix-shell`]: https://nix.dev/manual/nix/stable/command-ref/nix-shell.html
[`nixpkgs.flake.source = pkgs.path;`]: https://search.nixos.org/options?channel=unstable&show=nixpkgs.flake.source&query=nixpkgs.flake.source
[managing dependencies]: https://nix.dev/guides/recipes/dependency-management#managing-nixos-configurations
[`builtins.fetchTree`]: https://noogle.dev/f/builtins/fetchTree
[`fetch-tree`]: https://nix.dev/manual/nix/stable/development/experimental-features#xp-feature-fetch-tree
[`nix run`]: https://nix.dev/manual/nix/stable/command-ref/new-cli/nix3-run.html

[^emulated]: `nix run github:NixOS/nixpkgs#hello` for non-flake projects may look like `nix-shell -p '(import (builtins.fetchTree "github:NixOS/nixpkgs").outPath { }).hello' --run 'hello'`.
A drop-in command `nix-run` using the `nix run` syntax could be defined using a Bash alias like `alias nix-run='run() { $(nix-instantiate --raw --impure --eval --expr "(import <nixpkgs> {}).lib.getExe (import (builtins.fetchTree \"$(cut -d "#" -f 1 <<< "$1")\").outPath { }).$(cut -d "#" -f 2 <<< "$1")"); }; run'`.

### Dependency management

Flakes' `inputs` attribute can manage dependencies.
By default this handles recursive dependencies implicitly.
In case a library is used multiple times, this can give different versions of the same library.
You can override these if you want using `follows` statements:

```
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
}
```

This way, Home Manager's inputs reuse your chosen `nixpkgs`.

If you don't want to load a dependency, you can also disable it.
In the above example, that could look like `inputs.home-manager.inputs.nixpkgs = null;`.

Pros:

- Make it easy to reproduce published software, following the versions they used.
- You can override recursive inputs.

Cons:

- Flakes by default follow versions from dependencies' `flake.lock`, so if you don't override these with `follows`, you may get:
  - multiple versions of the same dependency.
  - outdated dependencies, if their versions are not actively updated.
- Dependencies are fetched eagerly, loading dependencies you may not use.
- Dependencies managed by flake inputs are hard to override if you don't also use flakes.
- If your flake is used as a library, you need to add `follows` statements for all recursive inputs.
  Otherwise downstream consumers cannot add their `follows` on your indirect inputs.

Alternatives:

- Handle dependencies with [`npins`].
- Handle dependencies inline using functions such as the [fetchers] or [`builtins.fetchTree`].

[fetchers]: https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers
[`flake-inputs`]: https://github.com/fricklerhandwerk/flake-inputs
[`npins`]: https://nix.dev/guides/recipes/dependency-management.html

### Flake-only Nix

As flakes (largely[^subset]) use Nix as an internal language, you could even place all Nix code in flake files.
In the community, such a coding style is called dendritic pattern.
Using flakes, this pattern gets easier with library [`flake-parts`](https://github.com/hercules-ci/flake-parts),
which lets you spread code over different flake-like files.

Pros:

- Helps use flakes' schema and inputs from any such Nix code.

Cons:

- Makes it harder to access this code without using flakes.

Alternatives:

- Use flakes as thin wrappers over existing Nix code, so code can be used in both ways.
- Use library [`flake-compat`] to expose a flake's default package or shell to non-flake users.
- Propagate needed parameters across modules explicitly or with NixOS's [`specialArgs`].

[`flake-compat`]: https://github.com/NixOS/flake-compat
[`specialArgs`]: https://nixos.org/manual/nixos/unstable/options#opt-_module.args

### History

- Conception
  - Flakes were proposed in [RFC 49], and introduced in a [blog post].
- Design
  - The flakes proposal was criticised for trying to solve too many problems at once and at the wrong abstraction layer.
  - The design still has [various problems] including around versioning, composability, cross-compilation, and tight coupling with nixpkgs.
  - There are also still many [open design questions] around the `nix` CLI.
- Implementation
  - There are still [problems with the implementation].
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

[RFC 49]: https://github.com/NixOS/rfcs/pull/49
[blog post]: https://tweag.io/blog/2020-05-25-flakes/
[various problems]: https://wiki.lix.systems/books/lix-contributors/page/flakes-feature-freeze#bkmrk-design-issues-of-fla
[open design questions]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Anew-cli+sort%3Areactions-%2B1-desc
[problems with the implementation]: https://github.com/NixOS/nix/issues?q=is%3Aissue+is%3Aopen+label%3Aflakes+sort%3Areactions-%2B1-desc
[consolidated the featureset]: https://wiki.lix.systems/books/lix-contributors/page/flake-stabilisation-proposal

## Further reading

- [wiki article](https://wiki.nixos.org/wiki/Flakes)
- [Flakes aren't real and cannot hurt you: a guide to using Nix flakes the non-flake way](https://jade.fyi/blog/flakes-arent-real/) (Jade Lovelace, January 2024)
- [Nix Flakes is an experiment that did too much at once...](https://samuel.dionne-riel.com/blog/2023/09/06/flakes-is-an-experiment-that-did-too-much-at-once.html) ([comments](https://discourse.nixos.org/t/nix-flakes-is-an-experiment-that-did-too-much-at-once/32707)) (Samuel Dionne-Riel, September 2023)
- [Experimental does not mean unstable](https://determinate.systems/posts/experimental-does-not-mean-unstable) ([comments](https://discourse.nixos.org/t/experimental-does-not-mean-unstable-detsyss-perspective-on-nix-flakes/32703)) (Graham Christensen, September 2023)
- [The Nix Hour: comparing flakes to traditional Nix](https://www.youtube.com/watch?v=atmoYyBAhF4) (Silvan Mosberger, November 2022)
