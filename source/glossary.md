# Glossary

```{glossary}
Attribute sets
    Attribute sets represent a sorted collection of name/value pairs in the Nix
    language.

Channels
    Represents two things:
    1. Releases of nixpkgs built and pushed by Hydra. See
       <https://status.nixos.org>.
    2. GC roots that are managed by `nix-channel`.

Closure
    The closure is the tree of the dependencies of a derivation, and the
    dependencies of the depencencies recursively.

Derivation
    **Build recipe** described with Nix. It declares all the inputs and steps
    that will be used for the build.

Flakes
    Flakes it to Nix what NPM is to NodeJS. It's a dependency manager and
    central entry point to projects.

GC root
    A reference to a store entry that is used to protect it and all its
    dependencies from the garbage collector. The reference is represented as a
    sylink to a `/nix/store` entry and stored under `/nix/var/nix/gcroots/`.

Hydra
    **CI** system that is designed specifically for nixpkgs. The main instance
    lives at <https://hydra.nixos.org>.

Import From Derivation (IFD)
    The practice of reading the output of a built derivation during the Nix
    evaluation phase.
    It allows moving computation from eval to build time but also breaks the
    eval/build split in the process.

Nix
    Build system and package manager.

    Read /nɪks/

Nix language
    Programming language to declare packages and configurations for Nix. Also
    called nixlang or nixexpr.

Nix expression
    Expression written in the Nix language.

Nix modules
    Nix modules are what JSON Schema is to JSON. It's a library written in
    nix that adds types and merge semantic to a JSON-like tree structure.
    NixOS and other projects use this to declare their configurations.

Nix profile
    Per user GC roots. Those are typically set when using `nix-env` or
    `nixos-rebuild`.

Nix file
    File (`.nix`) containing a Nix expression.

Nixpkgs
    A git repository containing a collection of 80000+ packages. See
    <https://nixpkgs.org>.

    Read /nɪks ˈpækɪʤɪz/ ("Nix packages").

NixOS
    The name represents two things at the same time:

    1. The whole project and community.
    2. A Linux distribution built on top of nixpkgs.

Realization
    The act of building a derivation. The results are calls **build outputs**
    and appear in the `/nix/store`.

Repeatable
    A property of build systems. A repeatable build process is one that
    produces a valid result, regarless of time and machine. For a stronger
    guarantee, see "Reproducible".

Reproducible
    A property of build systems. A reproducible build inherits all the
    properties of a repeatable build. On top of those, it also guarantees that
    the binary output is exactly the same.

Substituter
    **Build cache** containing all the build output. The default one is
    <https://cache.nixos.org>. Companies generally set their own internal
    cache using <https://cachix.org> or using a S3 bucket.
```
