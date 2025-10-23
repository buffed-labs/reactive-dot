import type { ChainHookOptions, QueryArgument } from "./types.js";
import { useStore } from "./use-store.js";
import { Query, type ChainId } from "@reactive-dot/core";
import { useCallback } from "react";

/**
 * Hook for refreshing cached query.
 *
 * @deprecated Use the `useStore` hook and call `invalidateQuery` instead.
 * @group Hooks
 * @param query - The function to create the query
 * @param options - Additional options
 * @returns The function to refresh the query
 */
export function useQueryRefresher<
  TChainId extends ChainId | undefined,
  TQuery extends QueryArgument<TChainId>,
>(query: TQuery, options?: ChainHookOptions<TChainId>) {
  const store = useStore();

  return useCallback(() => {
    const queryValue = !query
      ? undefined
      : query instanceof Query
        ? query
        : query(new Query());

    if (!queryValue) {
      return;
    }

    return store.invalidateQuery(() => queryValue, options);
  }, [options, query, store]);
}
