#! /usr/bin/env nix-shell
#! nix-shell -i bash -p gh

set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Usage: query-prs.sh <from YYYY-MM-DD> <to YYYY-MM-DD>"
    exit 1
fi

from_date="$1"
to_date="$2"
pr_fields="number,title,author,url"
pr_template="{{range .}}- [#{{.number}}]({{.url}}) {{.title}} ([@{{.author.login}}](https://github.com/{{.author.login}})){{printf \"\n\"}}{{end}}"
tracking_issue_template="{{range .}}- [#{{.number}}]({{.url}}) {{.title}}{{printf \"\n\"}}{{end}}"

# Lists the PRs merged from a repository between certain dates, optionally filtered by labels
list_merged_prs() {
    if [ $# -gt 1 ]; then
        repo="$1"
        labels="$2"
        gh pr list -R "$repo" --search "is:merged merged:$from_date..$to_date label:\"$labels\"" --json "$pr_fields" --template "$pr_template"
    else
        repo="$1"
        gh pr list -R "$repo" --search "is:merged merged:$from_date..$to_date" --json "$pr_fields" --template "$pr_template"
    fi
}

# Lists the PRs opened on a repository
list_opened_prs() {
    if [ $# -gt 1 ]; then
        repo="$1"
        labels="$2"
        gh pr list -R "$repo" --search "is:unmerged created:$from_date..$to_date label:\"$labels\"" --json "$pr_fields" --template "$pr_template"
    else
        repo="$1"
        gh pr list -R "$repo" --search "is:unmerged created:$from_date..$to_date" --json "$pr_fields" --template "$pr_template"
    fi
}

# Lists all of the tracking issues opened on nix.dev within the specified dates
list_new_tracking_issues() {
    gh issue list -R "nixos/nix.dev" --search "created:$from_date..$to_date label:tracking" --json "$pr_fields" --template "$tracking_issue_template"
}

cat template.md

echo "## PRs"
echo

echo "### NixOS/nix"
list_merged_prs "nixos/nix" "documentation"
echo

echo "### NixOS/nixpkgs"
list_merged_prs "nixos/nixpkgs" "6.topic: documentation"
echo

echo "### NixOS/nix-pills"
list_merged_prs "nixos/nix-pills"
echo

echo "### NixOS/nix.dev"
list_merged_prs "nixos/nix.dev"
echo

echo "## RFCs"
echo

echo "### Opened (manually check for relevance)"
list_opened_prs "nixos/rfcs"
echo

echo "### Accepted (manually check for relevance)"
list_merged_prs "nixos/rfcs"
echo

echo "## New Tracking Issues"
list_new_tracking_issues
echo