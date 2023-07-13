#!/usr/bin/env bash
set -euo pipefail

cachedir=~/.cache/google-api/geocode
mkdir -p "$cachedir"
hash=$(echo "$1" | sha256sum - | cut -d' ' -f1)
cachefile="$cachedir/$hash"

if [[ ! -f "$cachefile" ]]; then

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
      jq -r '.results[0].geometry.location as $loc | "\($loc | .lat),\($loc | .lng)"' "$output" > "$cachefile"
    else
      echo "API returned non-200 HTTP status code $status, output is" >&2
      cat "$output" >&2
      exit 1
    fi
  else
    code=$?
    echo "curl exited with code $code" >&2
    exit 1
  fi
fi

cat "$cachefile"
