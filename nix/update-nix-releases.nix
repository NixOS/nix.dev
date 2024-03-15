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
    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT

    git clone https://github.com/nixos/nix "$tmp"

    pushd "$tmp" > /dev/null
    git branch -r | rg 'origin/\d\.\d*-maintenance' | sed 's|.*origin/\(.*\)|\1|' > releases.txt

    while IFS= read -r branch; do
      git checkout "$branch"
      # very old versions don't have a `default.nix`
      if [ ! -f default.nix ]; then continue; fi
      doc=$(nix-store --query "$(nix-instantiate -A default 2> /dev/null)" | rg doc)
      # only use cached builds, to avoid building Nix locally
      if nix-store --query --size "$doc" --store https://cache.nixos.org > /dev/null 2>&1; then
        version="''${branch%-maintenance}"
        version="''${version//./-}"
        popd > /dev/null
        if niv show "nix_$version" > /dev/null 2>&1; then
          niv drop "nix_$version"
        fi
        niv add nixos/nix -n "nix_$version" -b "$branch"
        pushd "$tmp" > /dev/null
      fi
    done < releases.txt
  '';
}
