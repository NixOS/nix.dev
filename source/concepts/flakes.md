(flakes)=
# Flakes

What is usually referred to as "flakes" is:
- A policy for managing dependencies between {term}`Nix expressions<Nix expression>`.
- An [experimental feature] in Nix, implementing that policy and supporting functionality.

[experimental feature]: https://nix.dev/manual/nix/2.18/contributing/experimental-features.html

Technically, a [flake](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-flake.html#description) is a file system tree that contains a file named `flake.nix` in its root directory.

Flakes add the following behavior to Nix:

1. A `flake.nix` file offers a uniform [schema](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-flake.html#flake-format) , where:
   - Other flakes can be referenced as dependencies providing {term}`Nix language` code or other files.
   - The values produced by the {term}`Nix expression`s in `flake.nix` are structured according to pre-defined use cases.

1. References to other flakes can be specified using a dedicated [URL-like syntax](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-flake.html#flake-references).
   A [flake registry] allows using symbolic identifiers for further brevity.
   References can be automatically locked to their current specific version and later updated programmatically.

   [flake registry]: https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix3-registry.html

1. A [new command line interface], implemented as a separate experimental feature, leverages flakes by accepting flake references in order to build, run, or deploy software defined as a flake.

   [new command line interface]: https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix.html

Nix handles flakes differently than regular {term}`Nix file`s in the following ways:

- The `flake.nix` file is checked for schema validity.

  In particular, the metadata fields cannot be arbitrary Nix expressions.
  This is to prevent complex, possibly non-terminating computations while querying the metadata.

- The entire flake directory is copied to Nix store before evaluation.

  This allows for effective evaluation caching, which is relevant for large expressions such as Nixpkgs, but also requires copying the entire flake directory again on each change.

- No external variables, parameters, or impure language values are allowed.

  It means full reproducibility of a Nix expression, and, by extension, the resulting build instructions by default, but also prohibits parameterisation of results by consumers.

