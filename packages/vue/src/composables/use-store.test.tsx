import { chainIdKey } from "../keys.js";
import { withSetup } from "../test-utils.js";
import { useQuery } from "./use-query.js";
import { useStore } from "./use-store.js";
import { act } from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { nextTick, toValue } from "vue";

let counts = new Map<string, number>();

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

beforeEach(() => {
  counts = new Map();
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
