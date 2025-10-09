import { refresh } from "../utils/refreshable.js";
import { internal_useChainId } from "./use-chain-id.js";
import { useLazyValuesCache } from "./use-lazy-value.js";
import { queryObservable } from "./use-query.js";
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
  };
}
