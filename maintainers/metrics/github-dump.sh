#!/usr/bin/env bash

prs() {
  fields="author,labels,state,createdAt,mergedAt,closedAt"
  gh pr list --repo "$1" --state all --limit 1000000 --json "$fields"
}

issues() {
  fields="author,labels,state,closedAt,createdAt"
  gh issue list --repo "$1" --state all --limit 1000000 --json "$fields"
}

#repos=("nixpkgs" "nix" "nix.dev")
repos=("nix" "nix.dev")
for repo in "${repos[@]}"; do
  echo fetching pull requests for nixos/"$repo"
  prs nixos/"$repo" > "$repo"-prs.json
  echo fetching issues for nixos/"$repo"
  issues nixos/"$repo" > "$repo"-issues.json
done
