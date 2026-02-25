import { getContractTx } from "../get-contract-tx.js";
import { getSolidityContractTx } from "./get-contract-tx.js";
import type { SolidityTxBody } from "./types.js";
import type { Abi } from "abitype";
import type { PolkadotClient, PolkadotSigner } from "polkadot-api";
import { Binary } from "polkadot-api";
import { describe, expect, it, vi } from "vitest";

vi.mock("ox", () => ({
  AbiFunction: {
    fromAbi: (_abi: unknown, _name: unknown) => ({ name: _name }),
    encodeData: (_fn: unknown, _args: unknown) => "0xdeadbeef",
  },
}));

vi.mock("../get-contract-tx.js", () => ({
  getContractTx: vi.fn(),
}));

describe("getSolidityContractTx", () => {
  it("builds a tx from abi, signer and body (dry-run -> tx)", async () => {
    const h160 = "0x1234567890123456789012345678901234567890";

    const h160Fixed = Binary.fromHex(h160);
    const padded = new Uint8Array(32);
    padded.set(h160Fixed, 0);

    const signer = { publicKey: padded } as unknown as PolkadotSigner;

    const abi = [{ type: "function" }];

    const body = { args: [1, 2, 3], value: 5n } as unknown as SolidityTxBody<
      Abi,
      never
    >;

    // cast to any to avoid cumbersome generic type plumbing in tests
    await getSolidityContractTx(
      {} as unknown as PolkadotClient,
      abi as unknown as Abi,
      signer,
      h160,
      "myFn" as never,
      body,
    );

    expect(getContractTx).toHaveBeenCalled();

    const data = vi.mocked(getContractTx).mock.calls.at(0)?.at(4) as Uint8Array;

    expect(Binary.toHex(data)).toBe("0xdeadbeef");
  });
});
