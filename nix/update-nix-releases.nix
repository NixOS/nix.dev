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
      | rg '/\d(.*)-maintenance' | awk '{sub(/\s*refs\/heads\//, "", $2); print $2, $1}' \
      | sort --reverse --version-sort > releases

    niv show | awk '/branch:/ {branch = $2} /rev:/ {print branch, $2}' > pinned

    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT
    git clone https://github.com/nixos/nix "$tmp" --depth 1 --quiet

    # only update releases where pins don't match the latest revision
    rg --invert-match --file pinned releases | cut -d' ' -f1 | while read -r branch; do
      version="''${branch%-maintenance}"
      version="''${version//./-}"

      pushd "$tmp" > /dev/null
      git fetch origin "$branch" --depth 1 --quiet
      git checkout -b "$branch" FETCH_HEAD

      # only use cached builds, to avoid building Nix locally
      if default=$(nix-instantiate -A default 2> /dev/null) \
         && doc=$(nix-store --query "$default" | rg doc) \
         && nix-store --query --size "$doc" --store https://cache.nixos.org > /dev/null 2>&1
      then
        popd > /dev/null
        niv drop "nix_$version"
        niv add nixos/nix -n "nix_$version" -b "$branch"
      else
        popd > /dev/null
      fi
    done
  '';
}
