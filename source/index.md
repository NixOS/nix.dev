---
myst:
  html_meta:
    "description lang=en": "Official documentation for getting things done with Nix."
    "keywords": "Nix, Nixpkgs, NixOS, Linux, build systems, deployment, packaging, declarative, reproducible, immutable, software, developer"
    "property=og:locale": "en_GB"
---


# Welcome to nix.dev

nix.dev is the home of official documentation for the Nix ecosystem.
It is maintained by the [Nix documentation team](https://nixos.org/community/teams/documentation).

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

## What is Nix?

[Nix](https://github.com/NixOS/nix) allows treating Unix processes and file system operations as pure functions.

It is the basis of an ecosystem of exceptionally powerful tools.
[Nixpkgs](https://github.com/nixos/nixpkgs) is [the largest, most up-to-date software repository in the world](https://repology.org/repositories/graphs).
[NixOS](https://github.com/NixOS/nixpkgs/tree/master/nixos) is a Linux distribution that can be configured fully declaratively, with unmatched flexibility.

## How to use software from Nixpkgs

This is what you can do with software from Nixpkgs:
- Run **standalone programs** locally with Nix
- Use **libraries or tools** to build software with Nixpkgs
- Deploy **services** to machines running NixOS

In order to do that:
- [Install Nix on Linux or WSL](https://nix.dev/install-nix)

It will help you to go more quickly if you learn to:
- [Read the Nix language](https://nix.dev/tutorials/nix-language)
- [Package existing software with Nixpkgs](https://nix.dev/tutorials/packaging-existing-software)
- [Work with NixOS modules](https://nix.dev/tutorials/module-system/)
- [Run NixOS in virtual machines](https://nix.dev/tutorials/nixos/nixos-configuration-on-vm)
- [Provision remote NixOS machines via SSH](https://nix.dev/tutorials/nixos/provisioning-remote-machines)
- [Set up your own cache for sharing binaries](https://nix.dev/tutorials/nixos/binary-cache-setup)

## What else can you do with Nix?

The following list illustrates some examples of what can be achieved with the Nix ecosystem:
- {ref}`Reproducible development environments <ad-hoc-envs>`
- Easy installation of software over URLs and from source code
- Easy transfer of software environments between computers
- {ref}`Declarative specification of Linux machines <deploy-nixos-using-terraform>`
- {ref}`Reproducible integration testing using virtual machines <integration-testing-vms>`
- Avoidance of version conflicts with already installed software
- {ref}`Transparent build caching using binary caches <github-actions>`
- Strong support for software auditability
- {ref}`First-class cross compilation support <cross-compilation>`
- Remote builds
- Remote deployments
- Atomic upgrades and rollbacks

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
