{
  writeShellApplication,
  git,
  nix,
  coreutils,
  jq,
}:
# Custom update mechanism for Nix releases in ./nix-versions.json
writeShellApplication {
  name = "update-nix-releases";
  runtimeInputs = [
    git
    nix
    coreutils
    jq
  ];
  text = ''
    versions=nix/nix-versions.json
    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT

    # Warnings go to stderr, and are repeated as GitHub Actions annotations at the end
    warn() {
      echo >&2 "warning: $*"
      echo "$*" >> "$tmp/warnings"
    }

    # Keep the current entry for a version, if there is one
    keep() {
      jq -c --arg key "$1" 'select(has($key)) | { key: $key, value: .[$key] }' "$versions"
    }

    echo >&2 "Fetching the Nix release tags"
    # Annotated tags are listed twice: first the tag object, then the tagged commit as <tag>^{}
    declare -A tagRev
    while read -r rev ref; do
      tag=''${ref#refs/tags/}
      if [[ $tag == *'^{}' ]]; then
        tagRev[''${tag%'^{}'}]=$rev
      elif [[ -z ''${tagRev[$tag]:-} ]]; then
        tagRev[$tag]=$rev
      fi
    done < <(git ls-remote --tags https://github.com/nixos/nix 'refs/tags/2.*')
    if [[ ''${#tagRev[@]} -eq 0 ]]; then
      echo >&2 "error: found no Nix release tags"
      exit 1
    fi

    # The newest release of each minor version, newest minor first.
    # Only X.Y.Z tags are releases.
    declare -A seen
    for tag in "''${!tagRev[@]}"; do
      if [[ $tag =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "$tag"
      fi
    done | sort --version-sort --reverse | while read -r tag; do
      minor=''${tag%.*}
      if [[ -z ''${seen[$minor]:-} ]]; then
        seen[$minor]=1
        echo "$minor $tag"
      fi
    done > "$tmp/releases"

    while read -r minor tag; do
      rev=''${tagRev[$tag]}

      # ignore everything below 2.18 for speed, this might need to be adjusted in the future
      majorVersion=''${minor%.*}
      minorVersion=''${minor#*.}
      if [ "$majorVersion" -lt 2 ] || { [ "$majorVersion" -eq 2 ] && [ "$minorVersion" -lt 18 ]; }; then
        continue
      fi

      url=https://github.com/nixos/nix/tarball/"$rev"

      if [[ $(jq -r --arg key "$minor" '.[$key].url // empty' "$versions") == "$url" ]]; then
        echo >&2 "$minor: $tag is already pinned"
        keep "$minor"
        continue
      fi

      echo >&2 "$minor: checking $tag ($rev)"
      # We fetch Nix the same as `fetchTarball { name = "source"; ... }`, such that we should definitely get the same hashes and co.
      # Though older versions of Nix didn't pin flake-compat, but this doesn't appear to be a problem in this case
      # See https://github.com/NixOS/nix.dev/pull/830#issuecomment-1922672937
      if ! nix-prefetch-url --unpack --name source --print-path "$url" > "$tmp/prefetch"; then
        warn "$minor: could not fetch $tag, keeping the current entry"
        keep "$minor"
        continue
      fi
      readarray -t sha256Source < "$tmp/prefetch"
      sha256=''${sha256Source[0]}
      source=''${sha256Source[1]}

      # Only use releases whose manual Hydra has already built
      if ! docOutput=$(nix-instantiate --eval -E "(import $source).default.doc.outPath" | tr -d \"); then
        warn "$minor: could not evaluate the manual for $tag, keeping the current entry"
        keep "$minor"
        continue
      fi
      # Check if the path is cached; `--size` is needed because without it, no query to the cache would be made
      if ! nix-store --query --size "$docOutput" --store https://cache.nixos.org > /dev/null 2>&1; then
        warn "$minor: the manual for $tag is not on cache.nixos.org yet, keeping the current entry"
        keep "$minor"
        continue
      fi

      echo >&2 "$minor: using $tag"
      jq -nc \
        --arg key "$minor" \
        --arg url "$url" \
        --arg version "$tag" \
        --arg sha256 "$sha256" \
        '{ key: $key, value: { url: $url, version: $version, sha256: $sha256 } }'
    done < "$tmp/releases" > "$tmp/entries"

    # Never drop a version that is currently pinned, e.g. if its tags can't be found
    jq -r 'keys[]' "$versions" | while read -r minor; do
      if ! jq -se --arg key "$minor" 'any(.[]; .key == $key)' "$tmp/entries" > /dev/null; then
        warn "$minor: no release found, keeping the current entry"
        keep "$minor" >> "$tmp/entries"
      fi
    done

    jq -s 'sort_by(.key | split(".") | map(tonumber)) | reverse | from_entries' "$tmp/entries" > "$tmp/nix-versions.json"
    mv "$tmp/nix-versions.json" "$versions"

    if [[ -n ''${GITHUB_ACTIONS:-} && -f $tmp/warnings ]]; then
      while read -r warning; do
        echo "::warning::$warning"
      done < "$tmp/warnings"
    fi
  '';
}
