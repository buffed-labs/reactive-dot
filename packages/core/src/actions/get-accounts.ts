import type { MaybeAsync } from "../types.js";
import { nativeTokenInfoFromChainSpecData } from "../utils/native-token-info-from-chain-spec-data.js";
import { toObservable } from "../utils/to-observable.js";
import type { WalletAccount } from "../wallets/account.js";
import type { Wallet } from "../wallets/wallet.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import { checksum } from "ox/Address";
import { AccountId, Binary } from "polkadot-api";
import { combineLatest, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export function getAccounts(
  wallets: MaybeAsync<Wallet[]>,
  chainSpec?: MaybeAsync<ChainSpecData>,
  fallbackChainSpec?: MaybeAsync<ChainSpecData>,
) {
  return combineLatest([
    toObservable(wallets),
    toObservable(chainSpec),
    toObservable(fallbackChainSpec),
  ]).pipe(
    switchMap(([wallets, chainSpec, fallbackChainSpec]) => {
      if (wallets.length === 0) {
        return of([]);
      }

      const maybeSs58Format = chainSpec?.properties.ss58Format;

      const ss58Format =
        typeof maybeSs58Format === "number" ? maybeSs58Format : undefined;

      const ss58AccountId = AccountId(ss58Format);

      return combineLatest(
        wallets.map((wallet) =>
          wallet.accounts$.pipe(
            map((accounts) =>
              accounts
                .map((account): WalletAccount | undefined => {
                  const polkadotSigner = (() => {
                    if (typeof account.polkadotSigner !== "function") {
                      return account.polkadotSigner;
                    }

                    const safeChainSpec = chainSpec ?? fallbackChainSpec;

                    if (safeChainSpec === undefined) {
                      return undefined;
                    }

                    const nativeTokenInfo =
                      nativeTokenInfoFromChainSpecData(safeChainSpec);

                    return account.polkadotSigner({
                      tokenSymbol: nativeTokenInfo.code ?? "",
                      tokenDecimals: nativeTokenInfo.decimals ?? 0,
                    });
                  })();

                  if (polkadotSigner === undefined) {
                    return undefined;
                  }

                  const type =
                    polkadotSigner.publicKey.length === 20
                      ? "evm"
                      : "substrate";

                  return {
                    ...account,
                    polkadotSigner,
                    address:
                      type === "substrate"
                        ? ss58AccountId.dec(polkadotSigner.publicKey)
                        : checksum(
                            Binary.fromBytes(polkadotSigner.publicKey).asHex(),
                          ),
                    wallet,
                  };
                })
                .filter((account) => account !== undefined),
            ),
          ),
        ),
      ).pipe(
        map((accounts) => accounts.flat()),
        map(
          chainSpec === undefined
            ? (accounts) => accounts
            : (accounts) =>
                accounts.filter(
                  (account) =>
                    !account.genesisHash ||
                    chainSpec.genesisHash.includes(account.genesisHash),
                ),
        ),
      );
    }),
  );
}
