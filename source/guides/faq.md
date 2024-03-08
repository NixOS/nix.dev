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

See the [Nix reference manual](nix-manual) on [string interpolation](https://nix.dev/manual/nix/2.19/language/string-interpolation) and [operators on paths and strings](https://nix.dev/manual/nix/2.19/language/operators#string-concatenation)

### How to build reverse dependencies of a package?

```shell-session
$ nix-shell -p nixpkgs-review --run "nixpkgs-review wip"
```

### How can I manage dotfiles in \$HOME with Nix?

See <https://github.com/nix-community/home-manager>

### What's the recommended process for building custom packages?

Please read [](packaging-tutorial).

### How to use a clone of the Nixpkgs repository to update or write new packages?

Please read [](packaging-tutorial) and the [Nixpkgs contributing guide](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md).

## NixOS

### How to run non-nix executables?

NixOS cannot run dynamically linked executables intended for generic Linux environments out of the box.
This is because, by design, it does not have a global library path, nor does it follow the [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html) (FHS).

There are a few ways to resolve this mismatch in environment expectations:

- Use the version packaged in Nixpkgs, if there is one.
  You can search available packages at <https://search.nixos.org/packages>.

- Write a Nix expression for the program to package it in your own configuration.

  There are multiple approaches to this:
  - Build from source.

    Many open-source programs are highly flexible at compile time in terms of where their files go.
    For an introduction to this, see [](packaging-tutorial).
  - Modify the program's [ELF header](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) to include paths to libraries using [`autoPatchelfHook`](https://nixos.org/manual/nixpkgs/stable/#setup-hook-autopatchelfhook).

    Do this if building from source isn't feasible.
  - Wrap the program to run in an FHS-like environment using [`buildFHSEnv`](https://nixos.org/manual/nixpkgs/stable/#sec-fhs-environments).

    This is a last resort, but sometimes necessary, for example if the program downloads and runs other executables.

- Create a library path that only applies to unpackaged programs by using [`nix-ld`](https://github.com/Mic92/nix-ld).
  Add this to your `configuration.nix`:

  ```nix
    programs.nix-ld.enable = true;
    programs.nix-ld.libraries = with pkgs; [
      # Add any missing dynamic libraries for unpackaged programs
      # here, NOT in environment.systemPackages
    ];
  ```

  Then run `nixos-rebuild switch`, and log out and back in again to propagate the new environment variables.
  (This is only necessary when enabling `nix-ld`; changes in included libraries take effect immediately on rebuild.)

  :::{note}
  `nix-ld` does not work for 32-bit executables on `x86_64` machines.
  :::

- Run your program in the FHS-like environment made for the Steam package using [`steam-run`](https://nixos.org/manual/nixpkgs/stable/#sec-steam-run):

  ```shell-session
  $ nix-shell -p steam-run --run "steam-run <command>"
  ```

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
