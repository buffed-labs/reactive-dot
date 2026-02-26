import {
  type PasAh,
  pasAh,
  type Passet,
  passet,
} from "../../.papi/descriptors/dist/index.js";
import { getContractTx } from "./get-contract-tx.js";
import {
  Binary,
  type PolkadotClient,
  type SS58String,
  type TypedApi,
} from "polkadot-api";
import { beforeEach, expect, it, vi } from "vitest";

// Mock the descriptors
vi.mock("../../.papi/descriptors/dist/index.js", () => ({
  pasAh: Symbol("pasAh"),
  passet: Symbol("passet"),
}));

const mockOrigin =
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" as SS58String;
const mockDest = Binary.toHex(new Uint8Array(20).fill(0));
const mockValue = 100n;
const mockData = Binary.fromText("foo");

let mockClient: PolkadotClient;
let mockPassetApi: TypedApi<Passet>;
let mockPasAhApi: TypedApi<PasAh>;

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

it("should use passet API when ReviveApi call succeeds", async () => {
  // Setup dry run result
  const dryRunResult = {
    weight_required: { ref_time: 100n, proof_size: 200n },
    storage_deposit: { value: 50n },
  };
  vi.mocked(mockPassetApi.apis.ReviveApi.call).mockResolvedValue(
    dryRunResult as never,
  );

  // Setup tx creation
  const mockTx = { signAndSubmit: vi.fn() };
  vi.mocked(mockPassetApi.tx.Revive.call).mockReturnValue(mockTx as never);

  const result = await getContractTx(
    mockClient,
    mockOrigin,
    mockDest as never,
    mockValue,
    mockData,
  );

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

it("should use pasAh API when passet ReviveApi call fails", async () => {
  // Setup passet call to throw
  vi.mocked(mockPassetApi.apis.ReviveApi.call).mockRejectedValue(
    new Error("not compatible"),
  );

  // Setup dry run result for pasAh
  const dryRunResult = {
    gas_required: { ref_time: 300n, proof_size: 400n },
    storage_deposit: { value: 60n },
  };
  vi.mocked(mockPasAhApi.apis.ReviveApi.call).mockResolvedValue(
    dryRunResult as never,
  );

  // Setup tx creation for pasAh
  const mockTx = { signAndSubmit: vi.fn() };
  vi.mocked(mockPasAhApi.tx.Revive.call).mockReturnValue(mockTx as never);
  const result = await getContractTx(
    mockClient,
    mockOrigin,
    mockDest as never,
    mockValue,
    mockData,
  );

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
    gas_limit: dryRunResult.gas_required,
    storage_deposit_limit: dryRunResult.storage_deposit.value,
    data: mockData,
  });

  expect(result).toBe(mockTx);
});

it("should pass abort signal to dry run calls", async () => {
  const dryRunResult = {
    weight_required: { ref_time: 100n, proof_size: 200n },
    storage_deposit: { value: 50n },
  };
  vi.mocked(mockPassetApi.apis.ReviveApi.call).mockResolvedValue(
    dryRunResult as never,
  );
  vi.mocked(mockPassetApi.tx.Revive.call).mockReturnValue({} as never);

  const abortController = new AbortController();
  const options = { signal: abortController.signal };

  await getContractTx(
    mockClient,
    mockOrigin,
    mockDest as never,
    mockValue,
    mockData,
    options,
  );

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
