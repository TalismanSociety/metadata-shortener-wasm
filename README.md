# @talismn/metadata-shortener-wasm

This project wraps [Zondax's metadata shortener](https://github.com/Zondax/ledger-polkadot-generic-api) in a webassembly blob so it can be used by Talisman wallet.

## 🚴 Usage

### 🛠️ Dev mode

```sh
./dev_example.sh
```

### 🛠️ Build with `wasm-pack build`

```sh
# specify scope for npm package to be named @talismn/metadata-shortener-wasm
wasm-pack build --scope talismn
```

### 🎁 Publish to NPM with `wasm-pack publish`

```sh
cd pkg
npm publish --access=public
```
