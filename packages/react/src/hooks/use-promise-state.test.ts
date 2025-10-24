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

it("reset to pending with a new promise", async () => {
  const { promise: promise1, resolve: resolve1 } =
    Promise.withResolvers<true>();
  const { promise: promise2, resolve: resolve2 } =
    Promise.withResolvers<true>();

  const { result, rerender } = renderHook(
    (promise: Promise<true>) => usePromiseState(promise),
    { initialProps: promise1 },
  );

  expect(result.current).toBe(pending);

  await act(() => resolve1(true));

  expect(result.current).toBeTruthy();

  rerender(promise2);

  expect(result.current).toBe(pending);

  await act(() => resolve2(true));

  expect(result.current).toBeTruthy();
});

it("keep previous value with a new promise", async () => {
  const { promise: promise1, resolve: resolve1 } =
    Promise.withResolvers<string>();
  const { promise: promise2, resolve: resolve2 } =
    Promise.withResolvers<string>();

  const { result, rerender } = renderHook(
    (promise: Promise<string>) =>
      usePromiseState(promise, (prev) => prev ?? pending),
    { initialProps: promise1 },
  );

  expect(result.current).toBe(pending);

  await act(() => resolve1("Hello"));

  expect(result.current).toBe("Hello");

  rerender(promise2);

  expect(result.current).toBe("Hello");

  await act(() => resolve2("World"));

  expect(result.current).toBe("World");
});
