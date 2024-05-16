import { TypeRegistry } from "@polkadot/types";
import { SignerPayloadJSON } from "@polkadot/types/types";
import { u8aToHex } from "@polkadot/util";

export const getHexPayload = (payload: SignerPayloadJSON) => {
  const registry = new TypeRegistry();
  registry.setSignedExtensions(payload.signedExtensions);
  const extPayload = registry.createType("ExtrinsicPayload", payload, {
    version: payload.version,
  });

  return u8aToHex(extPayload.toU8a(true));
};
