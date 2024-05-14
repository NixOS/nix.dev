#!/usr/bin/env bash
set -euo pipefail

keyFile=${XDG_DATA_HOME:-~/.local/share}/google-api/key

if [[ ! -f "$keyFile" ]]; then
    mkdir -p "$(basename "$keyFile")"
    echo "No Google API key found in $keyFile" >&2
    echo "For getting one, see https://developers.google.com/maps/documentation/maps-static/start#before-you-begin" >&2
    exit 1
fi

key=$(cat "$keyFile")
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' exit

output=$tmp/output

curlArgs=(
    https://maps.googleapis.com/maps/api/staticmap
    --silent --show-error --get --output "$output" --write-out %{http_code}
)

for arg in "$@"; do
    curlArgs+=(--data-urlencode "$arg")
done

echo curl ''${curlArgs[@]@Q} >&2

curlArgs+=(--data-urlencode key="$key")

if status=$(curl "${curlArgs[@]}"); then
    if [[ "$status" != 200 ]]; then
        echo "API returned non-200 HTTP status code $status, output is" >&2
        cat "$output" >&2
        exit 1
    fi
else
    echo "curl exited with code $?" >&2
    exit 1
fi

if [[ -t 1 ]]; then
    echo "Successful, but won't output image to tty, pipe to a file or icat instead" >&2
else
    cat "$output"
fi
