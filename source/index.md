---
myst:
  html_meta:
    "description lang=en": "Official documentation for getting things done with Nix."
    "keywords": "Nix, Nixpkgs, NixOS, Linux, build systems, deployment, packaging, declarative, reproducible, immutable, software, developer"
    "property=og:locale": "en_GB"
---


# Welcome to nix.dev

nix.dev is the home of official documentation for the Nix ecosystem.

If you're new to Nix, begin your journey with {ref}`First Steps <first-steps>`!

::::{grid} 2
:::{grid-item-card} Tutorials
:link: tutorials
:link-type: ref
:text-align: center

Series of lessons to get started
:::

:::{grid-item-card} Recipes
:link: recipes
:link-type: ref
:text-align: center

Guides to getting things done
:::
::::

::::{grid} 2
:::{grid-item-card} Reference
:link: reference
:link-type: ref
:text-align: center

Collections of detailed technical descriptions 
:::

:::{grid-item-card} Concepts
:link: concepts
:link-type: ref
:text-align: center

Explanations of history and ideas in the Nix ecosystem
:::
::::

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


```{toctree}
:hidden:

tutorials/index.md
recipes/index.md
reference/index.md
concepts/index.md
contributing/index.md
acknowledgments/index.md
```
