import { internal_useChainId } from "./use-chain-id.js";
import { useConfig } from "./use-config.js";
import {
  contractInstructionPayloadAtom,
  getQueryInstructionPayloadAtoms,
  instructionPayloadAtom,
} from "./use-query.js";
import { BaseError, Query } from "@reactive-dot/core";
import { type DataStore } from "@reactive-dot/core/internal.js";
import type { WritableAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";

/**
 * Hook for getting the data store.
 * @group Hooks
 */
export function useStore(): DataStore {
  const config = useConfig();
  const chainId = internal_useChainId({ optionalChainId: true });

  return {
    invalidateQuery: useAtomCallback(
      useCallback(
        (_, set, builder, options) => {
          const _chainId = options?.chainId ?? chainId;

          if (_chainId === undefined) {
            throw new BaseError("No chain ID provided");
          }

          const atoms = getQueryInstructionPayloadAtoms(
            config,
            _chainId,
            builder(new Query()),
          ).flat(3);

          for (const atom of atoms) {
            if ("write" in atom.promiseAtom) {
              set(
                atom.promiseAtom as WritableAtom<unknown, unknown[], unknown>,
              );
            }
          }
        },
        [chainId, config],
      ),
    ),
    invalidateChainQueries: useAtomCallback(
      useCallback(
        (_, set, shouldInvalidate, options) => {
          const _chainId = options?.chainId ?? chainId;

          for (const atom of instructionPayloadAtom.values()) {
            if (
              "write" in atom.promiseAtom &&
              (_chainId === undefined || _chainId === atom.__meta?.chainId) &&
              atom.__meta.config === config &&
              shouldInvalidate(atom.__meta.instruction)
            ) {
              set(
                atom.promiseAtom as WritableAtom<unknown, unknown[], unknown>,
              );
            }
          }
        },
        [chainId, config],
      ),
    ),
    invalidateContractQueries: useAtomCallback(
      useCallback(
        (_, set, shouldInvalidate, options) => {
          const _chainId = options?.chainId ?? chainId;

          for (const atom of contractInstructionPayloadAtom.values()) {
            if (
              "write" in atom.promiseAtom &&
              (_chainId === undefined || _chainId === atom.__meta?.chainId) &&
              atom.__meta.config === config &&
              shouldInvalidate(atom.__meta.instruction)
            ) {
              set(
                atom.promiseAtom as WritableAtom<unknown, unknown[], unknown>,
              );
            }
          }
        },
        [chainId, config],
      ),
    ),
  };
}
