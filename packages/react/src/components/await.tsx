import { use } from "react";

type AwaitProps<T> = {
  /**
   * The promise to await.
   */
  promise: Promise<T>;
  /**
   * The render prop that receives the resolved value.
   *
   * @param result - The resolved value of the promise.
   * @returns A React node to render
   */
  children: (result: T) => React.ReactNode;
};

/**
 * Component for awaiting a promise and rendering its result.
 *
 * @group Components
 */
export function Await<T>({ promise, children }: AwaitProps<T>) {
  return <>{children(use(promise))}</>;
}
