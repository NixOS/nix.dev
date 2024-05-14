#!/usr/bin/env bash
set -euo pipefail

rational_regex='-?[[:digit:]]+(\.[[:digit:]]+)?'
result_regex="$rational_regex,$rational_regex"

keyFile=${XDG_DATA_HOME:-~/.local/share}/google-api/key

if [[ ! -f "$keyFile" ]]; then
    mkdir -p "$(basename "$keyFile")"
    echo "No Google API key found in $keyFile" >&2
    echo "For getting one, see https://developers.google.com/maps/documentation/geocoding/overview#before-you-begin" >&2
    exit 1
fi

key=$(cat "$keyFile")

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' exit

output=$tmp/output

curlArgs=(
    https://maps.googleapis.com/maps/api/geocode/json
    --silent --show-error --get --output "$output" --write-out '%{http_code}'
    --data-urlencode address="$1"
)

#echo curl ''${curlArgs[@]@Q} >&2

curlArgs+=(--data-urlencode key="$key")

if status=$(curl "${curlArgs[@]}"); then
    if [[ "$status" == 200 ]]; then
        result=$(jq -r '.results[0].geometry.location as $loc | "\($loc | .lat),\($loc | .lng)"' "$output")
        if ! [[ $result =~ $result_regex ]]; then
            echo "Got a bad result of: '$result'" >&2
            exit 1
        else
            echo "$result"
        fi
    else
        echo "API returned non-200 HTTP status code $status, output is" >&2
        cat "$output" >&2
        exit 1
    fi
else
    echo "curl exited with code $?" >&2
    exit 1
fi
