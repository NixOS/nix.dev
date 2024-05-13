# Configure Nix to use a custom binary cache

Nix can be configured to use a binary cache with the [`substituters`](https://nix.dev/manual/nix/2.21/command-ref/conf-file.html#conf-substituters) and [`trusted-public-keys`](https://nix.dev/manual/nix/2.21/command-ref/conf-file.html#conf-trusted-public-keys) settings, either in addition to <cache.nixos.org> or exclusively.

For example, given a binary cache at `https://example.org` with public key `My56...Q==%`, and some derivation in `default.nix`, make Nix exclusively use that cache once by passing [settings as command line flags](https://nix.dev/manual/nix/2.21/command-ref/conf-file#command-line-flags):

```shell-session
$ nix-build --option substituters https://example.org --option trusted-public-keys example.org:My56...Q==%
```

To permanently use the custom cache in addition to the public cache, add to the [configuration file](https://nix.dev/manual/nix/2.21/command-ref/conf-file#configuration-file):

```shell-session
$ echo "extra-substituters = https://example.org" >> /etc/nix/nix.conf
$ echo "extra-trusted-public-keys = example.org:My56...Q==%" >> /etc/nix/nix.conf
```

To always use nothing but the custom cache:

```shell-session
$ echo "substituters = https://example.org" >> /etc/nix/nix.conf
$ echo "trusted-public-keys = example.org:My56...Q==%" >> /etc/nix/nix.conf
```

::::{admonition} NixOS
On NixOS, Nix is configured through the [`nix.settings`](https://search.nixos.org/options?show=nix.settings) option:

```nix
{ ... }: {
  nix.settings = {
    substituters = [ "https://example.org" ];
    trusted-public-keys = [ "example.org:My56...Q==%" ];
  };
}
```
::::
