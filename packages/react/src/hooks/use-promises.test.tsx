import { usePromises } from "./use-promises.js";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";

describe("usePromises", () => {
  const stablePromise1 = Promise.resolve(1);
  const stablePromise2 = Promise.resolve("test");
  const stablePromise3 = Promise.resolve({ key: "value" });

  it("should resolve promises and return their values", async () => {
    const { result } = await act(() =>
      renderHook(() => usePromises([stablePromise1, stablePromise2])),
    );

    await act(() => Promise.resolve());

    expect(result.current).toEqual([1, "test"]);
  });

  it("should return an empty array when given an empty array of promises", async () => {
    const { result } = await act(() => renderHook(() => usePromises([])));

    await act(() => Promise.resolve());

    expect(result.current).toEqual([]);
  });

  it("should preserve promise order in results", async () => {
    const { result } = await act(() =>
      renderHook(() =>
        usePromises([stablePromise1, stablePromise2, stablePromise3]),
      ),
    );

    await act(() => Promise.resolve());

    expect(result.current).toEqual([1, "test", { key: "value" }]);
  });

  it("should handle different resolved value types", async () => {
    const stablePromise4 = Promise.resolve(null);
    const { result } = await act(() =>
      renderHook(() =>
        usePromises([
          stablePromise1,
          stablePromise2,
          stablePromise3,
          stablePromise4,
        ]),
      ),
    );

    await act(() => Promise.resolve());

    expect(result.current).toEqual([1, "test", { key: "value" }, null]);
  });
});
