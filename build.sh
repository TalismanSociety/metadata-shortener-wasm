#!/usr/bin/env bash

set -e

# Check if jq is installed
if ! [ -x "$(command -v jq)" ]; then
    echo "jq is not installed" >& 2
    exit 1
fi

# Clean previous packages
if [ -d "pkg" ]; then
    rm -rf pkg
fi

if [ -d "pkg-node" ]; then
    rm -rf pkg-node
fi

# Build for both targets
wasm-pack build --scope talismn -t nodejs -d pkg-node
wasm-pack build --scope talismn -t bundler -d pkg

cp "pkg-node/metadata_shortener_wasm.js" "pkg/metadata_shortener_wasm_main.js"
jq ".files += [\"metadata_shortener_wasm_main.js\"]" pkg/package.json \
    | jq ".main = \"metadata_shortener_wasm_main.js\"" > pkg/temp.json
mv pkg/temp.json pkg/package.json
rm -rf pkg-node
