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
          major_version=$(echo "$version" | cut -d. -f1)
          # filter out very old nixpkgs versions
          if [ "$major_version" -lt 23 ]; then
            if npins -d nix show | grep -q "$version"; then
              npins -d nix remove "$version"
            fi
            continue
          fi

        if ! npins -d nix show | grep -q "$version"; then
          npins -d nix add  --name "$version" github nixos nixpkgs --branch "nixos-$version"
        fi
      done
  '';
}
