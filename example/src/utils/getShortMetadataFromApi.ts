import { SignerPayloadJSON } from "@polkadot/types/types";
import { HexString } from "@polkadot/util/types";
import { getHexPayload } from "./getHexPayload";

export const getShortMetadataFromApi = async (
  zondaxApiUrl: string, // https://api.zondax.ch/polkadot/transaction/metadata
  zondaxChainId: string, // dot-hub
  payload: SignerPayloadJSON
) => {
  const hexPayload = getHexPayload(payload);

  const req = await fetch(zondaxApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      chain: { id: zondaxChainId },
      txBlob: hexPayload,
    }),
  });

  if (!req.ok) {
    console.error("Failed to fetch shortened metadata", {
      status: req.status,
      statusText: req.statusText,
    });
    throw new Error("Failed to fetch shortened metadata");
  }

  const { txMetadata } = (await req.json()) as { txMetadata: HexString };

  return txMetadata;
};
