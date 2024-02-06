(automatic-direnv)=
# Automatic environment activation with `direnv`

Instead of manually activating the environment for each project, you can reload a [declarative shell](declarative-reproducible-envs) every time you enter the project's directory or change the `shell.nix` inside it.

1. [Make nix-direnv available](https://github.com/nix-community/nix-direnv)
2. [Hook it into your shell](https://direnv.net/docs/hook.html)

For example, write a `shell.nix` with the following contents:

```nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    hello
  ];
}

```
From the top-level directory of your project run:

```shell-session
$ echo "use nix" > .envrc && direnv allow
```

The next time you launch your terminal and enter the top-level directory of your project, `direnv` will automatically launch the shell defined in `shell.nix`

```shell-session
$ cd myproject
$ which hello
/nix/store/1gxz5nfzfnhyxjdyzi04r86sh61y4i00-hello-2.12.1/bin/hello
```

`direnv` will also check for changes to the `shell.nix` file.

Make the following addition:

```diff
 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
 in

 pkgs.mkShellNoCC {
   packages = with pkgs; [
     hello
   ];
+
+  shellHook = ''
+    hello
+  '';
 }
```

The running environment should reload itself after the first interaction (run any command or press `Enter`).

```shell-session
Hello, world!
```
