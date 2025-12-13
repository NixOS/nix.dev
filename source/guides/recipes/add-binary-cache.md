(custom-binary-cache)=
# Configure Nix to use a custom binary cache

Nix can be configured to use a binary cache with the [`substituters`](https://nix.dev/manual/nix/latest/command-ref/conf-file.html#conf-substituters) and [`trusted-public-keys`](https://nix.dev/manual/nix/latest/command-ref/conf-file.html#conf-trusted-public-keys) settings, either exclusively or in addition to cache.nixos.org.

:::{tip}
Follow the tutorial to [set up an HTTP binary cache](setup-http-binary-cache) and create a key pair for signing store objects.
:::

For example, given a binary cache at `https://example.org` with public key `My56...Q==%`, and some derivation in `default.nix`, make Nix exclusively use that cache once by passing [settings as command line flags](https://nix.dev/manual/nix/latest/command-ref/conf-file#command-line-flags):

```shell-session
$ nix-build --substituters https://example.org --trusted-public-keys example.org:My56...Q==%
```

To permanently configure trying the custom cache before the public cache, add it as `extra-substiters` with lower `priority` value to the [Nix configuration file](https://nix.dev/manual/nix/latest/command-ref/conf-file#configuration-file):

```shell-session
$ echo "extra-substituters = https://example.org?priority=30" >> /etc/nix/nix.conf
$ echo "extra-trusted-public-keys = example.org:My56...Q==%" >> /etc/nix/nix.conf
```

To always use only the custom cache:

```shell-session
$ echo "substituters = https://example.org" >> /etc/nix/nix.conf
$ echo "trusted-public-keys = example.org:My56...Q==%" >> /etc/nix/nix.conf
```

::::{admonition} NixOS
On NixOS, Nix is configured through the [`nix.settings`](https://search.nixos.org/options?show=nix.settings) option:

```nix
{ ... }: {
  nix.settings = {
    substituters = [ "https://example.org?priority=30" ];
    trusted-public-keys = [ "example.org:My56...Q==%" ];
  };
}
```
::::

:::{tip}
Use [remote build machines](distributed-build-setup-tutorial) as preferred binary caches to reduce your external traffic.
:::
