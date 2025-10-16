import { canRefresh, refresh } from "../utils/refreshable.js";
import { internal_useChainId } from "./use-chain-id.js";
import { metadataSymbol, useLazyValuesCache } from "./use-lazy-value.js";
import {
  chainQueryCacheKeyPrefix,
  inkQueryCacheKeyPrefix,
  type QueryContractInstructionMetadata,
  type QueryInstructionMetadata,
  queryObservable,
  solidityQueryCacheKeyPrefix,
} from "./use-query.js";
import { useTypedApiPromise } from "./use-typed-api.js";
import { Query } from "@reactive-dot/core";
import type { DataStore } from "@reactive-dot/core/internal.js";
import { computed, toValue } from "vue";

export function useStore(): DataStore {
  const chainId = internal_useChainId();
  const typedApiPromise = useTypedApiPromise();
  const cache = useLazyValuesCache();

  return {
    invalidateQuery: (builder, options) =>
      refresh(
        queryObservable(
          computed(() => options?.chainId ?? toValue(chainId)),
          typedApiPromise,
          builder(new Query()),
          cache,
        ),
      ),
    invalidateChainQueries: (shouldInvalidate, options) =>
      toValue(cache).forEach((value, key) => {
        if (
          key.startsWith(chainQueryCacheKeyPrefix) &&
          canRefresh(value) &&
          metadataSymbol in value
        ) {
          const metadata = value[metadataSymbol] as QueryInstructionMetadata;

          if (
            metadata.chainId === (options?.chainId ?? toValue(chainId)) &&
            shouldInvalidate(metadata.instruction)
          ) {
            refresh(value);
          }
        }
      }),
    invalidateContractQueries: (shouldInvalidate, options) =>
      toValue(cache).forEach((value, key) => {
        if (
          (key.startsWith(inkQueryCacheKeyPrefix) ||
            key.startsWith(solidityQueryCacheKeyPrefix)) &&
          canRefresh(value) &&
          metadataSymbol in value
        ) {
          const metadata = value[
            metadataSymbol
          ] as QueryContractInstructionMetadata;

          if (
            metadata.chainId === (options?.chainId ?? toValue(chainId)) &&
            shouldInvalidate(metadata.instruction)
          ) {
            refresh(value);
          }
        }
      }),
  };
}
