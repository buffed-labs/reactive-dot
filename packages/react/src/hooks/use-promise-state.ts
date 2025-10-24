import { FulfilledPromise } from "../utils/react-promise.js";
import { pending } from "@reactive-dot/core";
import { useEffect, useState } from "react";

/**
 * Hook for tracking promise state with a fallback value.
 *
 * @group Hooks
 * @param promise - The promise to track
 * @param fallback - The fallback function to provide a default value
 * @returns The state of the promise or fallback
 */
export function usePromiseState<TValue, TFallback = typeof pending>(
  promise: Promise<TValue>,
  fallback: (
    prev?: TValue | TFallback,
  ) => TValue | TFallback = defaultFallback as () => TFallback,
) {
  const [value, setValue] = useState<TValue | TFallback | ErrorContainer>(() =>
    fallback(),
  );

  if (value instanceof ErrorContainer) {
    throw value.error;
  }

  const [prevPromise, setPrevPromise] = useState(promise);
  if (promise !== prevPromise) {
    setPrevPromise(promise);
  }

  if (promise instanceof FulfilledPromise && promise.value !== value) {
    setValue(promise.value);
  }

  if (!(promise instanceof FulfilledPromise) && promise !== prevPromise) {
    setValue(fallback(value));
  }

  useEffect(() => {
    if (promise instanceof FulfilledPromise) {
      return;
    }

    const abortController = new AbortController();

    promise
      .then((value) => {
        if (!abortController.signal.aborted) {
          setValue(value);
        }
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          setValue(new ErrorContainer(error));
        }
      });

    return () => abortController.abort();
  }, [promise]);

  return value;
}

const defaultFallback = () => pending;

class ErrorContainer {
  constructor(public error: unknown) {}
}
