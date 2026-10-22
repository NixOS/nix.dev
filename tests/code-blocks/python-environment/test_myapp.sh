#!/usr/bin/env bash
# source/guides/recipes/python-environment.md: the Flask app from myapp.py,
# run in the environment from shell.nix and nothing else, serves the message
# the recipe shows.
set -euo pipefail

# shellcheck disable=SC2016 # expanded by the shell that nix-shell starts
nix-shell --pure shell.nix --run '
  python myapp.py > myapp.log 2>&1 &
  trap "kill $!" EXIT
  message=$(curl --silent --retry 10 --retry-delay 1 --retry-connrefused http://127.0.0.1:5000 | jq -r .message)
  if [[ $message != "Hello, Nix!" ]]; then
    echo "unexpected message: $message"
    cat myapp.log
    exit 1
  fi
'
