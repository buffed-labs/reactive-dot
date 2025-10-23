import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import type { ObservableAndPromiseAtom } from "../utils/jotai/atom-with-observable-and-promise.js";
import { objectId } from "../utils/object-id.js";
import type { ChainHookOptions, SuspenseOptions } from "./types.js";
import { internal_useChainId } from "./use-chain-id.js";
import { chainSpecDataAtom } from "./use-chain-spec-data.js";
import { useConfig } from "./use-config.js";
import { useMaybeUse } from "./use-maybe-use.js";
import { usePausableAtomValue } from "./use-pausable-atom-value.js";
import { instructionPayloadAtom } from "./use-query.js";
import { useStablePromise } from "./use-stable-promise.js";
import type { Address, ChainId, Config } from "@reactive-dot/core";
import { nativeTokenInfoFromChainSpecData } from "@reactive-dot/core/internal.js";
import { spendableBalance } from "@reactive-dot/core/internal/maths.js";
import { DenominatedNumber } from "@reactive-dot/utils";
import { atom } from "jotai";
import { soon, soonAll } from "jotai-eager";

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

type Options<TUse extends boolean> = ChainHookOptions &
  SuspenseOptions<TUse> & {
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
export function useSpendableBalance<TUse extends boolean = true>(
  address: Address,
  options?: Options<TUse>,
) {
  return useMaybeUse(
    useStablePromise(
      usePausableAtomValue(
        spendableBalanceAtom(
          useConfig(),
          internal_useChainId(options),
          address,
          options?.includesExistentialDeposit ?? false,
        ),
      ),
    ),
    options,
  );
}

/**
 * Hook for getting accounts’ spendable balances.
 *
 * @group Hooks
 * @param addresses  - The account-addresses
 * @param options - Additional options
 * @returns The accounts’ spendable balances
 */
export function useSpendableBalances<TUse extends boolean = true>(
  addresses: Address[],
  options?: Options<TUse>,
) {
  return useMaybeUse(
    useStablePromise(
      usePausableAtomValue(
        spendableBalancesAtom(
          useConfig(),
          internal_useChainId(options),
          addresses,
          options?.includesExistentialDeposit ?? false,
        ),
      ),
    ),
    options,
  );
}

const spendableBalanceAtom = atomFamilyWithErrorCatcher(
  (
    withErrorCatcher,
    config: Config,
    chainId: ChainId,
    address: Address,
    includesExistentialDeposit: boolean,
  ) => {
    const existentialDepositPayload = instructionPayloadAtom(config, chainId, {
      type: "constant",
      pallet: "Balances",
      constant: "ExistentialDeposit",
      directives: { defer: false },
    }) as ObservableAndPromiseAtom<bigint>;

    const accountPayload = instructionPayloadAtom(config, chainId, {
      type: "storage",
      pallet: "System",
      storage: "Account",
      keys: [address],
      at: undefined,
      directives: { defer: false },
    }) as ObservableAndPromiseAtom<SystemAccount>;

    const createAtom = (asObservable: boolean) =>
      withErrorCatcher(
        atom((get) =>
          soon(
            soonAll([
              get(chainSpecDataAtom(config, chainId)),
              get(
                asObservable
                  ? existentialDepositPayload.observableAtom
                  : existentialDepositPayload.promiseAtom,
              ),
              get(
                asObservable
                  ? accountPayload.observableAtom
                  : accountPayload.promiseAtom,
              ),
            ]),
            ([
              chainSpecData,
              existentialDeposit,
              {
                data: { free, reserved, frozen },
              },
            ]) => {
              const nativeTokenInfo =
                nativeTokenInfoFromChainSpecData(chainSpecData);

              return new DenominatedNumber(
                spendableBalance({
                  free,
                  reserved,
                  frozen,
                  existentialDeposit,
                  includesExistentialDeposit,
                }),
                nativeTokenInfo.decimals ?? 0,
                nativeTokenInfo.code,
              );
            },
          ),
        ),
      );

    return {
      promiseAtom: createAtom(false),
      observableAtom: createAtom(true),
    };
  },
);

const spendableBalancesAtom = atomFamilyWithErrorCatcher(
  (
    withErrorCatcher,
    config: Config,
    chainId: ChainId,
    addresses: Address[],
    includesExistentialDeposit: boolean,
  ) => {
    const createAtom = (asObservable: boolean) => {
      const balanceAtom = (address: Address) =>
        spendableBalanceAtom(
          config,
          chainId,
          address,
          includesExistentialDeposit,
        );

      return withErrorCatcher(
        atom((get) =>
          soonAll(
            addresses.map((address) =>
              get(
                asObservable
                  ? balanceAtom(address).observableAtom
                  : balanceAtom(address).promiseAtom,
              ),
            ),
          ),
        ),
      );
    };
    return {
      promiseAtom: createAtom(false),
      observableAtom: createAtom(true),
    };
  },
  (config, chainId, addresses, includesExistentialDeposit) =>
    [
      objectId(config),
      chainId,
      addresses.join(),
      includesExistentialDeposit,
    ].join(),
);
