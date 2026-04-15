import type { pasAh, passet } from "../../.papi/descriptors/dist/index.js";
import { omitUndefinedProperties } from "../utils/omit-undefined-properties.js";
import {
  type PolkadotClient,
  type SizedHex,
  type SS58String,
  type TypedApi,
} from "polkadot-api";

export async function getContractTx(
  client: PolkadotClient,
  origin: SS58String,
  dest: SizedHex<20>,
  value: bigint,
  data: Uint8Array,
  options?: { signal?: AbortSignal },
) {
  const passetApi = await getPassetApi(client);

  const dryRunResult = await passetApi.apis.ReviveApi.call(
    origin,
    dest,
    value,
    undefined,
    undefined,
    data,
    omitUndefinedProperties({ signal: options?.signal }),
  );

  if (dryRunResult.weight_required) {
    return passetApi.tx.Revive.call({
      dest,
      value,
      weight_limit: dryRunResult.weight_required,
      storage_deposit_limit: dryRunResult.storage_deposit.value,
      data,
    });
  }

  const pasAhApi = await getPasAhApi(client);

  const pasAhDryRunResult = await pasAhApi.apis.ReviveApi.call(
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
    gas_limit: pasAhDryRunResult.gas_required,
    storage_deposit_limit: pasAhDryRunResult.storage_deposit.value,
    data,
  });
}

const passetApiCache = new WeakMap<PolkadotClient, TypedApi<passet>>();

async function getPassetApi(client: PolkadotClient) {
  const { passet } = await import("../../.papi/descriptors/dist/index.js");

  return (
    passetApiCache.get(client) ??
    passetApiCache.set(client, client.getTypedApi(passet)).get(client)!
  );
}

const pasAhApiCache = new WeakMap<PolkadotClient, TypedApi<pasAh>>();

async function getPasAhApi(client: PolkadotClient) {
  const { pasAh } = await import("../../.papi/descriptors/dist/index.js");

  return (
    pasAhApiCache.get(client) ??
    pasAhApiCache.set(client, client.getTypedApi(pasAh)).get(client)!
  );
}
