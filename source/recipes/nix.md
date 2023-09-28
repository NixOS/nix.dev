# Nix

## How do I add a new binary cache?

Using NixOS (≥ 22.05):

```nix
nix.settings = {
  trusted-substituters = [ "https://cache.nixos.org" ];
  substituters = [ "https://cache.nixos.org" ];
};
```

Using NixOS (≤ 21.11):

```nix
nix = {
  trustedBinaryCaches = [ "https://cache.nixos.org" ];
  binaryCaches = [ "https://cache.nixos.org" ];
};
```

Using `Nix`:

```shell-session
$ echo "trusted-binary-caches = https://cache.nixos.org" >> /etc/nix/nix.conf
$ nix-build helpers/bench.nix --option extra-binary-caches https://cache.nixos.org
```

## How do I force nix to re-check whether something exists at a binary cache?

Nix caches the contents of binary caches so that it doesn't have to query them
on every command. This includes negative answers (cache doesn't have something).
The default timeout for that is 1 hour as of writing.

To wipe all cache-lookup-caches:

```shell-session
$ rm $HOME/.cache/nix/binary-cache-v*.sqlite*
```

Alternatively, use the `narinfo-cache-negative-ttl` option to reduce the
cache timeout.

## How to operate between Nix paths and strings?

See <http://stackoverflow.com/a/43850372>

## How to build reverse dependencies of a package?

```shell-session
$ nix-shell -p nixpkgs-review --run "nixpkgs-review wip"
```

## How can I manage dotfiles in \$HOME with Nix?

See <https://github.com/nix-community/home-manager>

## What's the recommended process for building custom packages?

> E.g. if I git clone nixpkgs how do I use the cloned repo to define new / updated packages?
