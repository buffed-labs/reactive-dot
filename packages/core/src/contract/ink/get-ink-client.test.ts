import type { InkContract } from "../contract.js";
import { getContractConfig } from "../contract.js";
import { getInkClient } from "./get-ink-client.js";
import { getInkClient as importedPolkaGetInkClient } from "polkadot-api/ink";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./contract.js", () => ({
  getContractConfig: vi.fn(),
}));
vi.mock("polkadot-api/ink", () => ({
  getInkClient: vi.fn(),
}));

const mockedGetContractConfig = vi.mocked(getContractConfig);
const mockedPolkaGetInkClient = vi.mocked(importedPolkaGetInkClient);

describe("getInkClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("imports polkadot-api/ink and invokes its getInkClient with the contract descriptor", async () => {
    const fakeContract = {} as InkContract;
    const descriptor = { some: "descriptor" };
    const fakeClient = { client: true };

    // @ts-expect-error Mocking the return value of getContractConfig
    mockedGetContractConfig.mockReturnValue({ descriptor });
    // @ts-expect-error Mocking the return value of importedPolkaGetInkClient
    mockedPolkaGetInkClient.mockReturnValue(fakeClient);

    const result = await getInkClient(fakeContract);

    expect(mockedGetContractConfig).toHaveBeenCalledOnce();
    expect(mockedGetContractConfig).toHaveBeenCalledWith(fakeContract);
    expect(mockedPolkaGetInkClient).toHaveBeenCalledOnce();
    expect(mockedPolkaGetInkClient).toHaveBeenCalledWith(descriptor);
    expect(result).toBe(fakeClient);
  });

  it("propagates errors thrown by the imported getInkClient", async () => {
    const fakeContract = {} as InkContract;
    const descriptor = {};
    const error = new Error("fail");

    // @ts-expect-error Mocking the return value of getContractConfig
    mockedGetContractConfig.mockReturnValue({ descriptor });
    mockedPolkaGetInkClient.mockImplementation(() => {
      throw error;
    });

    await expect(getInkClient(fakeContract)).rejects.toThrow(error);
  });
});
