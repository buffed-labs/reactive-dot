import { internal_useChainId } from "./use-chain-id.js";
import { useConfig } from "./use-config.js";
import { getQueryInstructionPayloadAtoms } from "./use-query.js";
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
        (
          _,
          set,
          ...[builder, options]: Parameters<DataStore["invalidateQuery"]>
        ) => {
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
  };
}
