<img alt="CI"
     src="https://github.com/nix-dot-dev/nix.dev/workflows/CI/badge.svg">

# [nix.dev](https://nix.dev)

Official documentation for getting things done with Nix.

## Contributing

Content is written in MyST, a superset of CommonMark. For its syntax, see the [MyST docs](https://myst-parser.readthedocs.io/en/latest/syntax/typography.html#syntax-core).

For contents and style see [contribution guide](CONTRIBUTING.md).

## Local preview

Run `nix-shell --run devmode` and open a browser at <http://localhost:5500>.

As you make changes your browser should auto-reload within a few seconds.

To manually test [redirects](./_redirects):

```console
nix-shell -p netlify-cli --run "cd result; netlify dev"
```
