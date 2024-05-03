pnpx nodemon -w src -e "rs toml" -x "wasm-pack build --scope talismn && (cd example && rm -rf node_modules && pnpm install && pnpm dev)" 
