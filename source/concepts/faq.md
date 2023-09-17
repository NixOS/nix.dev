# Frequently Asked Questions

## Should I enable flakes?

You have to judge for yourself based on your needs.

[Flakes](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake) and the [`nix`](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix) command suite bring multiple improvements that are relevant for both software users and package authors:

- The new command line interface, together with flakes, make dealing with existing packages significantly more convenient.
- The constraints imposed on flakes strengthen reproducibility by default, and enable various performance improvements when interacting with a large Nix package repository like {term}`Nixpkgs`.
- Flake references allow for easier handling of version upgrades for existing packages or project dependencies.
- The flake schema helps with composing Nix projects from multiple sources in an ordered fashion.

Other than that, and below the surface of the flake schema, Nix and the Nix language work exactly the same in both cases.
In principle, the same level of reproducibility can be achieved with or without flakes.
In particular, the process of adding software to {term}`Nixpkgs` or maintaining {term}`NixOS` modules and configurations is not affected by flakes at all.

Both paradigms have their own set of unique concepts and support tooling that have to be learned, with varying ease of use, implementation quality, and support status.
At the moment, neither the stable nor the experimental interface is clearly superior to the other in all aspects.
While flakes reduce complexity in some regards, they introduce additional concepts and you will have to learn more about the system to fully understand how it works.

There are downsides to relying on [experimental features](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-experimental-features) in general:

- Interfaces and behavior of experimental features could still be changed by Nix developers.
  This may require you to adapt your code at some point in the future, which will require more effort once it has grown in complexity.
  Currently there is no agreed-upon plan or timeline for stabilising flakes.
- The [Nix maintainer team](https://nixos.org/community/teams/nix.html) focuses on fixing bugs and regressions in stable interfaces, supporting well-understood use cases, as well as improving the internal design and overall contributor experience in order to ease future development.
  Improvements to experimental features have low priority.
- The [Nix documentation team](https://nixos.org/community/teams/documentation.html) focuses on improving documentation and learning materials for stable features and common principles.
  When using flakes, you will have to rely more heavily on user-to-user support, third-party documentation, and the source code.

## What Nix channels are available and what are their different branches on GitHub?

See <https://nixos.wiki/wiki/Nix_channels>.

## Are there some known impurities in builds?

Yes.

- CPU (we try hard to avoid compiling native instructions, but rather hardcode supported ones).
- Current time/date.
- FileSystem (ext4 has a known bug creating [empty files on power loss](https://github.com/NixOS/nixpkgs/issues/15581).)
- Kernel.
- Timing behaviour of the build system (parallel Make not getting the correct inputs in some cases).

<!---
# Recipes for both Nix and NixOS

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

### How do I force nix to re-check whether something exists at a binary cache?

Nix caches the contents of binary caches so that it doesn't have to query them
on every command. This includes negative answers (cache doesn't have something).
The default timeout for that is 1 hour as of writing.

To wipe all cache-lookup-caches:

```shell-session
$ rm $HOME/.cache/nix/binary-cache-v*.sqlite*
```

Alternatively, use the `narinfo-cache-negative-ttl` option to reduce the
cache timeout.

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

- <https://github.com/jeaye/nixos-in-place>
- <https://github.com/elitak/nixos-infect>
- <https://github.com/cleverca22/nix-tests/tree/master/kexec>
-->
