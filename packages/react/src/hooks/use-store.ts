import { internal_useChainId } from "./use-chain-id.js";
import { useConfig } from "./use-config.js";
import {
  contractInstructionPayloadAtom,
  getQueryInstructionPayloadAtoms,
  instructionPayloadAtom,
} from "./use-query.js";
import { Query } from "@reactive-dot/core";
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
  const chainId = internal_useChainId();

  return {
    invalidateQuery: useAtomCallback(
      useCallback(
        (_, set, builder, options) => {
          const atoms = getQueryInstructionPayloadAtoms(
            config,
            options?.chainId ?? chainId,
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
          for (const atom of instructionPayloadAtom.values()) {
            if (
              "write" in atom.promiseAtom &&
              (options?.chainId ?? chainId) === atom.__meta?.chainId &&
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
          for (const atom of contractInstructionPayloadAtom.values()) {
            if (
              "write" in atom.promiseAtom &&
              (options?.chainId ?? chainId) === atom.__meta?.chainId &&
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
