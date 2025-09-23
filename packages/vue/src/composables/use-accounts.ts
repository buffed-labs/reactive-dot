import type { ChainComposableOptions } from "../types.js";
import { useAsyncData } from "./use-async-data.js";
import { internal_useChainId } from "./use-chain-id.js";
import { useChainSpecDataPromise } from "./use-chain-spec-data.js";
import { useLazyValue } from "./use-lazy-value.js";
import { useConnectedWalletsObservable } from "./use-wallets.js";
import { getAccounts } from "@reactive-dot/core/internal/actions.js";
import { computed, type MaybeRefOrGetter, toValue } from "vue";

/**
 * Composable for getting currently connected accounts.
 *
 * @param options - Additional options
 * @returns The currently connected accounts
 */
export function useAccounts(
  options?: ChainComposableOptions | { chainId: MaybeRefOrGetter<null> },
) {
  return useAsyncData(useAccountsPromise(options));
}

function useAccountsPromise(
  options?: ChainComposableOptions | { chainId: MaybeRefOrGetter<null> },
) {
  const safeOptions = {
    ...options,
    chainId: computed(() => toValue(options?.chainId) ?? undefined),
  };

  const chainId = internal_useChainId({
    ...safeOptions,
    optionalChainId: true,
  });

  const safeChainId = computed(() =>
    toValue(options?.chainId) === null ? undefined : toValue(chainId),
  );

  const connectedWalletsObservable = useConnectedWalletsObservable();
  const chainSpecPromise = useChainSpecDataPromise(safeOptions);

  return useLazyValue(
    computed(() =>
      safeChainId.value === undefined
        ? ["accounts"]
        : ["accounts", safeChainId.value],
    ),
    () =>
      getAccounts(
        connectedWalletsObservable.value,
        safeChainId.value === undefined ? undefined : chainSpecPromise.value,
      ),
  );
}
