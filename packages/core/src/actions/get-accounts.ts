import type { MaybeAsync } from "../types.js";
import { nativeTokenInfoFromChainSpecData } from "../utils/native-token-info-from-chain-spec-data.js";
import { toObservable } from "../utils/to-observable.js";
import type { WalletAccount } from "../wallets/account.js";
import type { Wallet } from "../wallets/wallet.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import { checksum } from "ox/Address";
import { AccountId, Binary } from "polkadot-api";
import { combineLatest, map, of, switchMap } from "rxjs";

export function getAccounts(
  wallets: MaybeAsync<Wallet[]>,
  chainSpec?: MaybeAsync<ChainSpecData>,
  fallbackChainSpec: MaybeAsync<ChainSpecData> = polkadotAssetHubChainSpec,
  options?: { includeEvmAccounts?: boolean },
) {
  return combineLatest([
    toObservable(wallets),
    toObservable(chainSpec),
    toObservable(fallbackChainSpec),
  ]).pipe(
    switchMap(([wallets, defaultChainSpec, fallbackChainSpec]) => {
      if (wallets.length === 0) {
        return of([]);
      }

      const maybeSs58Format =
        defaultChainSpec?.properties.ss58Format ??
        fallbackChainSpec?.properties.ss58Format;

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

                    const safeChainSpec = defaultChainSpec ?? fallbackChainSpec;

                    if (safeChainSpec === undefined) {
                      return null;
                    }

                    const nativeTokenInfo =
                      nativeTokenInfoFromChainSpecData(safeChainSpec);

                    return account.polkadotSigner({
                      tokenSymbol: nativeTokenInfo.code ?? "",
                      tokenDecimals: nativeTokenInfo.decimals ?? 0,
                    });
                  })();

                  if (polkadotSigner === null) {
                    return undefined;
                  }

                  const publicKey =
                    "publicKey" in account
                      ? account.publicKey
                      : polkadotSigner?.publicKey;

                  if (publicKey === undefined) {
                    return undefined;
                  }

                  const type = publicKey.length === 20 ? "evm" : "substrate";

                  if (type === "evm" && !options?.includeEvmAccounts) {
                    return undefined;
                  }

                  return {
                    ...account,
                    polkadotSigner,
                    address:
                      type === "substrate"
                        ? ss58AccountId.dec(publicKey)
                        : checksum(Binary.fromBytes(publicKey).asHex()),
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
          defaultChainSpec === undefined
            ? (accounts) => accounts
            : (accounts) =>
                accounts.filter(
                  (account) =>
                    !account.genesisHash ||
                    defaultChainSpec.genesisHash.includes(account.genesisHash),
                ),
        ),
      );
    }),
  );
}

const polkadotAssetHubChainSpec: ChainSpecData = {
  name: "Polkadot",
  genesisHash:
    "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f",
  properties: {
    ss58Format: 0,
    tokenDecimals: 10,
    tokenSymbol: "DOT",
  },
};
