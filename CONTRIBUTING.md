# Contributing

Open a [pull request][pull-requests] to contribute.
Open an [issue][issues] to discuss a larger change before you start work.

Read the [documentation contributor guide][documentation-contributor-guide] before you write or review documentation.

When you work on documentation, confirm that your change follows the [Nixpkgs style guide][nixpkgs-style-guide].

## Contribute to docs.nixos.org

[nix.dev][nix-dev] is the current documentation site.
[docs.nixos.org][docs-nixos-org] is an Astro-based prototype for Nix, NixOS, and Nixpkgs documentation in one place.

| Topic          | nix.dev                                     | docs.nixos.org                                |
| -------------- | ------------------------------------------- | --------------------------------------------- |
| Status         | Current documentation site                  | In development. Expect breaking changes.      |
| Purpose        | Learning and task-focused Nix documentation | Unified Nix, NixOS, and Nixpkgs documentation |
| Site generator | Sphinx                                      | Astro                                         |

Some guides are available in the [nix.dev][repository] repository itself.
However, [nix.dev][nix-dev] also links to the Nix, Nixpkgs, and NixOS manuals, which can contain additional guides and reference material.

[docs.nixos.org][docs-nixos-org] aims to provide one documentation site with search across Nix, Nixpkgs, and NixOS.

The [site][site] directory contains the source for [docs.nixos.org][docs-nixos-org].

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

## Preview nix.dev Locally

Run the development server to preview your changes:

```shell
nix-shell --run devmode
```

Open [http://localhost:8080][local-preview] in your browser.
The browser reloads when you save a change.

To enter the development environment automatically, [set up direnv][direnv] and run:

```shell
direnv allow
```

## Test Redirects

Build the site:

```shell
nix-build --attr build
```

Start Netlify's local server to test [redirects][redirects]:

```shell
netlify dev --dir result
```

## Build the Reference Manuals

The default build does not include versioned Nix reference manuals. Include them when you change the manuals or their integration:

```shell
nix-build --attr build --arg withManuals true
```

Run the development server with the manuals:

```shell
nix-shell --arg withManuals true --run devmode
```

## Update the Reference Manuals

Run these commands to add the current Nix and Nixpkgs releases to nix.dev:

```shell
nix-shell --run update-nixpkgs-releases
nix-shell --run update-nix-releases
```

[direnv]: https://nix.dev/guides/recipes/direnv.html
[docs-nixos-org]: https://docs.nixos.org/
[documentation-contributor-guide]: https://nix.dev/contributing/documentation
[issues]: https://github.com/NixOS/nix.dev/issues
[local-preview]: http://localhost:8080
[nix-dev]: https://nix.dev
[nixpkgs-style-guide]: https://github.com/NixOS/nixpkgs/blob/master/doc/styleguide.md
[pull-requests]: https://github.com/NixOS/nix.dev/pulls
[redirects]: ./_redirects
[repository]: https://github.com/NixOS/nix.dev
[site]: site/
