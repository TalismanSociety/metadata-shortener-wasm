import { WsProvider, ApiPromise } from "@polkadot/api";
import { Option, TypeRegistry } from "@polkadot/types";
import { OpaqueMetadata } from "@polkadot/types/interfaces";
import { SignerPayloadJSON } from "@polkadot/types/types";

import { get_short_metadata_from_tx_blob } from "@talismn/metadata-shortener-wasm";
import { getHexPayload } from "./getHexPayload";
import { u8aToNumber } from "@polkadot/util";
import { hexToNumber } from "@polkadot/util/hex";

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

  const [chainProperties, { specName }] = await Promise.all([
    provider.send<ChainProperties>("system_properties", [], true),
    provider.send<{ specName: string }>("state_getRuntimeVersion", [], true),
  ]);

  const api = new ApiPromise({ provider });
  await api.isReady;
  const maybeHexMetadata = await api.call.metadata.metadataAtVersion<
    Option<OpaqueMetadata>
  >(15);

  if (maybeHexMetadata.isNone) throw new Error("metadata not found");

  const hexMetadata = metadataFromOpaque(maybeHexMetadata.unwrap());

  //check
  const metadata = new TypeRegistry().createType("Metadata", hexMetadata);
  console.log(
    "Metadata version",
    metadata.version,
    hexMetadata.toString().slice(0, 15)
  );

  const hexPayload = getHexPayload(payload);

  return (await get_short_metadata_from_tx_blob(
    hexMetadata.substring(2),
    hexPayload.substring(2),
    chainProperties.tokenSymbol,
    chainProperties.tokenDecimals,
    chainProperties.ss58Format,
    specName,
    hexToNumber(payload.specVersion)
  )) as string;
};

const metadataFromOpaque = (opaque: OpaqueMetadata) => {
  try {
    // pjs codec for OpaqueMetadata doesn't allow us to decode the actual Metadata, find it ourselves
    const u8aBytes = opaque.toU8a();
    for (let i = 0; i < 20; i++) {
      // skip until we find the magic number that is used as prefix of metadata objects (usually in the first 10 bytes)
      if (u8aToNumber(u8aBytes.slice(i, i + 4)) !== 0x6174656d) continue;

      const metadata = new TypeRegistry().createType(
        "Metadata",
        u8aBytes.slice(i)
      );

      return metadata.toHex();
    }
    throw new Error("Magic number not found");
  } catch (err) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "Failed to decode metadata from OpaqueMetadata:" + (err as any).message
    );
  }
};
