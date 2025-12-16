import { chainIdKey, configKey, signerKey } from "../keys.js";
import { withSetup } from "../test-utils.js";
import { useMutation } from "./use-mutation.js";
import { defineConfig } from "@reactive-dot/core";
import type { TxEvent } from "polkadot-api";
import { concatMap, delay, from, of, throwError } from "rxjs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { computed } from "vue";

const mockSignSubmitAndWatch = vi.fn();

const testCall = vi.fn(() => ({
  signSubmitAndWatch: mockSignSubmitAndWatch,
}));

vi.mock("./use-typed-api.js", () => ({
  useTypedApiPromise: vi.fn(() =>
    computed(() =>
      Promise.resolve({
        tx: {
          TestPallet: {
            testCall,
          },
        },
      }),
    ),
  ),
}));

vi.useFakeTimers();

beforeEach(() =>
  mockSignSubmitAndWatch.mockReturnValue(
    from<Partial<TxEvent>[]>([
      { type: "signed" },
      { type: "broadcasted" },
      { type: "txBestBlocksState" },
      { type: "finalized" },
    ]).pipe(concatMap((item) => of(item).pipe(delay(1000)))),
  ),
);

afterEach(() => {
  vi.restoreAllMocks();
});

it("sign submit and watch", async () => {
  const { result } = withSetup(
    () =>
      useMutation((tx) =>
        // @ts-expect-error mocked call
        tx.TestPallet!.testCall("test-value"),
      ),
    {
      [configKey]: defineConfig({ chains: {} }),
      [chainIdKey]: "test_chain",
      [signerKey]: {},
    },
  );

  expect(result.status.value).toBe("idle");

  result.execute();

  expect(result.status.value).toBe("pending");

  vi.advanceTimersByTime(1000);

  await vi.waitUntil(() => result.status.value === "success", {
    timeout: 3000,
  });

  expect(result.data.value).toMatchObject({ type: "signed" });

  vi.advanceTimersByTime(1000);

  expect(result.data.value).toMatchObject({ type: "broadcasted" });

  vi.advanceTimersByTime(1000);

  expect(result.data.value).toMatchObject({ type: "txBestBlocksState" });

  vi.advanceTimersByTime(1000);

  expect(result.data.value).toMatchObject({ type: "finalized" });
});

it.each(["input", "variables"] as const)(`accepts %s`, async (key) => {
  const { result } = withSetup(
    () =>
      useMutation((tx, x: number) =>
        // @ts-expect-error mocked call
        tx.TestPallet!.testCall(x),
      ),
    {
      [configKey]: defineConfig({ chains: {} }),
      [chainIdKey]: "test_chain",
      [signerKey]: {},
    },
  );

  expect(result.status.value).toBe("idle");

  result.execute({ [key as "input"]: 42 });

  await vi.waitUntil(() => result.status.value === "success", {
    timeout: 3000,
  });

  expect(testCall).toHaveBeenCalledWith(42);
});

it("catches error", async () => {
  const { result } = withSetup(
    () =>
      useMutation((tx) =>
        // @ts-expect-error mocked call
        tx.TestPallet!.testCall("test-value"),
      ),
    {
      [configKey]: defineConfig({ chains: {} }),
      [chainIdKey]: "test_chain",
      [signerKey]: {},
    },
  );

  mockSignSubmitAndWatch.mockReturnValue(throwError(() => new Error("test")));

  expect(result.status.value).toBe("idle");

  result.execute();

  await vi.waitUntil(() => result.status.value === "error", {
    timeout: 3000,
  });

  expect(result.error.value).toBeInstanceOf(Error);
});
