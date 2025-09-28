/* eslint-disable @typescript-eslint/no-explicit-any */
import { toH160Bytes } from "../address.js";
import type { ContractCompatApi } from "../types.js";
import { getSolidityContractTx } from "./get-contract-tx.js";
import type { SolidityTxBody } from "./types.js";
import type { Abi } from "abitype";
import { AccountId, Binary } from "polkadot-api";
import type { PolkadotSigner } from "polkadot-api";
import { describe, it, expect, vi } from "vitest";

// Mock the dynamic 'ox' module used by the implementation
vi.mock("ox", () => ({
  AbiFunction: {
    fromAbi: (_abi: unknown, _name: unknown) => ({ name: _name }),
    encodeData: (_fn: unknown, _args: unknown) => "0xdeadbeef",
  },
}));

describe("getSolidityContractTx", () => {
  it("builds a tx from abi, signer and body (dry-run -> tx)", async () => {
    const h160 = "0x1234567890123456789012345678901234567890";

    // create a padded 32 byte publicKey compatible with AccountId().dec
    const h160Fixed = Binary.fromHex(h160).asBytes();
    const padded = new Uint8Array(32);
    padded.set(h160Fixed, 0);

    const signer = { publicKey: padded } as unknown as PolkadotSigner;

    const fakeDryRun = {
      gas_required: 111n,
      storage_deposit: { value: 222n },
    };

    const called: { calledWith?: unknown[] } = {};

    const fakeApi = {
      apis: {
        ReviveApi: {
          call: vi.fn(async (...args: unknown[]) => {
            // record the call for assertions
            called.calledWith = args as unknown[];
            return fakeDryRun;
          }),
        },
      },
      tx: {
        Revive: {
          call: vi.fn((payload: unknown) => payload),
        },
      },
    } as unknown as ContractCompatApi;

    const abi = [{ type: "function" }];

    const body = { args: [1, 2, 3], value: 5n } as unknown as SolidityTxBody<
      Abi,
      never
    >;

    // cast to any to avoid cumbersome generic type plumbing in tests
    await (getSolidityContractTx as any)(
      fakeApi,
      abi,
      signer,
      h160,
      "myFn",
      body,
    );

    // the dry-run call should have been invoked with origin, dest, value and the encoded data
    expect(fakeApi.apis.ReviveApi.call).toHaveBeenCalled();

    const [origin, dest, value, _a, _b, data] = (called.calledWith ??
      []) as unknown[];

    // origin should be the AccountId.dec applied to signer.publicKey
    const expectedOrigin = AccountId().dec(padded);
    expect(origin).toEqual(expectedOrigin);

    // dest should match toH160Bytes(contract)
    expect((dest as Binary).asHex()).toEqual(toH160Bytes(h160).asHex());

    expect(value).toBe(5n);

    // data should be a Binary instance whose hex matches our mocked encoding
    expect((data as Binary).asHex()).toBe("0xdeadbeef");

    // ensure tx.Revive.call was invoked with the constructed payload
    expect(fakeApi.tx.Revive.call).toHaveBeenCalled();
    const calledPayload = (fakeApi.tx.Revive.call as any).mock
      .calls[0][0] as any;

    expect(calledPayload).toMatchInlineSnapshot(`
      {
        "data": Binary {
          "asBytes": [Function],
          "asHex": [Function],
          "asOpaqueBytes": [Function],
          "asOpaqueHex": [Function],
          "asText": [Function],
        },
        "dest": FixedSizeBinary {
          "asBytes": [Function],
          "asHex": [Function],
          "asOpaqueBytes": [Function],
          "asOpaqueHex": [Function],
          "asText": [Function],
        },
        "gas_limit": 111n,
        "storage_deposit_limit": 222n,
        "value": 5n,
      }
    `);
  });
});
