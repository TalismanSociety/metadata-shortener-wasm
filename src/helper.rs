use frame_metadata::RuntimeMetadata;
use merkleized_metadata::{FrameMetadataPrepared, SignedExtrinsicData,TypeResolver,CollectAccessedTypes};
use scale_decode::visitor::decode_with_visitor;

pub fn get_parts_len_from_tx_blob(
    mut tx_blob: &[u8],
    metadata: &RuntimeMetadata,
) -> Result<Vec<usize>, String> {
    let mut call_data_len:usize = 0;
    let mut signed_extensions_in_extrinsic_len:usize = 0;

    let prepared = FrameMetadataPrepared::prepare(metadata)?;
    let type_information = prepared.as_type_information()?;

    let tx_blob_ptr = &mut tx_blob;
    let tx_blob_ptr_init_len = tx_blob_ptr.len();

    let type_resolver = TypeResolver::new(type_information.types.values());

    let visitor = CollectAccessedTypes::default();

    let mut visitor = decode_with_visitor(
        tx_blob_ptr,
        type_information.extrinsic_metadata.call_ty,
        &type_resolver,
        visitor,
    )
        .map_err(|e| format!("Failed to decode call: {e}"))?;

    call_data_len = tx_blob_ptr_init_len - tx_blob_ptr.len();

    if !tx_blob_ptr.is_empty() {
        let included_in_extrinsic = &tx_blob_ptr.to_vec();
        let signed_ext_data:Option<SignedExtrinsicData> = Some(SignedExtrinsicData{
            included_in_extrinsic,
            included_in_signed_data: &[],
        });

        let visitor = signed_ext_data
            .map(|mut signed_ext_data| {
                visitor.collect_all_types(
                    &type_information.extrinsic_metadata.address_ty,
                    &type_information,
                );
                visitor.collect_all_types(
                    &type_information.extrinsic_metadata.signature_ty,
                    &type_information,
                );

                let included_in_extrinsic_ptr = &mut signed_ext_data.included_in_extrinsic;
                let initial_len = included_in_extrinsic_ptr.len();

                let fold_result = type_information
                    .extrinsic_metadata
                    .signed_extensions
                    .iter()
                    .try_fold(visitor.clone(), |visitor, se| {
                        decode_with_visitor(
                            included_in_extrinsic_ptr,
                            se.included_in_extrinsic,
                            &type_resolver,
                            visitor,
                        )
                            .map_err(|e| format!("Failed to decode data in extrinsic ({}): {e}", se.identifier))
                    });

                // Handle the fold result and calculate the length
                fold_result.map(|final_visitor| {
                    signed_extensions_in_extrinsic_len = initial_len - included_in_extrinsic_ptr.len();
                    final_visitor
                })
            })
            .unwrap_or_else(|| Ok(visitor))?; // Handle error case or provide default
    }

    return Ok(Vec::from([call_data_len, signed_extensions_in_extrinsic_len]))
}