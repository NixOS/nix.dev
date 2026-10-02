# Contributing

Open a [pull request](https://github.com/NixOS/nix.dev/pulls) to contribute.
Open an [issue](https://github.com/NixOS/nix.dev/issues) to discuss a larger change before you start work.

Read the [documentation contributor guide](https://nix.dev/contributing/documentation) before you write or review documentation.

When you work on documentation, confirm that your change follows the [Nixpkgs style guide](https://github.com/NixOS/nixpkgs/blob/master/doc/styleguide.md).

## Contribute to docs.nixos.org

The [nix.dev](https://nix.dev) site is the current documentation site.
The [docs.nixos.org](https://docs.nixos.org/) site is an Astro-based prototype for Nix, NixOS, and Nixpkgs documentation in one place.

| Topic          | nix.dev                                     | docs.nixos.org                                |
| -------------- | ------------------------------------------- | --------------------------------------------- |
| Status         | Current documentation site                  | In development. Expect breaking changes.      |
| Purpose        | Learning and task-focused Nix documentation | Unified Nix, NixOS, and Nixpkgs documentation |
| Site generator | Sphinx                                      | Astro                                         |

Some guides are available in the [nix.dev](https://github.com/NixOS/nix.dev) repository itself.
However, [nix.dev](https://nix.dev) also links to the Nix, Nixpkgs, and NixOS manuals, which can contain additional guides and reference material.

[docs.nixos.org](https://docs.nixos.org/) aims to provide one documentation site with search across Nix, Nixpkgs, and NixOS.

The [site](site/) directory contains the source for [docs.nixos.org](https://docs.nixos.org/).

Install its dependencies:

```shell
nix-shell .
cd site
npm install
```

Start the development server:

```shell
npm run dev
```

## Preview nix.dev locally

Run the development server to preview your changes:

```shell
nix-shell --run devmode
```

Open <http://localhost:8080> in your browser.
The browser reloads when you save a change.

To enter the development environment automatically, [set up direnv](https://nix.dev/guides/recipes/direnv.html) and run:

```shell
direnv allow
```

## Test redirects

Build the site:

```shell
nix-build --attr build
```

Start Netlify's local server to test [redirects](./_redirects):

```shell
netlify dev --dir result
```

## Build the reference manuals

The default build does not include versioned Nix reference manuals. Include them when you change the manuals or their integration:

```shell
nix-build --attr build --arg withManuals true
```

Run the development server with the manuals:

```shell
nix-shell --arg withManuals true --run devmode
```

## Update the reference manuals

Run these commands to add the current Nix and Nixpkgs releases to nix.dev:

```shell
nix-shell --run update-nixpkgs-releases
nix-shell --run update-nix-releases
```
