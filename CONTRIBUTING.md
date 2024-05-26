# Contributing to nix.dev

nix.dev is a community effort to collect, create, and maintain world-class learning resources for Nix.

We strongly encourage everyone interested to participate:
- Make a [pull request](https://github.com/NixOS/nix.dev/pulls) if you want to introduce an incremental change.
- Open an [issue](https://github.com/NixOS/nix.dev/issues) if you want to discuss a significant change before starting to work on it.

Please read our [contributor guide](https://nix.dev/contributing/documentation) for more details.

## Local preview

Enter the development environment with `nix-shell`, or [set up direnv](https://nix.dev/guides/recipes/direnv.html)` and run `direnv allow`, and then:

```shell-session
[nix-shell:nix.dev]$ devmode
```

and open a browser at <http://localhost:5500>.

As you make changes, your browser should auto-reload within a few seconds.

To manually test [redirects](./_redirects):

```shell-session
[nix-shell:nix.dev]$ nix-build -A build
[nix-shell:nix.dev]$ netlify dev -d result
```

## Updating reference manuals

With the current setup, the [Nix manual hosted on nix.dev](https://nix.dev/reference/nix-manual) does not get updated automatically with new releases.
The following manual steps are required:

```shell-session
nix-shell --run update-nixpkgs-releases
nix-shell --run update-nix-releases
```
