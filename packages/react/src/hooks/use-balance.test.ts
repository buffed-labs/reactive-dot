import { DenominatedNumber } from "../../../utils/build/denominated-number.js";
import { useSpendableBalance, useSpendableBalances } from "./use-balance.js";
import { internal_useChainId } from "./use-chain-id.js";
import { chainSpecDataAtom } from "./use-chain-spec-data.js";
import { useConfig } from "./use-config.js";
import { instructionPayloadAtom } from "./use-query.js";
import { renderHook } from "@testing-library/react";
import { atom } from "jotai";
import { act } from "react";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("./use-config.js");
vi.mock("./use-chain-id.js");
vi.mock("./use-query.js");
vi.mock("./use-chain-spec-data.js");

const free = 1000n;

vi.mocked(useConfig).mockReturnValue({ chains: {} });

vi.mocked(internal_useChainId).mockReturnValue("foo");

vi.mocked(instructionPayloadAtom).mockImplementation(
  (config, chainId, instruction) => {
    const value = Promise.resolve(
      (() => {
        if (
          instruction.type === "constant" &&
          instruction.pallet === "Balances" &&
          instruction.constant === "ExistentialDeposit"
        ) {
          return 100n;
        } else if (
          instruction.type === "storage" &&
          instruction.pallet === "System" &&
          instruction.storage === "Account"
        ) {
          return {
            nonce: 0,
            consumers: 0,
            providers: 0,
            sufficients: 0,
            data: {
              free,
              reserved: 1000n,
              frozen: 50n,
              flags: 0n,
            },
          };
        } else {
          throw new Error("Invalid instruction");
        }
      })(),
    );

    return {
      observableAtom: atom(value),
      promiseAtom: atom(value),
      __meta: { config, chainId, instruction },
    };
  },
);

let mockPromise = Promise.withResolvers<void>();

beforeEach(() => {
  vi.clearAllMocks();

  mockPromise = Promise.withResolvers<void>();

  vi.mocked(chainSpecDataAtom).mockReturnValue(
    atom(
      mockPromise.promise.then(() => ({
        properties: { tokenDecimals: [12], tokenSymbol: ["UNIT"] },
      })),
    ) as unknown as ReturnType<typeof chainSpecDataAtom>,
  );
});

it("should return spendable balance for single address", async () => {
  const { result } = await act(() =>
    renderHook(() =>
      useSpendableBalance("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"),
    ),
  );

  await act(() => mockPromise.resolve());

  expect(result.current).toBeInstanceOf(DenominatedNumber);
});

it("should return spendable balances array for multiple addresses", async () => {
  const { result } = await act(() =>
    renderHook(() =>
      useSpendableBalances([
        "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      ]),
    ),
  );

  await act(() => mockPromise.resolve());

  expect(result.current).toEqual(
    expect.arrayContaining([
      expect.any(DenominatedNumber),
      expect.any(DenominatedNumber),
    ]),
  );
});

it("should return spendable balances array for an array of one address", async () => {
  const { result } = await act(() =>
    renderHook(() =>
      useSpendableBalances([
        "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      ]),
    ),
  );

  await act(() => mockPromise.resolve());

  expect(result.current).toEqual(
    expect.arrayContaining([expect.any(DenominatedNumber)]),
  );
});

it("should handle includesExistentialDeposit option", async () => {
  const { result } = await act(() =>
    renderHook(() =>
      useSpendableBalance("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", {
        includesExistentialDeposit: false,
      }),
    ),
  );

  await act(() => mockPromise.resolve());

  expect(result.current.planck).toBeLessThan(free);

  const { result: result2 } = await act(() =>
    renderHook(() =>
      useSpendableBalance("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", {
        includesExistentialDeposit: true,
      }),
    ),
  );

  expect(result2.current.planck).toBeGreaterThan(result.current.planck);
});
