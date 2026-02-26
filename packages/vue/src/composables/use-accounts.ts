import type { ChainComposableOptions } from "../types.js";
import { useAsyncData } from "./use-async-data.js";
import { internal_useChainId } from "./use-chain-id.js";
import { useChainSpecDataPromise } from "./use-chain-spec-data.js";
import { useConfig } from "./use-config.js";
import { useLazyValue } from "./use-lazy-value.js";
import { useConnectedWalletsObservable } from "./use-wallets.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import { stringify } from "@reactive-dot/core/internal.js";
import { getAccounts } from "@reactive-dot/core/internal/actions.js";
import { computed, type MaybeRefOrGetter, toValue } from "vue";

type UseAccountsOptions = (
  | ChainComposableOptions
  | { chainId: MaybeRefOrGetter<null> }
) & {
  chainSpec?: MaybeRefOrGetter<ChainSpecData>;
};

/**
 * Composable for getting currently connected accounts.
 *
 * @param options - Additional options
 * @returns The currently connected accounts
 */
export function useAccounts(options?: UseAccountsOptions) {
  return useAsyncData(useAccountsPromise(options));
}

function useAccountsPromise(options?: UseAccountsOptions) {
  const config = useConfig();
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
      options?.chainSpec === undefined
        ? ["accounts", toValue(safeChainId)]
        : ["accounts", stringify(toValue(options.chainSpec))],
    ),
    () => {
      const includeEvmAccounts = toValue(config).includeEvmAccounts;
      return getAccounts(
        connectedWalletsObservable.value,
        toValue(options?.chainSpec) ??
          (safeChainId.value === undefined
            ? undefined
            : chainSpecPromise.value),
        undefined,
        includeEvmAccounts !== undefined ? { includeEvmAccounts } : undefined,
      );
    },
  );
}
