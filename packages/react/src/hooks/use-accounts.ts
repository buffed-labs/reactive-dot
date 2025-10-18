import { emptyArrayAtom } from "../constants/empty-array-atom.js";
import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import { atomWithObservable } from "../utils/jotai/atom-with-observable.js";
import type { ChainHookOptions, DeferOptions } from "./types.js";
import { internal_useChainId } from "./use-chain-id.js";
import { chainSpecDataAtom } from "./use-chain-spec-data.js";
import { useConfig } from "./use-config.js";
import { useSsrValue } from "./use-ssr-value.js";
import { connectedWalletsAtom } from "./use-wallets.js";
import { type ChainId, type Config } from "@reactive-dot/core";
import { getAccounts } from "@reactive-dot/core/internal/actions.js";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useAtomValue } from "jotai";
import { unwrap } from "jotai/utils";

/**
 * Hook for getting currently connected accounts.
 *
 * @group Hooks
 * @param options - Additional options
 * @returns The currently connected accounts
 */
export function useAccounts<TDefer extends boolean = false>(
  options?: (ChainHookOptions | { chainId: null }) & DeferOptions<TDefer>,
) {
  const accountsAtomInstance = accountsAtom(
    useConfig(),
    options?.chainId === null
      ? undefined
      : internal_useChainId({
          ...options,
          optionalChainId: true,
        }),
  );

  return useAtomValue(
    useSsrValue(
      options?.defer ? unwrap(accountsAtomInstance) : accountsAtomInstance,
      emptyArrayAtom,
    ),
  ) as true extends TDefer ? WalletAccount[] | undefined : WalletAccount[];
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
