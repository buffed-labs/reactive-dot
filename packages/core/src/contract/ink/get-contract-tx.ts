import { type Address, toH160Bytes } from "../../address.js";
import { BaseError } from "../../errors.js";
import type { ExtractExactProperties, StringKeyOf } from "../../types.js";
import { getContractTx } from "../get-contract-tx.js";
import type { GenericInkDescriptors, InkTxBody } from "./types.js";
import type { InkClient } from "@polkadot-api/ink-contracts";
import {
  AccountId,
  type PolkadotClient,
  type PolkadotSigner,
} from "polkadot-api";

export async function getInkContractTx<
  TDescriptor extends GenericInkDescriptors,
  TMessageName extends StringKeyOf<
    ExtractExactProperties<
      TDescriptor["__types"]["messages"],
      { mutates: true }
    >
  >,
>(
  client: PolkadotClient,
  inkClient: InkClient<GenericInkDescriptors>,
  signer: PolkadotSigner,
  contract: Address,
  messageName: TMessageName,
  body?: InkTxBody<TDescriptor, TMessageName> | undefined,
  options?: { signal?: AbortSignal },
) {
  const message = inkClient.message(messageName);

  if (!message.attributes.mutates) {
    throw new BaseError(
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

  return getContractTx(client, origin, dest, value, data, options);
}

const toSs58 = AccountId().dec;
