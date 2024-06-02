{ writeShellApplication
, git
, npins
, nix
, ripgrep
, coreutils
, jq
}:
# add or update Nixpkgs releases using `npins`
writeShellApplication {
  name = "update-nixpkgs-releases";
  runtimeInputs = [ git npins nix ripgrep jq coreutils ];
  text = ''
    echo >&2 "Updating rolling"
    npins update nixpkgs-rolling
    echo >&2 "Updating stable releases"
    npins -d nix update

    echo >&2 "Adding any new releases"
    # get release branches
    git ls-remote https://github.com/nixos/nixpkgs "refs/heads/*" \
      | rg '^([0-9a-f]+)\trefs/heads/nixos-(\d\d\.\d\d)$' -or '$2' \
      | sort --reverse --version-sort \
      | while read -r version; do

        if ! jq -e --arg version "$version" 'has($ARGS.named.version)' nix/sources.json >/dev/null; then
          npins -d nix add  --name "$version" github nixos nixpkgs --branch "nixos-$version"
        fi
      done
  '';
}
