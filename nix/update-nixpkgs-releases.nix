{ writeShellApplication
, git
, gnused
, niv
, nix
, ripgrep
, coreutils
}:
# add or update Nixpkgs releases using `niv` in the current directory.
writeShellApplication {
  name = "update-nixpkgs-releases";
  runtimeInputs = [ git gnused niv nix ripgrep ];
  text = ''
    tmp=$(mktemp -d)
    nixpkgs=$(mktemp -d)
    trap 'rm -rf $"tmp" "$nixpkgs"' EXIT

    # get release branches
    git ls-remote https://github.com/nixos/nixpkgs "refs/heads/*" \
      | rg '/nixos-\d\d\.\d\d$' | awk '{sub(/\s*refs\/heads\//, "", $2); print $2, $1}' \
      | sort --reverse --version-sort > "$tmp"/releases

    niv show | awk '
      !/^[[:space:]]/ && $1 ~ /^nixpkgs_/ {
        pin = $1
      }
      /branch:/ {
        branch = $2
      }
      /rev:/ {
        print branch, $2, pin
      }
    ' > "$tmp"/pinned

    # nixpkgs-unstable moves fast enough to always need updates
    niv update nixpkgs-rolling -b nixpkgs-unstable

    # only update releases where pins don't match the latest revision
    rg --invert-match --file <(awk '{print $1, $2}' "$tmp"/pinned) "$tmp"/releases | cut -d' ' -f1 | while read -r branch; do
      version="''${branch/nixos-/}"
      version="''${version//./-}"
      pin=nixpkgs_"$version"

      if rg -q "$pin" "$tmp"/pinned; then
        niv update "$pin"
      else
        niv add nixos/nixpkgs -n "$pin" -b "$branch"
      fi
    done
  '';
}
