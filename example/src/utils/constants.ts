import { SignerPayloadJSON } from "@polkadot/types/types";

export const DEFAULT_PAYLOAD: SignerPayloadJSON = {
  address: "5EXb7e8Kq9m62XTFKVYmGsHFADU4knyFNg6NKJmLKDCz4Gij",
  //assetId: null,
  blockHash:
    "0x67298e0fc6d5a46167e7d56632cdad9217b1a6b605f8caed7562b6f0113bb3e8",
  blockNumber: "0x00a46448",
  era: "0x8500",
  genesisHash:
    "0x6408de7737c59c238890533af25896a2c20608d8b380bb01029acb392781063e",
  //metadataHash: null,
  method:
    "0x0403006cf965cfdd16d81eed9bf10c09a9d0da0141ab7a2419d1ca3045002fd11563110700e8764817",
  //mode: 0,
  nonce: "0x00000002",
  signedExtensions: [
    "CheckNonZeroSender",
    "CheckSpecVersion",
    "CheckTxVersion",
    "CheckGenesis",
    "CheckMortality",
    "CheckNonce",
    "CheckWeight",
    "ChargeTransactionPayment",
    "CheckMetadataHash",
  ],
  specVersion: "0x000f7121",
  tip: "0x00000000000000000000000000000000",
  transactionVersion: "0x0000001a",
  version: 4,
};

export const DEFAULT_API_URL = "https://api.zondax.ch/polkadot";

export const DEFAULT_CHAIN_ID = "roc";

export const DEFAULT_WS_URL = "wss://rococo-rpc.polkadot.io";
