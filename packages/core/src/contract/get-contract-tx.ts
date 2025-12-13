import { pasAh, passet } from "../../.papi/descriptors/dist/index.js";
import { omitUndefinedProperties } from "../utils/omit-undefined-properties.js";
import {
  type Binary,
  CompatibilityLevel,
  type FixedSizeBinary,
  type PolkadotClient,
  type SS58String,
} from "polkadot-api";

export async function getContractTx(
  client: PolkadotClient,
  origin: SS58String,
  dest: FixedSizeBinary<20>,
  value: bigint,
  data: Binary,
  options?: { signal?: AbortSignal },
) {
  const passetApi = client.getTypedApi(passet);

  if (
    await passetApi.apis.ReviveApi.call.isCompatible(CompatibilityLevel.Partial)
  ) {
    const dryRunResult = await passetApi.apis.ReviveApi.call(
      origin,
      dest,
      value,
      undefined,
      undefined,
      data,
      omitUndefinedProperties({ signal: options?.signal }),
    );

    return passetApi.tx.Revive.call({
      dest,
      value,
      weight_limit: dryRunResult.weight_required,
      storage_deposit_limit: dryRunResult.storage_deposit.value,
      data,
    });
  }

  const pasAhApi = client.getTypedApi(pasAh);

  const dryRunResult = await pasAhApi.apis.ReviveApi.call(
    origin,
    dest,
    value,
    undefined,
    undefined,
    data,
    omitUndefinedProperties({ signal: options?.signal }),
  );

  return pasAhApi.tx.Revive.call({
    dest,
    value,
    gas_limit: dryRunResult.gas_required,
    storage_deposit_limit: dryRunResult.storage_deposit.value,
    data,
  });
}
