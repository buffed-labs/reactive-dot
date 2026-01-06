/* eslint-disable react-hooks/refs */
import { useRef } from "react";

/**
 * @internal
 * @group Hooks
 */
export function useRenderEffect<T>(effect: () => void, key: T) {
  const prevKeyRef = useRef(key);
  const currKeyRef = useRef(prevKeyRef.current);

  currKeyRef.current = key;

  if (prevKeyRef.current !== currKeyRef.current) {
    prevKeyRef.current = currKeyRef.current;
    effect();
  }
}
