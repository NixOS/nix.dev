#!/usr/bin/env bash
# Run the test_* files that source/_ext/extractable_code_block.py extracted
# from the documentation, each from its own directory.
set -euo pipefail

if [[ ! -d extracted ]]; then
  echo "error: no extracted/ directory; build the docs first, e.g. with 'make dummy'" >&2
  exit 1
fi

count=0
while IFS= read -r -d '' test; do
  echo "running $test"
  (cd "$(dirname "$test")" && "./$(basename "$test")")
  count=$((count + 1))
done < <(find extracted -name 'test_*' -print0 | sort -z)

echo "ran $count code block tests"
