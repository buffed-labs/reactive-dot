import { type Address, toH160Bytes } from "../../address.js";
import type { ExtractExactProperties, StringKeyOf } from "../../types.js";
import { omitUndefinedProperties } from "../../utils/omit-undefined-properties.js";
import type { ContractCompatApi } from "../types.js";
import type { GenericInkDescriptors, InkTxBody } from "./types.js";
import type { InkClient } from "@polkadot-api/ink-contracts";
import { AccountId, type PolkadotSigner } from "polkadot-api";

export async function getInkContractTx<
  TDescriptor extends GenericInkDescriptors,
  TMessageName extends StringKeyOf<
    ExtractExactProperties<
      TDescriptor["__types"]["messages"],
      { mutates: true }
    >
  >,
>(
  api: ContractCompatApi,
  inkClient: InkClient<GenericInkDescriptors>,
  signer: PolkadotSigner,
  contract: Address,
  messageName: TMessageName,
  body?: InkTxBody<TDescriptor, TMessageName> | undefined,
  options?: { signal?: AbortSignal },
) {
  const message = inkClient.message(messageName);

  if (!message.attributes.mutates) {
    throw new Error(
      `Readonly message ${String(messageName)} cannot be used in a mutating transaction`,
    );
  }

  const origin = toSs58(signer.publicKey);

  const dest = toH160Bytes(contract);

  const data = message.encode(
    body !== undefined && "data" in body
      ? // TODO: fix this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (body.data as any)
      : {},
  );

  const value =
    body !== undefined && "value" in body
      ? // TODO: fix this
        (body.value as bigint)
      : 0n;

  const dryRunResult = await api.apis.ReviveApi.call(
    origin,
    dest,
    value,
    undefined,
    undefined,
    data,
    omitUndefinedProperties({ signal: options?.signal }),
  );

  return api.tx.Revive.call({
    dest,
    value,
    gas_limit: dryRunResult.gas_required,
    storage_deposit_limit: dryRunResult.storage_deposit.value,
    data,
  });
}

const toSs58 = AccountId().dec;
