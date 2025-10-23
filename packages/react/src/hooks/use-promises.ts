import { use } from "react";

/**
 * Hook for using multiple promises in a component. Internally this uses React's {@link https://react.dev/reference/react/use | `use`} API.
 *
 * @group Hooks
 * @see https://react.dev/reference/react/use
 * @param promises - An array of promises to resolve
 * @returns An array of resolved promise values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePromises<T extends readonly Promise<any>[] | []>(
  promises: T,
) {
  const results = [];

  for (const promise of promises) {
    results.push(use(promise));
  }

  return results as {
    [P in keyof T]: Awaited<T[P]>;
  };
}
