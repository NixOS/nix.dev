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
    nix=$(mktemp -d)
    trap 'rm -rf $"tmp" "$nix"' EXIT

    # get release branches
    git ls-remote https://github.com/nixos/nix "refs/heads/*" \
      | rg '/\d(.*)-maintenance' | awk '{sub(/\s*refs\/heads\//, "", $2); print $2, $1}' \
      | sort --reverse --version-sort > "$tmp"/releases

    niv show | awk '
      !/^[[:space:]]/ {
        pin = $1
      }
      /branch:/ {
         branch = $2
      }
      /rev:/ {
         print branch, $2, pin
      }
    ' > "$tmp"/pinned

    # we *must* download the entire history.
    # prior to 2.17 the source files for the build were obtained with `cleanSourceWith`.
    # it is based on `builtins.filterSource` that incorporates the `.git` directory:
    # https://github.com/NixOS/nix/commit/b13fc7101fb06a65935d145081319145f7fef6f9
    # this means that all Hydra builds prior to 2.18 are based on deep clones.
    # evaluating a shallow clone will produce different derivation hashes.
    git clone https://github.com/nixos/nix "$nix"

    # only update releases where pins don't match the latest revision
    rg --invert-match --file <(awk '{print $1, $2}' "$tmp"/pinned) "$tmp"/releases | while read -r branch rev; do
      pushd "$nix" > /dev/null
      git checkout -b "$branch" origin/"$branch" --quiet

      # only use cached builds, to avoid building Nix locally
      cached=false
      while true; do
        # only try versions recent enough to have the same structure
        if ! default=$(nix-instantiate -A default 2> /dev/null); then
          break
        fi
        if ! doc=$(nix-store --query "$default" | rg doc); then
          break
        fi
        if nix-store --query --size "$doc" --store https://cache.nixos.org > /dev/null 2>&1; then
          cached=true
          break
        fi
        if ! git checkout HEAD~ --quiet; then
          break
        fi
        rev=$(git rev-parse HEAD)
      done

      if [ "$cached" = false ]; then
        continue
      fi

      popd > /dev/null
      version="''${branch%-maintenance}"
      version="''${version//./-}"
      pin=nix_"$version"

      if rg -q "$pin" "$tmp"/pinned; then
        niv update "$pin" -r "$rev"
      else
        niv add nixos/nix -n "$pin" -b "$branch" -r "$rev"
      fi
    done
  '';
}
