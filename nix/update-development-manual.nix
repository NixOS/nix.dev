{
  writeShellApplication,
  curl,
  jq,
  gh,
  coreutils,
  gnused,
  gnutar,
  gzip,
  git,
}:
# Update mechanism for development manual from Hydra, mirrored to GitHub releases
writeShellApplication {
  name = "update-development-manual";
  runtimeInputs = [
    curl
    jq
    gh
    coreutils
    gnused
    gnutar
    gzip
    git
  ];
  text = ''
        set -euo pipefail

        echo >&2 "Downloading development manual from Hydra..."

        # Try multiple fallback URLs in case Hydra structure changes
        urls=(
          "https://hydra.nixos.org/job/nix/master/manual/latest/download/1/manual.tar.xz"
          "https://hydra.nixos.org/job/nix/master/build.x86_64-linux/latest/download/2/nix-*-x86_64-linux/share/doc/nix/manual"
        )

        tmp=$(mktemp -d)
        trap 'rm -rf "$tmp"' EXIT

        downloaded=false
        for url in "''${urls[@]}"; do
          echo >&2 "Trying to download from: $url"
          if curl -f -L -s "$url" -o "$tmp/manual.tar.xz"; then
            echo >&2 "Successfully downloaded from: $url"
            downloaded=true
            break
          fi
        done

        if [ "$downloaded" = false ]; then
          echo >&2 "Failed to download manual from any URL"
          exit 1
        fi

        # Verify we got a valid archive
        if ! tar -tf "$tmp/manual.tar.xz" > /dev/null 2>&1; then
          echo >&2 "Downloaded file is not a valid tar archive"
          exit 1
        fi

        # Calculate hash for comparison
        current_hash=$(sha256sum "$tmp/manual.tar.xz" | cut -d' ' -f1)

        # Check existing version file
        if [ -f "nix/development-manual.json" ]; then
          existing_hash=$(jq -r '.sha256' nix/development-manual.json)
          if [ "$existing_hash" = "$current_hash" ]; then
            echo >&2 "Manual with same content already exists"
            exit 0
          fi
        fi

        # Use date-based versioning for stability
        # Format: YYYY.MM.DD (with optional .N for multiple updates same day)
        base_version=$(date +%Y.%m.%d)

        # Check if this version already exists and increment if needed
        version="$base_version"
        counter=1
        while gh release view "development-manual-$version" >/dev/null 2>&1; do
          version="$base_version.$counter"
          counter=$((counter + 1))
        done

        echo >&2 "Creating new version: $version"

        current_time=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

        # Create new versioned release
        release_tag="development-manual-$version"
        gh release create "$release_tag" "$tmp/manual.tar.xz" \
          --title "Development Manual $version" \
          --notes "Nix development manual from master branch ($current_time)

    Hash: $current_hash" \
          --prerelease

        # Update the version file in the repository
        jq -n \
          --arg version "$version" \
          --arg sha256 "$current_hash" \
          --arg url "https://github.com/NixOS/nix.dev/releases/download/$release_tag/manual.tar.xz" \
          --arg updated "$current_time" \
          '{
            version: $version,
            sha256: $sha256,
            url: $url,
            updated: $updated
          }' > nix/development-manual.json

        echo >&2 "Development manual updated successfully!"
        echo >&2 "Version: $version"
        echo >&2 "Hash: $current_hash"
        echo >&2 "Updated: nix/development-manual.json"
  '';
}
