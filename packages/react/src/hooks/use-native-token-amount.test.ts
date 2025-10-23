import {
  useNativeTokenAmountFromNumber,
  useNativeTokenAmountFromPlanck,
} from "./use-native-token-amount.js";
import { DenominatedNumber } from "@reactive-dot/utils";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./use-chain-spec-data", () => ({
  useChainSpecData: vi.fn(() => ({
    properties: {
      tokenDecimals: 12,
      tokenSymbol: "DOT",
    },
  })),
}));

describe("useNativeTokenAmountFromPlanck", () => {
  it("should convert planck value to DenominatedNumber", async () => {
    const { result } = await act(() =>
      renderHook(() => useNativeTokenAmountFromPlanck(1000000000000n)),
    );

    expect(result.current).toBeInstanceOf(DenominatedNumber);
    expect(result.current.toLocaleString("en-NZ")).toBe("DOT 1.00");
  });

  it("should return conversion function when no planck value provided", async () => {
    const { result } = await act(() =>
      renderHook(() => useNativeTokenAmountFromPlanck()),
    );

    expect(result.current).toBeTypeOf("function");

    const value = result.current(1000000000000n);

    expect(value).toBeInstanceOf(DenominatedNumber);
    expect(value.toLocaleString("en-NZ")).toBe("DOT 1.00");
  });
});

describe("useNativeTokenAmountFromNumber", () => {
  it("should convert number value to DenominatedNumber", async () => {
    const { result } = await act(() =>
      renderHook(() => useNativeTokenAmountFromNumber(1)),
    );

    expect(result.current).toBeInstanceOf(DenominatedNumber);
    expect(result.current.toLocaleString("en-NZ")).toBe("DOT 1.00");
  });

  it("should convert string number to DenominatedNumber", async () => {
    const { result } = await act(() =>
      renderHook(() => useNativeTokenAmountFromNumber("1.5")),
    );

    expect(result.current).toBeInstanceOf(DenominatedNumber);
    expect(result.current.toLocaleString("en-NZ")).toBe("DOT 1.50");
  });

  it("should return conversion function when no number provided", async () => {
    const { result } = await act(() =>
      renderHook(() => useNativeTokenAmountFromNumber()),
    );

    expect(result.current).toBeTypeOf("function");

    const value = result.current(2);

    expect(value).toBeInstanceOf(DenominatedNumber);
    expect(value.toLocaleString("en-NZ")).toBe("DOT 2.00");
  });
});
