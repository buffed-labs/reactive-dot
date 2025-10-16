import { chainIdKey } from "../keys.js";
import { withSetup } from "../test-utils.js";
import { useQuery } from "./use-query.js";
import { useStore } from "./use-store.js";
import { defineContract } from "@reactive-dot/core";
import { stringify } from "@reactive-dot/core/internal.js";
import type { queryInk } from "@reactive-dot/core/internal/actions.js";
import { act } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { nextTick, toValue } from "vue";

let counts = new Map<string, number>();
let contractCounts = new Map<string, number>();

vi.mock("./use-typed-api.js", () => ({
  useTypedApiPromise: vi.fn(
    async () =>
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
}));

vi.mock("@reactive-dot/core/internal/actions.js", async (importActual) => ({
  ...(await importActual()),
  getInkClient: vi.fn(),
  queryInk: vi.fn<typeof queryInk>(async (_, __, address, instruction) => {
    const key = [address, stringify(instruction)].join();
    const curr = contractCounts.get(key) ?? 0;
    contractCounts.set(key, curr + 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return curr as any;
  }),
}));

beforeEach(() => {
  counts = new Map();
  contractCounts = new Map();
});

test("invalidateQuery", async () => {
  const { result } = withSetup(
    () =>
      [
        useQuery((query) =>
          query.runtimeApi("foo", "bar", []).runtimeApi("x", "y", []),
        ),
        useStore(),
      ] as const,
    {
      [chainIdKey]: "test-chain",
    },
  );

  const data = (await result[0]).data;

  expect(toValue(data)).toEqual([0, 0]);

  await act(() =>
    result[1].invalidateQuery((query) =>
      query.runtimeApi("foo", "bar", []).runtimeApi("x", "y", []),
    ),
  );

  await nextTick();

  expect(toValue(data)).toEqual([1, 1]);
});

test("invalidateChainQueries", async () => {
  const { result } = withSetup(
    () =>
      [
        useQuery((query) =>
          query
            .runtimeApi("foo", "bar", [])
            .runtimeApi("foo", "baz", [])
            .runtimeApi("x", "y", [])
            .runtimeApi("ping", "pong", []),
        ),
        useStore(),
      ] as const,
    {
      [chainIdKey]: "test-chain",
    },
  );

  const data = (await result[0]).data;

  expect(toValue(data)).toEqual([0, 0, 0, 0]);

  await act(() =>
    result[1].invalidateChainQueries(
      (instruction) =>
        instruction.type === "runtime-api" && instruction.api === "foo",
    ),
  );

  await nextTick();

  expect(toValue(data)).toEqual([1, 1, 0, 0]);
});

const mockContract = defineContract({
  id: "foo",
  type: "ink",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptor: {} as any,
});

test("invalidateContractQueries", async () => {
  const { result } = withSetup(
    () =>
      [
        useQuery((query) =>
          query
            .contract(mockContract, "0x", (query) =>
              query.message("foo").message("bar"),
            )
            .contract(mockContract, "0x1", (query) =>
              query.message("foo").message("bar"),
            ),
        ),
        useStore(),
      ] as const,
    {
      [chainIdKey]: "test-chain",
    },
  );

  const data = (await result[0]).data;

  expect(toValue(data)).toEqual([
    [0, 0],
    [0, 0],
  ]);

  await act(() =>
    result[1].invalidateContractQueries(
      (instruction) =>
        instruction.address === "0x" ||
        (instruction.kind === "ink" &&
          instruction.address === "0x1" &&
          instruction.type === "message" &&
          instruction.name === "foo"),
    ),
  );

  await nextTick();

  expect(toValue(data)).toEqual([
    [1, 1],
    [1, 0],
  ]);
});
