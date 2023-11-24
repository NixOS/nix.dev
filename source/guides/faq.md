# Frequently Asked Questions

## Nix

### How do I add a new binary cache?

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

### How to operate between Nix paths and strings?

See <http://stackoverflow.com/a/43850372>

### How to build reverse dependencies of a package?

```shell-session
$ nix-shell -p nixpkgs-review --run "nixpkgs-review wip"
```

### How can I manage dotfiles in \$HOME with Nix?

See <https://github.com/nix-community/home-manager>

### What's the recommended process for building custom packages?

> E.g. if I git clone nixpkgs how do I use the cloned repo to define new / updated packages?

## NixOS

### How to build my own ISO?

See <http://nixos.org/nixos/manual/index.html#sec-building-image>

### How do I connect to any of the machines in NixOS tests?

Apply following patch:

```diff
diff --git a/nixos/lib/test-driver/test-driver.pl b/nixos/lib/test-driver/test-driver.pl
index 8ad0d67..838fbdd 100644
--- a/nixos/lib/test-driver/test-driver.pl
+++ b/nixos/lib/test-driver/test-driver.pl
@@ -34,7 +34,7 @@ foreach my $vlan (split / /, $ENV{VLANS} || "") {
     if ($pid == 0) {
         dup2(fileno($pty->slave), 0);
         dup2(fileno($stdoutW), 1);
-        exec "vde_switch -s $socket" or _exit(1);
+        exec "vde_switch -tap tap0 -s $socket" or _exit(1);
     }
     close $stdoutW;
     print $pty "version\n";
```

And then the vde_switch network should be accessible locally.

### How to bootstrap NixOS inside an existing Linux installation?

There are a couple of tools:

- <https://github.com/nix-community/nixos-anywhere>
- <https://github.com/jeaye/nixos-in-place>
- <https://github.com/elitak/nixos-infect>
- <https://github.com/cleverca22/nix-tests/tree/master/kexec>
