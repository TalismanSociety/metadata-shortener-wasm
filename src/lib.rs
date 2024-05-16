mod helper;

use parity_scale_codec::{Decode, Encode};
use frame_metadata::v15::RuntimeMetadataV15;
use frame_metadata::{RuntimeMetadata, RuntimeMetadataPrefixed};
use merkleized_metadata::{
    generate_proof_for_extrinsic_parts, ExtraInfo, ExtrinsicMetadata,
    FrameMetadataPrepared, Proof, SignedExtrinsicData
};
use wasm_bindgen::prelude::*;

use crate::helper::get_parts_len_from_tx_blob;

#[derive(Encode)]
pub struct MetadataProof {
    proof: Proof,
    extrinsic: ExtrinsicMetadata,
    extra_info: ExtraInfo,
}

#[wasm_bindgen]
pub fn get_short_metadata_from_tx_blob(metadata_v15:String, payload:String, token_symbol:String, decimals:u8, base58_prefix:u16, spec_name:String, spec_version:u32) -> String {
    
    let specs = ExtraInfo {
        base58_prefix,
        decimals,
        token_symbol,
        spec_name,
        spec_version,
    };

    let tx_blob = hex::decode(payload).unwrap();
    
    let metadata = hex::decode(metadata_v15).unwrap();
    let runtime_meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
    let runtime_meta = RuntimeMetadata::V15(runtime_meta_v15);

    let parts_lens =
        match get_parts_len_from_tx_blob(&tx_blob, &runtime_meta) {
            Ok(x) => x,
            Err(err) => return err,
        };

    let call_data = tx_blob[0..parts_lens[0]].to_vec();
    let se_included_in_extrinsic = tx_blob[parts_lens[0]..parts_lens[0] + parts_lens[1]].to_vec();
    let se_included_in_signed_data = tx_blob[parts_lens[0] + parts_lens[1]..].to_vec();

    let sig_ext = SignedExtrinsicData {
        included_in_signed_data: &se_included_in_signed_data,
        included_in_extrinsic: &se_included_in_extrinsic,
    };
    let registry_proof =
        match generate_proof_for_extrinsic_parts(&call_data, Some(sig_ext), &runtime_meta) {
            Ok(x) => x,
            Err(err) => return err,
        };

    // Generates extrinsic_metadata in the same way the crate does
    let extrinsic_metadata = FrameMetadataPrepared::prepare(
        &RuntimeMetadataPrefixed::decode(&mut &metadata[..])
            .unwrap()
            .1,
    )
        .unwrap()
        .as_type_information()
        .unwrap()
        .extrinsic_metadata;

    let meta_proof = MetadataProof {
        proof: registry_proof,
        extrinsic: extrinsic_metadata,
        extra_info: specs,
    };
    hex::encode(meta_proof.encode())
}
