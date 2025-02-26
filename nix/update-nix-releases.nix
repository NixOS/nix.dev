{ writeShellApplication
, git
, nix
, ripgrep
, coreutils
, jq
}:
# Custom update mechanism for Nix releases in ./nix-versions.json
writeShellApplication {
  name = "update-nix-releases";
  runtimeInputs = [ git nix ripgrep coreutils jq ];
  text = ''
    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT

    echo >&2 "Fetching the Nix git history"
    # We only need the Git history of the repo, the contents we download directly into the Nix store.
    # --filter=tree:0 prevents downloading any contents and --bare prevents creating a working tree
    git clone --quiet --filter=tree:0 --bare https://github.com/nixos/nix "$tmp/nix"

    echo >&2 "Going through all *-maintenance branches"
    git -C "$tmp/nix" branch --list '[0-9]*.[0-9]*-maintenance' --format '%(refname)' \
      | rg 'refs/heads/(.*)-maintenance' -or '$1' \
      | sort --reverse --version-sort \
      | while read -r version; do

      rev=$(git -C "$tmp/nix" rev-parse "$version-maintenance")
      echo >&2 "Version $version on branch $version-maintenance is at $rev"

      # Try to find a cached build by iterating back through the Git history
      # This is necessary because the maintenance branches are pushed to directly and Hydra will take a while to build it
      cached=false
      steps=0
      while true; do
        # We fetch Nix the same as `fetchTarball { name = "source"; ... }`, such that we should definitely get the same hashes and co.
        # Though older versions of Nix didn't pin flake-compat, but this doesn't appear to be a problem in this case
        # See https://github.com/NixOS/nix.dev/pull/830#issuecomment-1922672937
        url=https://github.com/nixos/nix/tarball/"$rev"
        readarray -t sha256Source < <(nix-prefetch-url --unpack --name source --print-path "$url")
        sha256=''${sha256Source[0]}
        source=''${sha256Source[1]}

        if [[ ! -f "$source"/.version ]]; then
          # Not having a .version indicates that we're not in the release anymore
          break
        fi
        fullVersion="$(<"$source"/.version)"

        # Only try versions recent enough to have the same structure, this filter out versions before 2.4
        # We need a doc output, this is always the case for >= 2.4
        if ! docOutput=$(nix-instantiate "$source" --argstr system "x86_64-linux" -A default.doc 2> /dev/null); then
          echo >&2 "No doc output"
          break
        fi
        # Check if the path is cached; `--size` is needed because without it, no query to the cache would be made
        if nix-store --query --size "$docOutput" --store https://cache.nixos.org > /dev/null 2>&1; then
          cached=true
          break
        fi
        # If it's not cached, try the parent commit, usually only a couple steps are required at most
        rev=$(git -C "$tmp/nix" rev-parse "$rev~")
        steps=$(( steps + 1 ))
      done

      if [ "$cached" = false ]; then
        echo >&2 "Could not find a cached version for release $version"
        continue
      fi

      echo >&2 "Found a cached version, $steps steps away from the latest commit"

      jq -n \
        --arg key "$version" \
        --arg url "$url" \
        --arg version "$fullVersion" \
        --arg sha256 "$sha256" \
        '$ARGS.named'
    done \
      | jq -s 'map({ key: .key, value: del(.key) }) | from_entries' \
      > nix/nix-versions.json
  '';
}
