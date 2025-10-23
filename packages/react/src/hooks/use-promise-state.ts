import { pending } from "@reactive-dot/core";
import { useEffect, useRef, useState } from "react";

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
  ) => TFallback = defaultFallback as () => TFallback,
) {
  const [value, setValue] = useState<TValue | TFallback | ErrorContainer>(() =>
    fallback(),
  );

  const mounted = useRef(false);

  if (value instanceof ErrorContainer) {
    throw value.error;
  }

  useEffect(
    () => {
      const abortController = new AbortController();

      if (mounted.current) {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setValue(fallback(value));
      }

      mounted.current = true;

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
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [promise],
  );

  return value;
}

const defaultFallback = () => pending;

class ErrorContainer {
  constructor(public error: unknown) {}
}
