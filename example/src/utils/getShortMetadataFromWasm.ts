import { WsProvider, ApiPromise } from "@polkadot/api";
import { Option } from "@polkadot/types";
import { OpaqueMetadata } from "@polkadot/types/interfaces";
import { SignerPayloadJSON } from "@polkadot/types/types";

import { get_short_metadata } from "@talismn/metadata-shortener-wasm";
import { getHexPayload } from "./getHexPayload";

type ChainProperties = {
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
};

export const getShortMetadata = async (
  wsUrl: string,
  payload: SignerPayloadJSON
) => {
  const provider = new WsProvider(wsUrl);
  await provider.isReady;

  const chainProperties = await provider.send<ChainProperties>(
    "system_properties",
    [],
    true
  );
  console.log({ chainProperties });

  // JSON.stringify(chainProperties, null, 2);

  const api = new ApiPromise({ provider });
  await api.isReady;
  const maybeHexMetadata = await api.call.metadata.metadataAtVersion<
    Option<OpaqueMetadata>
  >(15);

  if (maybeHexMetadata.isNone) throw new Error("metadata not found");
  const hexMetadata = maybeHexMetadata.unwrap().toHex().slice(2);

  const hexPayload = getHexPayload(payload);

  // await new Promise((resolve) => setTimeout(resolve, 1000));

  //   await initMetadataShortener();

  //   return (await get_short_metadata("hi", "hey", {
  //     base58prefix: 0,
  //     decimals: 10,
  //     unit: "dot",
  //   })) as string;

  return (await get_short_metadata(
    hexMetadata,
    hexPayload,
    chainProperties.tokenSymbol,
    chainProperties.tokenDecimals,
    chainProperties.ss58Format
  )) as string;
};
