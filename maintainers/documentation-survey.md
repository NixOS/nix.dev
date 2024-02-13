# Documentation survey

The documentation team is currently carrying out a documentation survey in this page.
Its purpose is to provide overview of the types, topics, and volume of existing documentation resources and inform future work.

## Contributing

We would love for you to get involved.
Here is how you can help:

- If you know of a documentation resource that isn't listed yet, make a pull request to add it.
- Alternatively pick an item in the Documentation Survey that has no summary yet.

Work though the linked resource and add a summary and other metadata in a pull request.
Your change should add details to one bullet point, following the specified format.

When dealing with a larger resource like the [Nixpkgs manual](https://nixos.org/manual/nixpkgs), pick smaller pieces such as chapters.

## Metadata

To better navigate the material and judge its relevance, every entry should provide
- Title (URL)
- Brief summary
- Video length or estimated reading time
- Principal Author(s)
- Year created (last update or maintenance status)

## Tutorials

### Nix

- [Nix Pills Chapter 3: Enter the Environment](https://nixos.org/guides/nix-pills/enter-environment.html)

  Installation with `nix-env`, rollback and switching generations, showing references and closures.

  - Reading time: 7 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- [Nix Pills Chapter 6. Our First Derivation](https://nixos.org/guides/nix-pills/our-first-derivation.html)

  Fundamentals of Nix derivations, function and concept, `nix show-derivation`. Derivation set and its attributes.
  - Reading time: 20 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- [Nix Pills Chapter 7. Working Derivation](https://nixos.org/guides/nix-pills/working-derivation.html)

  Fundamentals of Nix derivations, bash, `nix repl`, `nix-store`,  `nix-instantiate`, `nix show-derivation` . Packaging a simple C program, `inherit` keyword.
  - Reading time: 16 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- [Nix Pills Chapter 11. Garbage Collector](https://nixos.org/guides/nix-pills/garbage-collector.html)

  Fundamentals of Nix garbage collection, `nix-collect-garbage`, `nix-env`, `nix-store`,  `nix-build`.
  - Reading time: 14 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- https://nixos.org/guides/nix-pills/nix-search-paths.html

- [Nix Pills Chapter 18. Nix Store Paths](https://nixos.org/guides/nix-pills/nix-store-paths.html)

  Store paths and how they are computed, `nix-store`, `nix-hash`, `nix derivation show`, `nix repl`.
  - Reading time: 6 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

### Nix language

- https://learnxinyminutes.com/docs/nix/
- https://nixcloud.io/tour/?id=1
- https://medium.com/@MrJamesFisher/nix-by-example-a0063a1a4c55
- https://www.youtube.com/watch?v=eCapIx9heBw&list=PL-saUBvIJzOkjAw_vOac75v-x6EzNzZq-&index=5
- https://nixos.org/guides/nix-pills/basics-of-language.html

- [Nix Pills Chapter 4. The basics of the language](https://nixos.org/guides/nix-pills/basics-of-language.html)

  Fundamentals of Nix language, types, expressions `nix repl`.
  - Reading time: 16 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- https://nixos.org/guides/nix-pills/functions-and-imports.html

### Nixpkgs

- https://www.youtube.com/watch?v=SGekN4pDExY&list=PL-saUBvIJzOkjAw_vOac75v-x6EzNzZq-&index=6
- https://www.youtube.com/watch?v=m4sv2M9jRLg
- https://nixos.org/guides/nix-pills/generic-builders.html
- [Nix Pills Chapter 8. Generic Builders](https://nixos.org/guides/nix-pills/generic-builders.html)

  Generalized building process (C language), `derivation`, `nix repl`, `nix-build`.
  - Reading time: 14 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- https://nixos.org/guides/nix-pills/automatic-runtime-dependencies.html
- https://nixos.org/guides/nix-pills/developing-with-nix-shell.html

- [Nix Pills Chapter 10. Developing with nix-shell](https://nixos.org/guides/nix-pills/developing-with-nix-shell.html)

  Making a development environment from a derivation that can be launched with `nix-shell`, `builtins.derivation`.
  - Reading time: 9 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- https://nixos.org/guides/nix-pills/inputs-design-pattern.html
- https://nixos.org/guides/nix-pills/callpackage-design-pattern.html
- https://nixos.org/guides/nix-pills/override-design-pattern.html
- https://nixos.org/guides/nix-pills/nixpkgs-parameters.html
- https://nixos.org/guides/nix-pills/nixpkgs-overriding-packages.html
- https://nixos.org/guides/nix-pills/fundamentals-of-stdenv.html
- https://nixos.org/guides/nix-pills/basic-dependencies-and-hooks.html

### NixOS

- https://www.youtube.com/watch?v=jf0nIn2oS8A&list=PL-saUBvIJzOkjAw_vOac75v-x6EzNzZq-&index=4

## How-to guides

### Nix

- https://nix.dev/tutorials/ad-hoc-developer-environments#what-is-a-shell-environment
- https://nixos.wiki/wiki/Nix_Cookbook#Managing_storage

### Nix language

- https://nix.dev/anti-patterns/language.html

### Nixpkgs

- https://nixos.wiki/wiki/FAQ
- https://www.youtube.com/watch?v=D_IZ2EfW_8U
- https://www.youtube.com/watch?v=5K_2RSjbdXc
- https://www.youtube.com/watch?v=dGAL3gMXvug
- https://nix.dev/tutorials/towards-reproducibility-pinning-nixpkgs
- https://nix.dev/tutorials/declarative-and-reproducible-developer-environments
- https://nix.dev/tutorials/cross-compilation.html
- https://nixos.org/manual/nixpkgs/stable

### NixOS

- https://nix.dev/tutorials/building-bootable-iso-image.html
- https://nix.dev/tutorials/deploying-nixos-using-terraform.html
- https://nix.dev/tutorials/installing-nixos-on-a-raspberry-pi.html
- https://www.youtube.com/watch?v=bkDYmvKINm8
- https://www.youtube.com/watch?v=Zi_vbddNXtg
- https://github.com/noteed/nix-notes
- https://nixos.org/manual/nixos/stable/

## Explanation

### Nix

- https://nixos.org/guides/nix-pills/index.html
- partially in chapter https://nixos.org/guides/nix-pills/automatic-runtime-dependencies.html
- https://nixos.org/guides/nix-pills/garbage-collector.html
- https://edolstra.github.io/pubs/phd-thesis.pdf

### Nix language

- https://edolstra.github.io/pubs/phd-thesis.pdf

  Chapter 1:
    Existing software deployment models and issues faced with them; motivation for developing Nix, features of the Nix deployment system

  - Reading time: 15 min
  - Author: Eelco Dolstra
  - Created: 2006

  Chapter 2:

    2.1: The Nix Store, isolation of components, cryptographic hashes, non-destructive upgrades, prevention of undeclared dependencies, closures

    2.2: Use of Nix expressions to build software, structure of Nixpkgs collection, Hello and SUbversion as examples of derivations.

    2.3: Package Management: Installations, updates and rollbacks, user environments, uninstalling, garbage collection

    2.4: Store derivations: Definition, `.drv` files in Nix store. `nix-instantiate`, `nix-store --realise`. Allows various deployment policies, including source and binary.

    2.5. Deployment models. Mechanisms `nix-instantiate` and `nix-store`. Models: Manual download; vesion management system; channels; one-click installation

    2.6: Transparent source/binary deployment: `nix-push` and `nix-pull`. Pre-built substitutes.

    - Reading time: 30 min

  Chapter 3:
    Relates deployment issues to memory management issues in programming languages. Relates files to objects in memory. Describes closures, discusses pointer discipline and conservative garbage collection, shows that persistence is achieved by cryptographic hashes.

  - Reading time: 25 min

  Chapter 4:
    The Nix language: Functional languages; lazy languages. Lexical syntax of Nix language. Semantics: Basic and compound values, substitutions, function calls, conditionals, assertions, `with`, operators, evaluation rules. Implementation using ATerm library.

  - Reading time: 60 min

  Chapter 5:
    Extensional vs intensional. The Nix extensional model: cryptographic hashing; file system objects and the Nix store; adding atomic values to the store; translating Nix expressions to derivations; garbage collection

  - Reading time: 60 min

### Nixpkgs

- [Nix Pills Chapter 6: Our First Derivation](https://nixos.org/guides/nix-pills/our-first-derivation.html)

  Explains derivations; the derivation function, its attribute set, `.drv` and 'out' files. Explains `outpath`. Regarding `nixpkgs`, shows how to bring `nixpkgs` into scope and how to refer to a package using its `outpath`. Accessing files underneath a package's `out`.

  - Reading time: 25 min
  - Author: Luca Bruno
  - Created: 2015
  - Updated 2017

- [Nix Pills Chapter 7: Working Derivation](https://nixos.org/guides/nix-pills/working-derivation.html)

  Creating a working derivation. Using `nix repl`: `bash` as a builder; the `args` attribute; creating in `$out`; the builder environment; packaging a C program. Using a `.nix` file to define the derivation: `import` function; `inherit` keyword; using `nix-build`. Explains how to use `gcc`, `bash` and `coreutils` from nixpkgs.
  - Reading time: 15 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)

- https://nixos.org/guides/nix-pills/inputs-design-pattern.html

  Explains the `inputs` design pattern as used by `nixpkgs`. A single customizable repository having a top-level Nix expression, with one expression for each package.

  - Reading time: 20 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)


- https://nixos.org/guides/nix-pills/callpackage-design-pattern.html

  Introduces the `callPackage` pattern used extensively in Nixpkgs. Shows how to write and use the function; use `builtins.functionArgs` to determine arguments, use `builtins.intersectAttrs` to combine attributes, and override arguments when needed.

  - Reading time: 15 min
  - Author: Luca Bruno
  - Created: 2015 (effectively unmaintained since 2017)


- partially in https://edolstra.github.io/pubs/phd-thesis.pdf

- [Connecting Bash to Nix](https://www.zombiezen.com/blog/2023/03/connecting-bash-to-nix/)

  Configure derivation using only Bash and `builtins`. Explains `builtins.derivation`, attributes, `nix build`, store path hierarchy, imports.
  Relates this to `stdenv.mkDerivation.
  - Reading time: 10 min
  - Author: Ross Light
  - Created: 2023

### NixOS
- https://nixos.org/docs/SCR-2005-091.pdf (2006)

## Reference

### Nix

- https://nix.dev/manual/nix/2.18/command-ref/command-ref.html
- https://edolstra.github.io/pubs/phd-thesis.pdf

### Nix language

- https://edolstra.github.io/pubs/phd-thesis.pdf
- https://nix.dev/manual/nix/2.18/expressions/writing-nix-expressions.html
- https://github.com/tazjin/nix-1p

### Nixpkgs

- https://nixos.org/manual/nixpkgs/stable

### NixOS
- https://nixos.org/manual/nixos/stable
