import type { ResolvedPromise } from "../utils/react-promise.js";
import type { ChainHookOptions, SuspenseOptions, When } from "./types.js";
import { useChainSpecData } from "./use-chain-spec-data.js";
import { useMaybeUse } from "./use-maybe-use.js";
import { useStablePromise } from "./use-stable-promise.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import { nativeTokenInfoFromChainSpecData } from "@reactive-dot/core/internal.js";
import { DenominatedNumber } from "@reactive-dot/utils";
import { soon } from "jotai-eager";
import { useMemo } from "react";

/**
 * Hook for returning the native token amount from a planck value.
 *
 * @group Hooks
 * @param planck - The planck value
 * @param options - Additional options
 * @returns The native token amount
 */
export function useNativeTokenAmountFromPlanck<TUse extends boolean = true>(
  planck: bigint | number | string,
  options?: ChainHookOptions & SuspenseOptions<TUse>,
): When<TUse, DenominatedNumber, Promise<DenominatedNumber>>;
/**
 * Hook for returning a function that converts planck value to native token amount.
 *
 * @group Hooks
 * @param options - Additional options
 * @returns Function for getting the native token amount from a planck value
 */
export function useNativeTokenAmountFromPlanck<TUse extends boolean = true>(
  options?: ChainHookOptions & SuspenseOptions<TUse>,
): When<
  TUse,
  (planck: bigint | number | string) => DenominatedNumber,
  Promise<(planck: bigint | number | string) => DenominatedNumber>
>;
export function useNativeTokenAmountFromPlanck<TUse extends boolean = true>(
  planckOrOptions?:
    | bigint
    | number
    | string
    | (ChainHookOptions & SuspenseOptions<TUse>),
  maybeOptions?: ChainHookOptions & SuspenseOptions<TUse>,
) {
  const options =
    typeof planckOrOptions === "object" ? planckOrOptions : maybeOptions;

  // TODO: very dangerous hack, require tapping into internals
  const chainSpecDataPromise = useChainSpecData({ ...options, use: false }) as
    | ResolvedPromise<ChainSpecData>
    | Promise<ChainSpecData>;

  return useMaybeUse(
    useStablePromise(
      useMemo(
        () =>
          soon(
            "status" in chainSpecDataPromise &&
              chainSpecDataPromise.status === "resolved"
              ? chainSpecDataPromise.value
              : chainSpecDataPromise,
            (chainSpecData) => {
              const nativeTokenInfo =
                nativeTokenInfoFromChainSpecData(chainSpecData);

              switch (typeof planckOrOptions) {
                case "bigint":
                case "number":
                case "string":
                  return new DenominatedNumber(
                    planckOrOptions,
                    nativeTokenInfo.decimals ?? 0,
                    nativeTokenInfo.code,
                  );
                default:
                  return (planck: bigint | number | string) =>
                    new DenominatedNumber(
                      planck,
                      nativeTokenInfo.decimals ?? 0,
                      nativeTokenInfo.code,
                    );
              }
            },
          ),
        [chainSpecDataPromise, planckOrOptions],
      ),
    ),
    options,
  ) as unknown;
}

/**
 * Hook for returning the native token amount from a number value
 *
 * @group Hooks
 * @param number - The number value
 * @param options - Additional options
 * @returns The native token amount
 */
export function useNativeTokenAmountFromNumber<TUse extends boolean = true>(
  number: number | string,
  options?: ChainHookOptions & SuspenseOptions<TUse>,
): When<TUse, DenominatedNumber, Promise<DenominatedNumber>>;
/**
 * Hook for returning a function that converts number value to native token amount
 *
 * @group Hooks
 * @param options - Additional options
 * @returns Function for getting the native token amount from a number value
 */
export function useNativeTokenAmountFromNumber<TUse extends boolean = true>(
  options?: ChainHookOptions & SuspenseOptions<TUse>,
): When<
  TUse,
  (number: number | string) => DenominatedNumber,
  Promise<(number: number | string) => DenominatedNumber>
>;
export function useNativeTokenAmountFromNumber<TUse extends boolean = true>(
  numberOrOptions?:
    | number
    | string
    | (ChainHookOptions & SuspenseOptions<TUse>),
  maybeOptions?: ChainHookOptions & SuspenseOptions<TUse>,
) {
  const options =
    typeof numberOrOptions === "object" ? numberOrOptions : maybeOptions;

  // TODO: very dangerous hack, require tapping into internals
  const chainSpecDataPromise = useChainSpecData({ ...options, use: false }) as
    | ResolvedPromise<ChainSpecData>
    | Promise<ChainSpecData>;

  return useMaybeUse(
    useStablePromise(
      useMemo(
        () =>
          soon(
            "status" in chainSpecDataPromise &&
              chainSpecDataPromise.status === "resolved"
              ? chainSpecDataPromise.value
              : chainSpecDataPromise,
            (chainSpecData) => {
              const nativeTokenInfo =
                nativeTokenInfoFromChainSpecData(chainSpecData);

              switch (typeof numberOrOptions) {
                case "number":
                case "string":
                  return DenominatedNumber.fromNumber(
                    numberOrOptions,
                    nativeTokenInfo.decimals ?? 0,
                    nativeTokenInfo.code,
                  );
                default:
                  return (number: number | string) =>
                    DenominatedNumber.fromNumber(
                      number,
                      nativeTokenInfo.decimals ?? 0,
                      nativeTokenInfo.code,
                    );
              }
            },
          ),
        [chainSpecDataPromise, numberOrOptions],
      ),
    ),
    options,
  ) as unknown;
}
