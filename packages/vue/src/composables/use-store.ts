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
import { BaseError, Query } from "@reactive-dot/core";
import type { DataStore } from "@reactive-dot/core/internal.js";
import { computed, toValue } from "vue";

export function useStore(): DataStore {
  const chainId = internal_useChainId({ optionalChainId: true });
  const typedApiPromise = useTypedApiPromise();
  const cache = useLazyValuesCache();

  return {
    invalidateQuery: (builder, options) =>
      refresh(
        queryObservable(
          computed(() => {
            const _chainId = options?.chainId ?? toValue(chainId);

            if (_chainId === undefined) {
              throw new BaseError("No chain ID provided");
            }

            return _chainId;
          }),
          typedApiPromise,
          builder(new Query()),
          cache,
        ),
      ),
    invalidateChainQueries: (shouldInvalidate, options) => {
      const _chainId = options?.chainId ?? toValue(chainId);
      toValue(cache).forEach((value, key) => {
        if (
          key.startsWith(chainQueryCacheKeyPrefix) &&
          canRefresh(value) &&
          metadataSymbol in value
        ) {
          const metadata = value[metadataSymbol] as QueryInstructionMetadata;

          if (
            (_chainId === undefined || _chainId === metadata.chainId) &&
            shouldInvalidate(metadata.instruction)
          ) {
            refresh(value);
          }
        }
      });
    },
    invalidateContractQueries: (shouldInvalidate, options) => {
      const _chainId = options?.chainId ?? toValue(chainId);
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
            (_chainId === undefined || _chainId === metadata.chainId) &&
            shouldInvalidate(metadata.instruction)
          ) {
            refresh(value);
          }
        }
      });
    },
  };
}
