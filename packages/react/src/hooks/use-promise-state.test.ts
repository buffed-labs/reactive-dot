import { usePromiseState } from "./use-promise-state.js";
import { pending } from "@reactive-dot/core";
import { act, renderHook } from "@testing-library/react";
import { useCallback } from "react";
import { expect, it } from "vitest";

it("returns resolved value", async () => {
  const { promise, resolve } = Promise.withResolvers<true>();

  const { result } = renderHook(() => usePromiseState(promise));

  expect(result.current).toBe(pending);

  await act(() => resolve(true));

  expect(result.current).toBeTruthy();
});

it("returns fallback while promise is pending", async () => {
  const { promise, resolve } = Promise.withResolvers<true>();

  const { result } = renderHook(() =>
    usePromiseState(
      promise,
      useCallback(() => undefined, []),
    ),
  );

  expect(result.current).toBeUndefined();

  await act(() => resolve(true));

  expect(result.current).toBeTruthy();
});

it("throws rejected promise", async () => {
  const { promise, reject } = Promise.withResolvers<true>();

  const { result } = renderHook(() => usePromiseState(promise));

  expect(result.current).toBe(pending);

  const error = new Error("Test error");

  try {
    await act(() => reject(error));
  } catch (caught) {
    expect(caught).toBe(error);
  }
});
