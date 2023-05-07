---
myst:
  html_meta:
    "description lang=en": "Opinionated guides to getting things done in the Nix ecosystem."
    "keywords": "Nix, NixOS, packaging, Linux, deployment, build systems, reproducible, developer"
    "property=og:locale": "en_US"
---


# Welcome to nix.dev

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

```{toctree}
:glob: true
:maxdepth: 1

tutorials/index.md
templates/index.md
anti-patterns/index.md
recommended-reading.md
influences.md
```

```{toctree}
:glob:
:caption: Recipes
:maxdepth: 1
:hidden:

recipes/caches.md
recipes/nix-store.md
recipes/faq.md
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
```
