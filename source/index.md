---
myst:
  html_meta:
    "description lang=en": "Official documentation for getting things done with Nix."
    "keywords": "Nix, Nixpkgs, NixOS, Linux, build systems, deployment, packaging, declarative, reproducible, immutable, software, developer"
    "property=og:locale": "en_GB"
---


# Welcome to nix.dev

nix.dev is the home of official documentation for the Nix ecosystem.

If you're new here, {ref}`install Nix <install-nix>` and begin your journey with our tutorial series!

::::{grid} 2
:::{grid-item-card} Tutorials
:link: tutorials
:link-type: ref
:text-align: center

Series of lessons to get started
:::

:::{grid-item-card} Guides
:link: guides
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


## Who is Nix for?

Nix is a tool for people who both need computers to do exactly as intended, repeatably, far into the future, and who are familiar with command line interfaces and plain text editors.

You don't have to be a professional software developer and you don't need formal education in informatics to greatly benefit from Nix.
However, experience with complex software projects and knowing some informatics helps with appreciating why it's useful and how it works.
And it helps with learning how to use it effectively and [how to make improvements](how-to-contribute).

You probably won't want to go back to a world without Nix if you're a:

- Full-stack or back-end developer
- Test engineer
- Embedded systems developer
- DevOps engineer
- System administrator
- Data scientist
- Natural scientist
- Student of a technical field
- Open source software enthusiast


```{toctree}
:hidden:

install-nix.md
tutorials/index.md
guides/index.md
reference/index.md
concepts/index.md
contributing/index.md
acknowledgments/index.md
```
