import type { SuspenseOptions, When } from "./types.js";
import { use } from "react";

/**
 * @internal
 * @group Hooks
 */
export function useMaybeUse<T, TUse extends boolean = true>(
  promise: Promise<T>,
  options: SuspenseOptions<TUse> | undefined,
) {
  return (options?.use === false ? promise : use(promise)) as When<
    TUse,
    T,
    Promise<T>
  >;
}
