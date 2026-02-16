import { getClient as baseGetClient } from "../actions/get-client.js";
import { defineConfig } from "../config.js";
import { whenClientChanged } from "./when-client-changed.js";
import { firstValueFrom } from "rxjs";
import { afterEach, expect, it, vi } from "vitest";

vi.mock("../actions/get-client.js");

const config = defineConfig({
  chains: { test: { descriptor: {}, provider: {} } as never },
});

afterEach(() => {
  vi.clearAllMocks();
});

it("defers getClient until subscribing", async () => {
  const mockClient = { id: "test-client" };
  vi.mocked(baseGetClient).mockResolvedValue(mockClient as never);

  const observable = whenClientChanged(config, { chainId: "test" });
  expect(baseGetClient).not.toHaveBeenCalled();

  const result = await firstValueFrom(observable);
  expect(baseGetClient).toHaveBeenCalledTimes(1);
  expect(result).toEqual(mockClient);
});

it("re-invokes getClient for each subscription", async () => {
  const mockClient = { id: "test-client" };
  vi.mocked(baseGetClient).mockResolvedValue(mockClient as never);

  const observable = whenClientChanged(config, { chainId: "test" });

  const promise1 = firstValueFrom(observable);
  const promise2 = firstValueFrom(observable);

  await Promise.all([promise1, promise2]);

  expect(baseGetClient).toHaveBeenCalledTimes(2);
});
