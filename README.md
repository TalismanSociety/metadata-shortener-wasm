# @talismn/metadata-shortener-wasm

This crate is a Rust implementation of the metadata shortener algorithm. It is compiled to WebAssembly and can be used in the browser.

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
wasm-pack publish
```
