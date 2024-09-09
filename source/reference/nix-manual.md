---
myst:
  html_meta:
    "description lang=en": "Nix reference manual version overview"
    "keywords": "Nix, reference, manual, documentation"
---

(nix-manual)=
# Nix reference manual

<!--
This page is pre-processed before rendering with Sphinx. For details:

    grep -n nix-manual.md default.nix
-->

```{toctree}
:hidden:

Nix pre-release (development) <https://nix.dev/manual/nix/development/>
Nix @nix-latest@ (latest) <https://nix.dev/manual/nix/latest/>
Nix @nix-rolling@ (in Nixpkgs rolling) <https://nix.dev/manual/nix/rolling/>
Nix @nix-stable@ (in Nixpkgs @nixpkgs-stable@) <https://nix.dev/manual/nix/stable/>
Nix @nix-prev-stable@ (in Nixpkgs @nixpkgs-prev-stable@) <https://nix.dev/manual/nix/prev-stable/>
```

The Nix reference manual is available for multiple versions:

- [Nix pre-release](https://nix.dev/manual/nix/development/)

  Development build from the `master` branch of the [Nix repository](https://github.com/NixOS/nix)

- [Nix @nix-latest@](https://nix.dev/manual/nix/latest/) ([single page](https://nix.dev/manual/nix/latest/nix-@nix-latest@.html))

  Latest Nix release

- [Nix @nix-rolling@](https://nix.dev/manual/nix/rolling/) ([single page](https://nix.dev/manual/nix/rolling/nix-@nix-rolling@.html))

  Shipped with the rolling release of {term}`Nixpkgs` and {term}`NixOS`

- [Nix @nix-stable@](https://nix.dev/manual/nix/stable/) ([single page](https://nix.dev/manual/nix/stable/nix-@nix-stable@.html))

  Shipped with the current stable release of {term}`Nixpkgs` and {term}`NixOS`: @nixpkgs-stable@

- [Nix @nix-prev-stable@](https://nix.dev/manual/nix/prev-stable/) ([single page](https://nix.dev/manual/nix/prev-stable/nix-@nix-prev-stable@.html))

  Shipped with the previous stable release of {term}`Nixpkgs` and {term}`NixOS`: @nixpkgs-prev-stable@

:::{tip}
More information on Nixpkgs and NixOS releases: [](channel-branches)
:::
