import { lazyValuesKey } from "../keys.js";
import {
  refresh,
  type Refreshable,
  refreshable,
} from "../utils/refreshable.js";
import { BaseError } from "@reactive-dot/core";
import { catchError, isObservable, shareReplay } from "rxjs";
import {
  computed,
  type ComputedRef,
  inject,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
  shallowRef,
  toValue,
} from "vue";

type Key = string | number | undefined;

/**
 * @internal
 */
export function useLazyValue<T>(key: MaybeRefOrGetter<Key[]>, get: () => T) {
  return lazyValue(key, get, useLazyValuesCache());
}

/**
 * @internal
 */
export function useLazyValuesCache() {
  const cache = inject(lazyValuesKey);

  if (cache === undefined) {
    throw new BaseError("No lazy values cache provided");
  }

  return cache;
}

/** @internal */
export const erroredSymbol = Symbol("errored");

/** @internal */
export const metadataSymbol = Symbol("metadata");

export function lazyValue<T>(
  key: MaybeRefOrGetter<Key[]>,
  get: () => T,
  cache: MaybeRefOrGetter<Map<string, ShallowRef<unknown>>>,
  metadata?: MaybeRefOrGetter<unknown>,
) {
  const makeRefreshable = <T extends Ref>(ref: T) =>
    refreshable(ref, () => void put(true));

  const put = (force = false) => {
    const stringKey = toValue(key).join("/");

    const hasValue = toValue(cache).has(stringKey);

    const refValue = (
      hasValue
        ? toValue(cache).get(stringKey)!
        : toValue(cache)
            .set(
              stringKey,
              makeRefreshable(
                Object.assign(shallowRef(), {
                  [metadataSymbol]: toValue(metadata),
                }),
              ),
            )
            .get(stringKey)!
    ) as ShallowRef<T>;

    const tagAsErrored = () =>
      Object.assign(refValue, { [erroredSymbol]: true });

    if (!hasValue || force) {
      try {
        refValue.value = get();
      } catch (error) {
        tagAsErrored();
        throw error;
      }
    }

    if (refValue.value instanceof Promise) {
      refValue.value = refValue.value.catch((error) => {
        tagAsErrored();
        throw error;
      }) as T;
    } else if (isObservable(refValue.value)) {
      refValue.value = refValue.value.pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        catchError((error) => {
          tagAsErrored();
          throw error;
        }),
      ) as T;
    }

    return refValue.value;
  };

  return makeRefreshable(computed(() => put()));
}

export function mapLazyValue<T, U>(
  value: Refreshable<ComputedRef<T>>,
  mapper: (value: T) => U,
) {
  return refreshable(
    computed(() => mapper(value.value)),
    () => refresh(value),
  );
}
