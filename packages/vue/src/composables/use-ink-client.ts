import type { Refreshable } from "../utils/refreshable.js";
import { lazyValue } from "./use-lazy-value.js";
import type { InkContract } from "@reactive-dot/core/internal.js";
import { getInkClient as baseGetInkClient } from "@reactive-dot/core/internal/actions.js";
import {
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef,
  computed,
} from "vue";

/**
 * @internal
 */
export function getInkClient(
  contract: InkContract,
  cache: MaybeRefOrGetter<Map<string, ShallowRef<unknown>>>,
) {
  return lazyValue(
    computed(() => ["ink-client", contract.id]),
    () => baseGetInkClient(contract),
    cache,
  ) as Refreshable<ComputedRef<ReturnType<typeof baseGetInkClient>>>;
}
