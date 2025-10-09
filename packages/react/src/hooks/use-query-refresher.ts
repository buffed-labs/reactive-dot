import type { ChainHookOptions, QueryArgument, QueryOptions } from "./types.js";
import { useQueryOptions } from "./use-query-options.js";
import { useStore } from "./use-store.js";
import { type ChainId } from "@reactive-dot/core";
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
>(query: TQuery, options?: ChainHookOptions<TChainId>): () => void;
/**
 * Hook for refreshing cached query.
 *
 * @deprecated Use the `useStore` hook and call `invalidateQuery` instead.
 * @param options - The query options
 * @returns The function to refresh the query
 */
export function useQueryRefresher<
  TChainIds extends Array<ChainId | undefined>,
  const TOptions extends {
    [P in keyof TChainIds]: QueryOptions<TChainIds[P]>;
  },
>(
  options: TOptions & {
    [P in keyof TChainIds]: QueryOptions<TChainIds[P]>;
  },
): () => void;
/**
 * Hook for refreshing cached query.
 * @deprecated Use the `useStore` hook and call `invalidateQuery` instead.
 * @group Hooks
 * @param query - The function to create the query
 * @param options - Additional options
 * @returns The function to refresh the query
 */
export function useQueryRefresher(
  queryOrOptions: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | QueryArgument<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Array<ChainHookOptions<any> & { query: QueryArgument<any> }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mayBeOptions?: ChainHookOptions<any>,
) {
  const options = useQueryOptions(
    // @ts-expect-error complex overload
    queryOrOptions,
    mayBeOptions,
  );

  const store = useStore();

  return useCallback(() => {
    for (const { chainId, query } of options) {
      if (query !== undefined) {
        store.invalidateQuery(() => query, { chainId });
      }
    }
  }, [options, store]);
}
