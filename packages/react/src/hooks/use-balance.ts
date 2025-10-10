import type { ChainHookOptions, DeferOptions } from "./types.js";
import { internal_useChainId } from "./use-chain-id.js";
import { chainSpecDataAtom } from "./use-chain-spec-data.js";
import { useConfig } from "./use-config.js";
import { useLazyLoadQuery } from "./use-query.js";
import { type Address, pending } from "@reactive-dot/core";
import {
  nativeTokenInfoFromChainSpecData,
  toSs58String,
} from "@reactive-dot/core/internal.js";
import { spendableBalance } from "@reactive-dot/core/internal/maths.js";
import { DenominatedNumber } from "@reactive-dot/utils";
import { useAtomValue } from "jotai";
import { unwrap } from "jotai/utils";
import { useCallback, useMemo } from "react";

type SystemAccount = {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: {
    free: bigint;
    reserved: bigint;
    frozen: bigint;
    flags: bigint;
  };
};

type Options<TDefer extends boolean> = ChainHookOptions &
  DeferOptions<TDefer> & {
    includesExistentialDeposit?: boolean;
  };

/**
 * Hook for getting an account's spendable balance.
 *
 * @group Hooks
 * @param address - The account's address
 * @param options - Additional options
 * @returns The account's spendable balance
 */
export function useSpendableBalance<TDefer extends boolean = false>(
  address: Address,
  options?: Options<TDefer>,
): true extends TDefer ? DenominatedNumber | undefined : DenominatedNumber;
/**
 * Hook for getting accounts’ spendable balances.
 *
 * @deprecated Use {@link useSpendableBalances} instead.
 * @param addresses  - The account-addresses
 * @param options - Additional options
 * @returns The accounts’ spendable balances
 */
export function useSpendableBalance<TDefer extends boolean = false>(
  addresses: Address[],
  options?: Options<TDefer>,
): true extends TDefer ? DenominatedNumber[] | undefined : DenominatedNumber[];
export function useSpendableBalance(
  addressOrAddresses: Address | Address[],
  { includesExistentialDeposit = false, ...options }: Options<boolean> = {},
): DenominatedNumber | DenominatedNumber[] | undefined {
  const addresses = useMemo(
    () =>
      (Array.isArray(addressOrAddresses)
        ? addressOrAddresses
        : [addressOrAddresses]
      ).map((address) => toSs58String(address)),
    [addressOrAddresses],
  );

  const [existentialDeposit, accounts] = useLazyLoadQuery(
    (builder) =>
      builder
        .constant("Balances", "ExistentialDeposit", {
          defer: options.defer ?? false,
        })
        .storages(
          "System",
          "Account",
          addresses.map((address) => [address] as const),
          {
            defer: options.defer ?? false,
          },
        ),
    options,
  ) as [bigint | typeof pending, SystemAccount[] | typeof pending];

  const chainSpecDataAtomInstance = chainSpecDataAtom(
    useConfig(),
    internal_useChainId(options),
  );

  const chainSpecFallback = useCallback(() => pending, []);
  const chainSpecData = useAtomValue(
    options.defer
      ? unwrap(chainSpecDataAtomInstance, chainSpecFallback)
      : chainSpecDataAtomInstance,
  );

  const balances = useMemo(() => {
    if (
      accounts === pending ||
      existentialDeposit === pending ||
      chainSpecData === pending
    ) {
      return undefined;
    }

    const nativeTokenInfo = nativeTokenInfoFromChainSpecData(chainSpecData);

    return accounts.map(
      ({ data: { free, reserved, frozen } }) =>
        new DenominatedNumber(
          spendableBalance({
            free,
            reserved,
            frozen,
            existentialDeposit,
            includesExistentialDeposit,
          }),
          nativeTokenInfo.decimals ?? 0,
          nativeTokenInfo.code,
        ),
    );
  }, [accounts, chainSpecData, existentialDeposit, includesExistentialDeposit]);

  return Array.isArray(addressOrAddresses) ? balances : balances?.[0];
}

/**
 * Hook for getting accounts’ spendable balances.
 *
 * @group Hooks
 * @param addresses  - The account-addresses
 * @param options - Additional options
 * @returns The accounts’ spendable balances
 */
export function useSpendableBalances<TDefer extends boolean = false>(
  addresses: Address[],
  options?: Options<TDefer>,
) {
  return useSpendableBalance<TDefer>(addresses, options);
}
