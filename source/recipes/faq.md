# Frequently Asked Questions

## Nix

### What are flakes?

What is usually referred to as "flakes" is:
- A policy for managing dependencies between {term}`Nix expression`s.
- An [experimental feature] in Nix, implementing that policy and supporting functionality.

[experimental feature]: https://nixos.org/manual/nix/stable/contributing/experimental-features.html

Technically, a [flake](https://nixos.org/manual/nix/unstable/command-ref/new-cli/nix3-flake.html#description) is a file system tree that contains a {term}`Nix file` named `flake.nix` in its root directory.

Flakes add the following behavior to Nix:

1. A `flake.nix` file offers a uniform [schema](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-format), where:
   - Other flakes can be referenced as dependencies providing {term}`Nix language` code or other files.
   - The values produced by the {term}`Nix expression` in `flake.nix` are structured according to pre-defined use cases.

1. References to other flakes can be specified using a dedicated [URL-like syntax](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-references).
   A [flake registry] allows using symbolic identifiers for further brevity.
   References can be automatically locked to their current specific version and later updated programmatically.

   [flake registry]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-registry.html

1. A [new command line interface], implemented as a separate experimental feature, leverages flakes by accepting flake references in order to build, run, or deploy software defined as a flake.

   [new command line interface]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix.html

Nix handles flakes differently than regular Nix expressions in the following ways:

- The `flake.nix` file is checked for schema validity.

- The entire flake directory is copied to Nix store before evaluation.

  This allows for effective evaluation caching, which is relevant for large expressions such as Nixpkgs, but also requires copying the entire flake directory again on each change.

- No external variables, parameters, or impure language values are allowed.

  It means full reproducibility of a Nix expression, and, by extension, the resulting build instructions by default, but also prohibits parameterisation of results by consumers.

### What to do if a binary cache is down or unreachable?

Pass `--option substitute false` to Nix commands.

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

### How do I fix: error: querying path in database: database disk image is malformed

Try:

```shell-session
$ sqlite3 /nix/var/nix/db/db.sqlite "pragma integrity_check"
```

Which will print the errors in the database. If the errors are due to missing
references, the following may work:

```shell-session
$ mv /nix/var/nix/db/db.sqlite /nix/var/nix/db/db.sqlite-bkp
$ sqlite3 /nix/var/nix/db/db.sqlite-bkp ".dump" | sqlite3 /nix/var/nix/db/db.sqlite
```

### How to operate between Nix paths and strings?

<http://stackoverflow.com/a/43850372>

### How do I fix: error: current Nix store schema is version 10, but I only support 7

This means you have upgraded Nix sqlite schema to a newer version, but then tried
to use older Nix.

The solution is to dump the db and use old Nix version to initialize it:

```shell-session
$ /path/to/nix/unstable/bin/nix-store --dump-db > /tmp/db.dump
$ mv /nix/var/nix/db /nix/var/nix/db.toonew
$ mkdir /nix/var/nix/db
$ nix-store --init # this is the old nix-store
$ nix-store --load-db < /tmp/db.dump
```

### How to build reverse dependencies of a package?

```shell-session
$ nix-shell -p nixpkgs-review --run "nixpkgs-review wip"
```

### I'm getting: writing to file: Connection reset by peer

Too big files in src, out of resources (HDD space, memory)

### What are channels and different branches on github?

See <https://nixos.wiki/wiki/Nix_channels>

### How can I manage dotfiles in \$HOME with Nix?

<https://github.com/nix-community/home-manager>

### Are there some known impurities in builds?

Yes.

- CPU (we try hard to avoid compiling native instructions, but rather hardcode supported ones)
- current time/date
- FileSystem (ext4 has a known bug creating [empty files on power loss](https://github.com/NixOS/nixpkgs/issues/15581))
- Kernel
- Timing behaviour of the build system (parallel Make not getting correct inputs in some cases)

### What's the recommended process for building custom packages?

> E.g. if I git clone nixpkgs how do I use the  cloned repo to define new / updated packages?

## NixOS

### How to build my own ISO?

<http://nixos.org/nixos/manual/index.html#sec-building-image>

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
