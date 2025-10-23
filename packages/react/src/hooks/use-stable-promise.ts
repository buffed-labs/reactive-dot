import { ResolvedPromise } from "../utils/react-promise.js";
import { useMemo } from "react";

/**
 * @internal
 */
export function useStablePromise<T>(value: T | Promise<T>): Promise<T> {
  return useMemo(() => ResolvedPromise.from(value), [value]);
}
