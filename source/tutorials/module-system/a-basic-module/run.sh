nix eval -f eval.nix \
    --apply 'x: x {pkgs = import <nixpkgs> {};}' \
    --json | nix run nixpkgs#jq -- .
