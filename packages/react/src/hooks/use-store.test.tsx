import { ChainProvider } from "../contexts/chain.js";
import { ReactiveDotProvider } from "../contexts/provider.js";
import { useLazyLoadQuery } from "./use-query.js";
import { useStore } from "./use-store.js";
import { defineConfig, defineContract } from "@reactive-dot/core";
import { stringify } from "@reactive-dot/core/internal.js";
import { type queryInk } from "@reactive-dot/core/internal/actions.js";
import { renderHook } from "@testing-library/react";
import { atom } from "jotai";
import { act, Suspense } from "react";
import { beforeEach, expect, test, vi } from "vitest";

let counts = new Map<string, number>();

let contractCounts = new Map<string, number>();

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

vi.mock("@reactive-dot/core/internal/actions.js", async (importActual) => ({
  ...(await importActual()),
  queryInk: vi.fn<typeof queryInk>(async (_, __, address, instruction) => {
    const key = [address, stringify(instruction)].join();
    const curr = contractCounts.get(key) ?? 0;
    contractCounts.set(key, curr + 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return curr as any;
  }),
  getInkClient: vi.fn(),
}));

beforeEach(() => {
  counts = new Map();
  contractCounts = new Map();
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

const mockContract = defineContract({
  id: "foo",
  type: "ink",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor: {} as any,
});

test("invalidateContractQueries", async () => {
  const { result } = await act(() =>
    renderHook(
      () => {
        return [
          useLazyLoadQuery((query) =>
            query
              .contract(mockContract, "0x", (query) =>
                query.message("foo").message("bar"),
              )
              .contract(mockContract, "0x1", (query) =>
                query.message("foo").message("bar"),
              ),
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

  expect(result.current[0]).toEqual([
    [0, 0],
    [0, 0],
  ]);

  await act(() =>
    result.current[1].invalidateContractQueries(
      (instruction) =>
        instruction.address === "0x" ||
        (instruction.address === "0x1" &&
          instruction.kind === "ink" &&
          instruction.type === "message" &&
          instruction.name === "foo"),
    ),
  );

  expect(result.current[0]).toEqual([
    [1, 1],
    [1, 0],
  ]);
});
