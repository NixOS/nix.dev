{ writeShellApplication
, git
, niv
, nix
, ripgrep
, coreutils
, jq
}:
# add or update Nixpkgs releases using `niv`
writeShellApplication {
  name = "update-nixpkgs-releases";
  runtimeInputs = [ git niv nix ripgrep jq coreutils ];
  text = ''
    echo >&2 "Updating rolling"
    niv update nixpkgs-rolling
    echo >&2 "Updating stable releases"
    niv -s nix/nixpkgs-versions.json update

    echo >&2 "Adding any new releases"
    # get release branches
    git ls-remote https://github.com/nixos/nixpkgs "refs/heads/*" \
      | rg '^([0-9a-f]+)\trefs/heads/nixos-(\d\d\.\d\d)$' -or '$2' \
      | sort --reverse --version-sort \
      | while read -r version; do

        if ! jq -e --arg version "$version" 'has($ARGS.named.version)' nix/nixpkgs-versions.json >/dev/null; then
          niv -s nix/nixpkgs-versions.json add nixos/nixpkgs -n "$version" -b "nixos-$version"
        fi
      done
  '';
}
