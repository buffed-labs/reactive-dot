/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CommonDescriptor } from "../chains.js";
import type {
  InferInstructionResponse,
  SimpleQueryInstruction,
} from "../query-builder.js";
import type { ChainDefinition, TypedApi } from "polkadot-api";
import { filter, map, type Observable } from "rxjs";

export function query<
  TInstruction extends SimpleQueryInstruction,
  TDescriptor extends ChainDefinition = CommonDescriptor,
>(
  api: TypedApi<TDescriptor>,
  instruction: TInstruction,
  options?: { signal?: AbortSignal },
): InferInstructionResponse<TInstruction> {
  switch (instruction.type) {
    case "constant":
      return (
        api.constants[instruction.pallet]![instruction.constant] as any
      )();
    case "runtime-api":
      return (api.apis[instruction.api]![instruction.method] as any)(
        ...instruction.args,
        { signal: options?.signal, at: instruction.at },
      );
    case "storage": {
      const storageEntry = api.query[instruction.pallet]![
        instruction.storage
      ] as any;

      return instruction.at?.startsWith("0x")
        ? storageEntry.getValue(...instruction.keys, { at: instruction.at })
        : storageEntry.watchValue(
            ...instruction.keys,
            ...[instruction.at].filter((x) => x !== undefined),
          );
    }
    case "storage-entries":
      return instruction.at?.startsWith("0x")
        ? (api.query[instruction.pallet]![instruction.storage] as any)
            .getEntries(...instruction.args, {
              signal: options?.signal,
              at: instruction.at,
            })
            .then((response: Array<{ keyArgs: unknown; value: unknown }>) =>
              response.map(({ keyArgs, value }) =>
                Object.assign([keyArgs, value], {
                  /** @deprecated Use index access instead. */
                  keyArgs,
                  /** @deprecated Use index access instead. */
                  value,
                }),
              ),
            )
        : ((
            (
              api.query[instruction.pallet]![instruction.storage] as any
            ).watchEntries(...instruction.args, {
              at: instruction.at,
            }) as Observable<{
              entries: Array<{ args: unknown; value: unknown }>;
              deltas: null | {
                deleted: unknown[];
                upserted: unknown[];
              };
            }>
          ).pipe(
            filter((response) => response.deltas !== null),
            map((response) =>
              response.entries.map(({ args, value }) =>
                Object.assign([args, value], {
                  /** @deprecated Use index access instead. */
                  keyArgs: args,
                  /** @deprecated Use index access instead. */
                  value,
                }),
              ),
            ),
          ) as InferInstructionResponse<TInstruction>);
  }
}

export function preflight(instruction: SimpleQueryInstruction) {
  if ("at" in instruction && instruction.at?.startsWith("0x")) {
    return "promise";
  }

  switch (instruction.type) {
    case "constant":
    case "runtime-api":
      return "promise";
    case "storage-entries":
    case "storage":
      return "observable";
  }
}
