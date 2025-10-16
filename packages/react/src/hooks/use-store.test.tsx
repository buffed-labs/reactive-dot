import { ChainProvider } from "../contexts/chain.js";
import { ReactiveDotProvider } from "../contexts/provider.js";
import { useLazyLoadQuery } from "./use-query.js";
import { useStore } from "./use-store.js";
import { defineConfig } from "@reactive-dot/core";
import { renderHook } from "@testing-library/react";
import { atom } from "jotai";
import { act, Suspense } from "react";
import { beforeEach, expect, test, vi } from "vitest";

let counts = new Map<string, number>();

vi.mock("./use-typed-api.js", () => ({
  typedApiAtom: vi.fn(() =>
    atom(
      Promise.resolve(
        new Proxy(
          {},
          {
            get(_, prop1) {
              return new Proxy(
                {},
                {
                  get(_, prop2) {
                    return new Proxy(
                      {},
                      {
                        get(_, prop3) {
                          const key = [prop1, prop2, prop3].join();
                          return vi.fn(async () => {
                            const curr = counts.get(key) ?? 0;
                            counts.set(key, curr + 1);
                            return curr;
                          });
                        },
                      },
                    );
                  },
                },
              );
            },
          },
        ),
      ),
    ),
  ),
}));

beforeEach(() => {
  counts = new Map();
});

test("invalidateQuery", async () => {
  const { result } = await act(() =>
    renderHook(
      () => {
        return [
          useLazyLoadQuery((query) =>
            query.runtimeApi("foo", "bar", []).runtimeApi("x", "y", []),
          ),
          useStore(),
        ] as const;
      },
      {
        wrapper: ({ children }) => (
          <ReactiveDotProvider config={defineConfig({ chains: {} })}>
            <ChainProvider chainId="test-chain">
              <Suspense>{children}</Suspense>
            </ChainProvider>
          </ReactiveDotProvider>
        ),
      },
    ),
  );

  expect(result.current[0]).toEqual([0, 0]);

  await act(() =>
    result.current[1].invalidateQuery((query) =>
      query.runtimeApi("foo", "bar", []).runtimeApi("x", "y", []),
    ),
  );

  expect(result.current[0]).toEqual([1, 1]);
});

test("invalidateChainQueries", async () => {
  const { result } = await act(() =>
    renderHook(
      () => {
        return [
          useLazyLoadQuery((query) =>
            query
              .runtimeApi("foo", "bar", [])
              .runtimeApi("foo", "baz", [])
              .runtimeApi("x", "y", [])
              .runtimeApi("ping", "pong", []),
          ),
          useStore(),
        ] as const;
      },
      {
        wrapper: ({ children }) => (
          <ReactiveDotProvider config={defineConfig({ chains: {} })}>
            <ChainProvider chainId="test-chain">
              <Suspense>{children}</Suspense>
            </ChainProvider>
          </ReactiveDotProvider>
        ),
      },
    ),
  );

  expect(result.current[0]).toEqual([0, 0, 0, 0]);

  await act(() =>
    result.current[1].invalidateChainQueries(
      (instruction) =>
        instruction.type === "runtime-api" && instruction.api === "foo",
    ),
  );

  expect(result.current[0]).toEqual([1, 1, 0, 0]);
});
