(nix-recipes)=
# Nix

## How to add a new binary cache?

Using [NixOS (release v. ≥ 22.05)](https://nixos.org/blog/announcements#nixos-22.05):

```nix
nix.settings = {
  trusted-substituters = [ "https://cache.nixos.org" ];
  substituters = [ "https://cache.nixos.org" ];
};
```

Using [NixOS (release v. ≤ 21.11)](https://nixos.org/blog/announcements#nixos-21.11):

```nix
nix = {
  trustedBinaryCaches = [ "https://cache.nixos.org" ];
  binaryCaches = [ "https://cache.nixos.org" ];
};
```

Using [`Nix` (package manager)](https://nix.dev/install-nix.html):

```shell-session
$ echo "trusted-binary-caches = https://cache.nixos.org" >> /etc/nix/nix.conf
$ nix-build helpers/bench.nix --option extra-binary-caches https://cache.nixos.org
```
