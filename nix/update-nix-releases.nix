{ writeShellApplication
, git
, gnused
, niv
, nix
, ripgrep
, coreutils
}:
# add or update Nix releases using `niv` in the current directory.
# this will clone the entire Git repository of Nix.
writeShellApplication {
  name = "update-nix-releases";
  runtimeInputs = [ git gnused niv nix ripgrep ];
  text = ''
    # get release branches
    git ls-remote https://github.com/nixos/nix "refs/heads/*" \
      | rg '/\d(.*)-maintenance' | cut -d/ -f3 \
      | sort --reverse --version-sort > releases.txt

    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT
    git clone https://github.com/nixos/nix "$tmp" --depth 1 --quiet

    while IFS= read -r branch; do
      pushd "$tmp" > /dev/null
      git fetch origin "$branch" --depth 1 --quiet
      git checkout -b "$branch" FETCH_HEAD
      rev=$(git rev-parse HEAD)

      # only use cached builds, to avoid building Nix locally
      if default=$(nix-instantiate -A default 2> /dev/null) \
         && doc=$(nix-store --query "$default" | rg doc) \
         && nix-store --query --size "$doc" --store https://cache.nixos.org > /dev/null 2>&1
      then
        version="''${branch%-maintenance}"
        version="''${version//./-}"
        popd > /dev/null
        if pinned=$(niv show "nix_$version" | rg 'rev:' | cut -d' ' -f4); then
          if [ "$pinned" == "$rev" ]; then
            continue
          fi
          niv drop "nix_$version"
        fi
        niv add nixos/nix -n "nix_$version" -b "$branch"
      fi
    done < releases.txt
  '';
}
