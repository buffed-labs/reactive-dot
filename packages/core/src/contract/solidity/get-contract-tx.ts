import { type Address, toH160Bytes } from "../../address.js";
import { getContractTx } from "../get-contract-tx.js";
import type { SolidityTxBody } from "./types.js";
import type { Abi, ExtractAbiFunctionNames } from "abitype";
import {
  AccountId,
  Binary,
  type PolkadotClient,
  type PolkadotSigner,
} from "polkadot-api";

export async function getSolidityContractTx<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, "nonpayable" | "payable">,
>(
  client: PolkadotClient,
  abi: TAbi,
  signer: PolkadotSigner,
  contract: Address,
  functionName: TFunctionName,
  body: SolidityTxBody<TAbi, TFunctionName> | undefined,
  options?: { signal?: AbortSignal },
) {
  const origin = toSs58(signer.publicKey);

  const dest = toH160Bytes(contract);

  const { AbiFunction } = await import("ox");

  const data = Binary.fromHex(
    AbiFunction.encodeData(
      AbiFunction.fromAbi(abi, functionName as `0x${string}`),
      body !== undefined && "args" in body ? body.args : undefined,
    ),
  );

  const value =
    body !== undefined && "value" in body
      ? // TODO: fix this
        (body.value as bigint)
      : 0n;

  return getContractTx(client, origin, dest, value, data, options);
}

const toSs58 = AccountId().dec;
