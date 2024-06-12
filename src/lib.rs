/**
   Adapted from https://github.com/Zondax/ledger-polkadot-generic-api/blob/master/rust/src/lib.rs
   Changes June 7th 2024 : 
   - adjusted get_short_metadata_from_tx_blob signature to be wasm-bindgen compliant
   - removed unused code
   
   Copyright 2024 Zondax

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

mod helper;

use parity_scale_codec::{Decode, Encode};
use frame_metadata::v15::RuntimeMetadataV15;
use frame_metadata::{RuntimeMetadata, RuntimeMetadataPrefixed};
use merkleized_metadata::{
    generate_proof_for_extrinsic_parts, generate_metadata_digest, ExtraInfo, ExtrinsicMetadata,
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
pub fn get_short_metadata_from_tx_blob(metadata_v15:String, payload:String, token_symbol:String, decimals:u8, base58_prefix:u16, spec_name:String, spec_version:u32) -> Result<String, JsError> {
    
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
            Err(err) => return Err(JsError::new(&err)),
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
            Err(err) => return Err(JsError::new(&err)),
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
    Ok(hex::encode(meta_proof.encode()))
}

#[wasm_bindgen]
pub fn get_metadata_digest(metadata_v15:String, token_symbol:String, decimals:u8, base58_prefix:u16, spec_name:String, spec_version:u32)  -> Result<String, JsError> {
    let specs = ExtraInfo {
        base58_prefix,
        decimals,
        token_symbol,
        spec_name,
        spec_version,
    };
    
    let metadata = hex::decode(metadata_v15).unwrap();
    let runtime_meta_v15 = RuntimeMetadataV15::decode(&mut &metadata[5..]).unwrap();
    let runtime_meta = RuntimeMetadata::V15(runtime_meta_v15);

    let digest = match generate_metadata_digest(&runtime_meta, specs) {
        Ok(x) => hex::encode(x.hash()),
        Err(err) => return Err(JsError::new(&err)),
    };
    Ok(digest)
}