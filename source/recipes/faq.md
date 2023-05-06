# FAQ

## How to build reverse dependencies of a package?

```shell-session
$ nix-shell -p nixpkgs-review --run "nixpkgs-review wip"
```

## I'm getting: writing to file: Connection reset by peer

Too big files in src, out of resources (HDD space, memory)

## What are channels and different branches on github?

See <https://nixos.wiki/wiki/Nix_channels>

## How can I manage dotfiles in \$HOME with Nix?

<https://github.com/nix-community/home-manager>

## Are there some known impurities in builds?

Yes.

- CPU (we try hard to avoid compiling native instructions, but rather hardcode supported ones)
- current time/date
- FileSystem (ext4 has a known bug creating [empty files on power loss](https://github.com/NixOS/nixpkgs/issues/15581))
- Kernel
- Timing behaviour of the build system (parallel Make not getting correct inputs in some cases)

## How to build my own ISO?

See <http://nixos.org/nixos/manual/index.html#sec-building-image>

## How do I connect to any of the machines in NixOS tests?

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

## How to bootstrap NixOS inside an existing Linux installation?

There are a couple of tools:

- <https://github.com/jeaye/nixos-in-place>
- <https://github.com/elitak/nixos-infect>
- <https://github.com/cleverca22/nix-tests/tree/master/kexec>
