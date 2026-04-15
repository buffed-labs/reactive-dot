import { pasAh, passet } from "../../.papi/descriptors/dist/index.js";
import { getContractTx } from "./get-contract-tx.js";
import {
  Binary,
  type PolkadotClient,
  type SizedHex,
  type SS58String,
  type TypedApi,
} from "polkadot-api";
import { beforeEach, expect, it, vi } from "vitest";

// Mock the descriptors
vi.mock("../../.papi/descriptors/dist/index.js", () => ({
  pasAh: Symbol("pasAh"),
  passet: Symbol("passet"),
}));

const mockOrigin = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" as SS58String;
const mockDest = "0x0000000000000000000000000000000000000000" as SizedHex<20>;
const mockValue = 100n;
const mockData = Binary.fromText("foo");

let mockClient: PolkadotClient;
let mockPassetApi: TypedApi<passet>;
let mockPasAhApi: TypedApi<pasAh>;

beforeEach(() => {
  mockPassetApi = {
    apis: {
      ReviveApi: {
        call: vi.fn(),
      },
    },
    tx: {
      Revive: {
        call: vi.fn(),
      },
    },
  } as never;

  mockPasAhApi = {
    apis: {
      ReviveApi: {
        call: vi.fn(),
      },
    },
    tx: {
      Revive: {
        call: vi.fn(),
      },
    },
  } as never;

  mockClient = {
    getTypedApi: vi.fn((descriptor) => {
      if (descriptor === passet) return mockPassetApi;
      if (descriptor === pasAh) return mockPasAhApi;
      return {};
    }),
  } as unknown as PolkadotClient;
});

it("should use passet API when dry run result has weight_required", async () => {
  // Setup dry run result with weight_required (passet shape)
  const dryRunResult = {
    weight_required: { ref_time: 100n, proof_size: 200n },
    storage_deposit: { value: 50n },
  };
  vi.mocked(mockPassetApi.apis.ReviveApi.call).mockResolvedValue(dryRunResult as never);

  // Setup tx creation
  const mockTx = { signAndSubmit: vi.fn() };
  vi.mocked(mockPassetApi.tx.Revive.call).mockReturnValue(mockTx as never);

  const result = await getContractTx(mockClient, mockOrigin, mockDest, mockValue, mockData);

  // Verify dry run call
  expect(mockPassetApi.apis.ReviveApi.call).toHaveBeenCalledWith(
    mockOrigin,
    mockDest,
    mockValue,
    undefined,
    undefined,
    mockData,
    {},
  );

  // Verify tx creation with correct parameters from dry run
  expect(mockPassetApi.tx.Revive.call).toHaveBeenCalledWith({
    dest: mockDest,
    value: mockValue,
    weight_limit: dryRunResult.weight_required,
    storage_deposit_limit: dryRunResult.storage_deposit.value,
    data: mockData,
  });

  expect(result).toBe(mockTx);
});

it("should fall back to pasAh API when dry run result does NOT have weight_required", async () => {
  // Setup dry run result without weight_required (pasAh shape)
  const passetDryRunResult = {
    gas_required: { ref_time: 100n, proof_size: 200n },
    storage_deposit: { value: 50n },
  };
  vi.mocked(mockPassetApi.apis.ReviveApi.call).mockResolvedValue(passetDryRunResult as never);

  // Setup dry run result for pasAh
  const pasAhDryRunResult = {
    gas_required: { ref_time: 300n, proof_size: 400n },
    storage_deposit: { value: 60n },
  };
  vi.mocked(mockPasAhApi.apis.ReviveApi.call).mockResolvedValue(pasAhDryRunResult as never);

  // Setup tx creation for pasAh
  const mockTx = { signAndSubmit: vi.fn() };
  vi.mocked(mockPasAhApi.tx.Revive.call).mockReturnValue(mockTx as never);

  const result = await getContractTx(mockClient, mockOrigin, mockDest, mockValue, mockData);

  // Verify dry run call on pasAh
  expect(mockPasAhApi.apis.ReviveApi.call).toHaveBeenCalledWith(
    mockOrigin,
    mockDest,
    mockValue,
    undefined,
    undefined,
    mockData,
    {},
  );

  // Verify tx creation on pasAh with correct parameters (note: gas_limit vs weight_limit)
  expect(mockPasAhApi.tx.Revive.call).toHaveBeenCalledWith({
    dest: mockDest,
    value: mockValue,
    gas_limit: pasAhDryRunResult.gas_required,
    storage_deposit_limit: pasAhDryRunResult.storage_deposit.value,
    data: mockData,
  });

  expect(result).toBe(mockTx);
});

it("should pass abort signal to dry run calls", async () => {
  const dryRunResult = {
    weight_required: { ref_time: 100n, proof_size: 200n },
    storage_deposit: { value: 50n },
  };
  vi.mocked(mockPassetApi.apis.ReviveApi.call).mockResolvedValue(dryRunResult as never);
  vi.mocked(mockPassetApi.tx.Revive.call).mockReturnValue({} as never);

  const abortController = new AbortController();
  const options = { signal: abortController.signal };

  await getContractTx(mockClient, mockOrigin, mockDest, mockValue, mockData, options);

  expect(mockPassetApi.apis.ReviveApi.call).toHaveBeenCalledWith(
    mockOrigin,
    mockDest,
    mockValue,
    undefined,
    undefined,
    mockData,
    options,
  );
});
