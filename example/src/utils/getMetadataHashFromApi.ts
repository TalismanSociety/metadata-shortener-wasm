import { HexString } from "@polkadot/util/types";
import urlJoin from "url-join";

export const getMetadataHashFromApi = async (
  zondaxApiUrl: string, // https://api.zondax.ch/polkadot/transaction/metadata
  zondaxChainId: string // dot-hub
) => {
  const req = await fetch(urlJoin(zondaxApiUrl, "/node/metadata/hash"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      id: zondaxChainId,
    }),
  });

  if (!req.ok) {
    console.error("Failed to fetch shortened metadata", {
      status: req.status,
      statusText: req.statusText,
    });
    throw new Error("Failed to fetch shortened metadata");
  }

  const { metadataHash } = (await req.json()) as { metadataHash: HexString };

  return metadataHash;
};
