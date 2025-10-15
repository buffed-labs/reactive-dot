/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryError } from "../../errors.js";
import { querySolidity } from "./query.js";
import { Binary } from "polkadot-api";
import { describe, it, expect, vi } from "vitest";

vi.mock("ox", () => ({
  AbiFunction: {
    fromAbi: (_abi: unknown, _name: unknown) => ({ name: _name }),
    encodeData: (_fn: unknown, _args: unknown) => "0xabba",
    decodeResult: (_fn: unknown, _hex: string) => [[42]],
  },
}));

describe("querySolidity", () => {
  it("returns decoded result for successful function instruction", async () => {
    const fakeApi = {
      apis: {
        ReviveApi: {
          call: vi.fn(async () => ({
            result: {
              success: true,
              value: { data: Binary.fromHex("0x0102") },
            },
          })),
        },
      },
    } as any;

    const abi = [{ type: "function" }];

    const result = await querySolidity(
      fakeApi as any,
      abi as any,
      "0x1234567890123456789012345678901234567890",
      { type: "function", name: "foo", args: [1] } as any,
    );

    expect(result).toEqual([42]);
    expect(fakeApi.apis.ReviveApi.call).toHaveBeenCalled();
  });

  it("throws QueryError when call returns unsuccessful result", async () => {
    const fakeApi = {
      apis: {
        ReviveApi: {
          call: vi.fn(async () => ({
            result: {
              success: false,
              value: { data: Binary.fromHex("0x").asHex() },
            },
          })),
        },
      },
    } as unknown;

    const abi = [{ type: "function" }];

    await expect(
      querySolidity(
        fakeApi as any,
        abi as any,
        "0x1234567890123456789012345678901234567890",
        { type: "function", name: "foo", args: [1] } as any,
      ),
    ).rejects.toBeInstanceOf(QueryError);
  });
});
