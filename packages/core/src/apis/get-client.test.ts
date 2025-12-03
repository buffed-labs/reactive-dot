import { getClient as baseGetClient } from "../actions/get-client.js";
import { defineConfig } from "../config.js";
import { getClient } from "./get-client.js";
import { afterEach, expect, it, vi } from "vitest";

vi.mock("../actions/get-client.js");

afterEach(() => {
  vi.clearAllMocks();
});

it("gets client from config", () => {
  vi.mocked(baseGetClient).mockImplementation(vi.fn(async (config) => config));

  const client = getClient(
    defineConfig({ chains: { test: { id: "target" } as never } }),
    {
      chainId: "test",
    },
  );

  expect(client).resolves.toEqual({ id: "target" });
});
