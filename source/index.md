---
myst:
  html_meta:
    "description lang=en": "Opinionated guides to getting things done in the Nix ecosystem."
    "keywords": "Nix, Nixpkgs, NixOS, Linux, build systems, deployment, packaging, declarative, reproducible, immutable, software, developer"
    "property=og:locale": "en_GB"
---


# Welcome to nix.dev

nix.dev is the home of official documentation for the Nix ecosystem, it contains:

::::{grid} 2
:::{grid-item-card} Tutorials
:text-align: center
Series of lessons to get started
:::

:::{grid-item-card} Recipes
:text-align: center
Guides to getting things done
:::
::::

::::{grid} 2
:::{grid-item-card} Reference
:text-align: center
Collections of detailed technical descriptions 
:::

:::{grid-item-card} Concepts
:text-align: center
Explanations of history and ideas in the Nix ecosystem
:::
::::

If you're new to the Nix ecosystem, begin your journey with {ref}`First Steps <first-steps>`!

## What can you do with Nix?

The following illustrate of what can be achieved with the Nix ecosystem:

- {ref}`Reproducible development environments <ad-hoc-envs>`.
- Easy installation of software over URLs.
- Easy transfer of software environments between computers.
- {ref}`Declarative specification of Linux machines <deploying-nixos-using-terraform>`.
- {ref}`Reproducible integration testing using virtual machines <integration-testing-vms>`.
- Avoidance of version conflicts with already installed software.
- Installing software from source code.
- {ref}`Transparent build caching using binary caches <github-actions>`.
- Strong support for software auditability.
- {ref}`First-class cross compilation support <cross-compilation>`.
- Remote builds.
- Remote deployments.
- Atomic upgrades and rollbacks.

## What is the origin of the name "Nix"?

> The name *Nix* is derived from the Dutch word niks, meaning *nothing*;
> build actions do not see anything that has not been explicitly declared as an input.
>
> &mdash; <cite>[Nix: A Safe and Policy-Free System for Software Deployment](https://www.semanticscholar.org/paper/Nix%3A-A-Safe-and-Policy-Free-System-for-Software-Dolstra-Jonge/76eb395afe54d526797f6e12ce1c4fa14cda253f?p2df)</cite>

```{toctree}
:glob:
:caption: Tutorials
:maxdepth: 1
:hidden:

tutorials/install-nix.md
tutorials/first-steps/index.md
tutorials/nixos/index.md
tutorials/cross-compilation.md
```

```{toctree}
:glob:
:caption: Recipes
:maxdepth: 1
:hidden:

recipes/*
templates/*
```

```{toctree}
:glob:
:caption: Reference
:maxdepth: 1
:hidden:

Nix Reference Manual <https://nixos.org/manual/nix/stable/>
Nixpkgs Manual <https://nixos.org/manual/nixpkgs/stable/>
NixOS Manual <https://nixos.org/manual/nixos/stable/>
reference/pinning-nixpkgs.md
reference/glossary.md
recommended-reading.md
influences.md
```

```{toctree}
:glob:
:caption: Concepts
:maxdepth: 1
:hidden:
concepts/*
```

```{toctree}
:glob:
:caption: Contributing
:maxdepth: 1
:hidden:

contributing/how-to-contribute.md
contributing/how-to-get-help.md
contributing/documentation.md
contributing/writing-a-tutorial.md
contributing/writing-style.md
```

```{toctree}
:glob:
:caption: Acknowledgments
:maxdepth: 1
:hidden:

acknowledgments/sponsors.md
```
