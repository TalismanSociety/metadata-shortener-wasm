import { SignerPayloadJSON } from "@polkadot/types/types";

export const DEFAULT_PAYLOAD: SignerPayloadJSON = {
  specVersion: "0x000f4a10",
  transactionVersion: "0x0000000e",
  address: "13TtFyPPgw2ZU4TmH8bmR27Q1qTiT6XPTAprUbkgsJEWEjJx",
  blockHash:
    "0x06668ec48e8fd2f9dd7873e28fd5ad940c1946b5b61adc4ab6d7a0d0d79a7dd9",
  blockNumber: "0x005e422e",
  era: "0xe400",
  genesisHash:
    "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f",
  method:
    "0x0a0300183982ce80e4b52f2e80aaf36d18b1eba1a32005ffbefd952962227f2f4db30902286bee",
  nonce: "0x00000001",
  signedExtensions: [
    "CheckNonZeroSender",
    "CheckSpecVersion",
    "CheckTxVersion",
    "CheckGenesis",
    "CheckMortality",
    "CheckNonce",
    "CheckWeight",
    "ChargeAssetTxPayment",
  ],
  tip: "0x00000000000000000000000000000000",
  version: 4,
};

export const DEFAULT_API_URL =
  "https://api.zondax.ch/polkadot/transaction/metadata";

export const DEFAULT_CHAIN_ID = "dot-hub";

export const DEFAULT_WS_URL = "wss://statemint-rpc.dwellir.com";
