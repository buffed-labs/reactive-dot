import { emptyArrayAtom } from "../constants/empty-array-atom.js";
import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import { atomWithObservable } from "../utils/jotai/atom-with-observable.js";
import type { ChainHookOptions, SuspenseOptions } from "./types.js";
import { useAtomValue } from "./use-atom-value.js";
import { internal_useChainId } from "./use-chain-id.js";
import { chainSpecDataAtom } from "./use-chain-spec-data.js";
import { useConfig } from "./use-config.js";
import { useMaybeUse } from "./use-maybe-use.js";
import { useSsrValue } from "./use-ssr-value.js";
import { useStablePromise } from "./use-stable-promise.js";
import { connectedWalletsAtom } from "./use-wallets.js";
import { type ChainId, type Config } from "@reactive-dot/core";
import { getAccounts } from "@reactive-dot/core/internal/actions.js";

/**
 * Hook for getting currently connected accounts.
 *
 * @group Hooks
 * @param options - Additional options
 * @returns The currently connected accounts
 */
export function useAccounts<TUse extends boolean = true>(
  options?: (ChainHookOptions | { chainId: null }) & SuspenseOptions<TUse>,
) {
  return useMaybeUse(
    useStablePromise(
      useAtomValue(
        useSsrValue(
          accountsAtom(
            useConfig(),
            options?.chainId === null
              ? undefined
              : internal_useChainId({
                  ...options,
                  optionalChainId: true,
                }),
          ),
          emptyArrayAtom,
        ),
      ),
    ),
    options,
  );
}

/**
 * @internal
 */
export const accountsAtom = atomFamilyWithErrorCatcher(
  (withErrorCatcher, config: Config, chainId: ChainId | undefined) =>
    withErrorCatcher(
      atomWithObservable((get) =>
        getAccounts(
          get(connectedWalletsAtom(config)),
          chainId === undefined
            ? undefined
            : get(chainSpecDataAtom(config, chainId)),
          undefined,
          config.includeEvmAccounts !== undefined
            ? { includeEvmAccounts: config.includeEvmAccounts }
            : undefined,
        ),
      ),
    ),
);
