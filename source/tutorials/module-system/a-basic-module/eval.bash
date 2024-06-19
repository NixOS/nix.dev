nix-shell -p jq --run "nix-instantiate --eval --json --strict | jq"
