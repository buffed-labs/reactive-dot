import { toH160Bytes, toSs58String, type Address } from "../../address.js";
import { QueryError } from "../../errors.js";
import { flatHead } from "../../internal.js";
import type { ContractCompatApi } from "../types.js";
import type { SimpleSolidityQueryInstruction } from "./query-builder.js";
import type { Abi } from "abitype";
import { Binary } from "polkadot-api";

export async function querySolidity<
  TAbi extends Abi,
  Instruction extends SimpleSolidityQueryInstruction,
>(
  api: ContractCompatApi,
  abi: TAbi,
  address: Address,
  instruction: Instruction,
  options?: { signal?: AbortSignal },
) {
  const apiOptions = {
    ...(instruction?.at === undefined ? undefined : { at: instruction.at }),
    ...(options?.signal === undefined ? undefined : { signal: options.signal }),
  };

  switch (instruction.type) {
    case "function": {
      const origin = address;

      const { AbiFunction } = await import("ox");

      const abiFunction = AbiFunction.fromAbi(
        abi,
        // @ts-expect-error TODO: fix this
        instruction.name,
      );

      const response = await api.apis.ReviveApi.call(
        toSs58String(origin),
        toH160Bytes(address),
        0n,
        undefined,
        undefined,
        Binary.fromHex(AbiFunction.encodeData(abiFunction, instruction.args)),
        apiOptions,
      );

      if (!response.result.success) {
        throw QueryError.from(response.result.value);
      }

      return flatHead(
        AbiFunction.decodeResult(
          abiFunction,
          response.result.value.data.asHex(),
        ),
      );
    }
  }
}
