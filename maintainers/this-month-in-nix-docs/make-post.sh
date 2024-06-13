#! /usr/bin/env nix-shell
#! nix-shell -i bash -p bash gh

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
    gh issue list -R "nixos/nixpkgs" --search "created:$from_date..$to_date label:\"6.topic: documentation\" tracking" --json "$pr_fields" --template "$tracking_issue_template"
}

cat << EOF
# This month in Nix documentation - #ISSUE - MONTH YEAR

## News

<!-- write down some highlights here -->

## Get in touch

Check the [Nix documentation team page](https://nixos.org/community/teams/documentation.html) for information on how to get in touch. Write us or drop into the office hours if you'd like to get things done together!

## How you can help

If you like what we're doing, consider [joining the documentation team](https://nixos.org/community/teams/documentation) or [donating to the NixOS Foundation's documentation project on Open Collective](https://opencollective.com/nixos/projects/documentation-project) to fund ongoing maintenance and development of learning materials and other documentation.

## Recent changes

This is a list of all recent changes made to documentation in the Nix ecosystem.

EOF

echo "### NixOS/nix"
echo
list_merged_prs "nixos/nix" "documentation"
echo

echo "### NixOS/nixpkgs"
echo
list_merged_prs "nixos/nixpkgs" "6.topic: documentation"
list_merged_prs "nixos/nixpkgs" "8.has: documentation"
echo

echo "### NixOS/nix-pills"
echo
list_merged_prs "nixos/nix-pills"
echo

echo "### NixOS/nix.dev"
echo
list_merged_prs "nixos/nix.dev"
echo

echo "### New tracking issues"
echo
list_new_tracking_issues
echo

echo "## Opened RFCs"
echo "<!-- manually check for relevance -->"
list_opened_prs "nixos/rfcs"
echo

echo "## Accepted RFCs"
echo "<!-- manually check for relevance -->"
list_merged_prs "nixos/rfcs"
echo
