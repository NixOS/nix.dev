---
myst:
  html_meta:
    "description lang=en": "Opinionated guides to getting things done in the Nix ecosystem."
    "keywords": "Nix, NixOS, packaging, Linux, deployment, build systems, reproducible, developer"
    "property=og:locale": "en_US"
---


# Welcome to nix.dev

:::{topic} **Introduction**
The Nix ecosystem is a DevOps toolkit to achieve:

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

This documentation supplements the official [Nix](http://nixos.org/nix/manual/),
[NixOS](http://nixos.org/nixos/manual/), [Nixpkgs](http://nixos.org/nixpkgs/manual/)
and [NixOps](http://nixos.org/nixops/manual/) manuals.
:::

```{toctree}
:glob: true
:maxdepth: 3

tutorials/index.rst
templates/index.rst
anti-patterns/index.rst
reference/index.rst
faq.rst
recommended-reading.rst
influences.rst
glossary.rst
contributing.rst
```
