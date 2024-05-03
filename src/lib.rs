use parity_scale_codec::{Decode, Encode};
use frame_metadata::v15::RuntimeMetadataV15;
use metadata_shortener::{
    cut_metadata_transaction_unmarked,
    traits::Blake3Leaf,
    ShortSpecs,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_short_metadata(
    opaque_metadata_v15:String, payload:String, unit:String, decimals:u8, base58prefix:u16
) -> String {
  
    let data = hex::decode(payload).unwrap();
    
    let opaque_metadata = hex::decode(opaque_metadata_v15).unwrap();
    let full_metadata = RuntimeMetadataV15::decode(&mut &opaque_metadata[5..]).unwrap();

    let short_specs = ShortSpecs {
        unit,
        decimals,
        base58prefix,
    };

    let short_metadata = match cut_metadata_transaction_unmarked::<_, _, Blake3Leaf, _>(
        &data.as_ref(),
        &mut (),
        &full_metadata,
        &short_specs,
    ) {
        Ok(x) => hex::encode(x.encode()),
        Err(err) => err.to_string(),
    };

    short_metadata
    
}
