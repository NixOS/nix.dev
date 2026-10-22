#!/usr/bin/env bash
# Test the code blocks that source/_ext/extractable_code_block.py extracts
# from the documentation into extracted/<document>/.
#
# Tests live in tests/code-blocks/<document>/test_*, so they don't show up in
# the rendered docs. They are copied next to the extracted files and run from
# that directory. test_* code blocks in the docs themselves run as well.
set -euo pipefail

if [[ ! -d extracted ]]; then
  echo "error: no extracted/ directory; build the docs first, e.g. with 'make dummy'" >&2
  exit 1
fi

for dir in tests/code-blocks/*/; do
  document=$(basename "$dir")
  if [[ ! -d extracted/$document ]]; then
    echo "error: tests exist for $document, but no code blocks were extracted from it" >&2
    exit 1
  fi
  cp "$dir"/test_* "extracted/$document/"
done

count=0
while IFS= read -r -d '' test; do
  echo "running $test"
  (cd "$(dirname "$test")" && "./$(basename "$test")")
  count=$((count + 1))
done < <(find extracted -name 'test_*' -print0 | sort -z)

echo "ran $count code block tests"
