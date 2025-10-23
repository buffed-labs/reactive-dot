import { useMaybeUse } from "./use-maybe-use.js";
import { renderHook } from "@testing-library/react";
import * as React from "react";
import { expect, it } from "vitest";

it("returns original promise when options.use is false", async () => {
  const promise = Promise.resolve(42);

  const { result } = await React.act(() =>
    renderHook(() => useMaybeUse(promise, { use: false })),
  );

  expect(result.current).resolves.toBe(42);
});

it("suspends and returns resolved value when options.use is true", async () => {
  const promise = Promise.resolve(42);

  const { result } = await React.act(() =>
    renderHook(() => useMaybeUse(promise, { use: true })),
  );

  expect(result.current).toBe(42);
});
