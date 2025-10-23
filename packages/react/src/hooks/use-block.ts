import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import { atomWithObservableAndPromise } from "../utils/jotai/atom-with-observable-and-promise.js";
import type { ChainHookOptions, SuspenseOptions } from "./types.js";
import { internal_useChainId } from "./use-chain-id.js";
import { clientAtom } from "./use-client.js";
import { useConfig } from "./use-config.js";
import { useMaybeUse } from "./use-maybe-use.js";
import { usePausableAtomValue } from "./use-pausable-atom-value.js";
import { useStablePromise } from "./use-stable-promise.js";
import { type ChainId, type Config } from "@reactive-dot/core";
import { getBlock } from "@reactive-dot/core/internal/actions.js";
import { from } from "rxjs";
import { switchMap } from "rxjs/operators";

/**
 * Hook for fetching information about the latest block.
 *
 * @group Hooks
 * @param tag - Which block to target
 * @param options - Additional options
 * @returns The latest finalized or best block
 */
export function useBlock<TUse extends boolean = true>(
  tag: "best" | "finalized" = "finalized",
  options?: ChainHookOptions & SuspenseOptions<TUse>,
) {
  const config = useConfig();
  const chainId = internal_useChainId(options);

  return useMaybeUse(
    useStablePromise(
      usePausableAtomValue(
        tag === "finalized"
          ? finalizedBlockAtom(config, chainId)
          : bestBlockAtom(config, chainId),
      ),
    ),
    options,
  );
}

/**
 * @internal
 */
export const finalizedBlockAtom = atomFamilyWithErrorCatcher(
  (withErrorCatcher, config: Config, chainId: ChainId) =>
    atomWithObservableAndPromise(
      (get) =>
        from(get(clientAtom(config, chainId))).pipe(
          switchMap((client) => getBlock(client, { tag: "finalized" })),
        ),
      withErrorCatcher,
    ),
);

/**
 * @internal
 */
export const bestBlockAtom = atomFamilyWithErrorCatcher(
  (withErrorCatcher, config: Config, chainId: ChainId) =>
    atomWithObservableAndPromise(
      (get) =>
        from(get(clientAtom(config, chainId))).pipe(
          switchMap((client) => getBlock(client, { tag: "best" })),
        ),
      withErrorCatcher,
    ),
);
