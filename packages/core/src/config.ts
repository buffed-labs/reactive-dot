import type { LightClientProvider } from "./providers/light-client/provider.js";
import type { Gettable } from "./types.js";
import type { Wallet, WalletProvider } from "./wallets/index.js";
import type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider";
import type { ChainDefinition } from "polkadot-api";

export type ChainConfig = {
  readonly descriptor: ChainDefinition;
  readonly provider: Gettable<JsonRpcProvider | LightClientProvider>;
};

export type Config<
  TChains extends Readonly<Record<string, ChainConfig>> = Readonly<
    Record<string, ChainConfig>
  >,
  TTargetChainIds extends Extract<keyof TChains, string>[] = Extract<
    keyof TChains,
    string
  >[],
> = {
  readonly chains: TChains;
  readonly targetChains?: TTargetChainIds;
  readonly wallets?: Array<WalletProvider | Wallet>;
  /**
   * Include EVM accounts from wallets.
   * When `false`, EVM accounts will be filtered out
   *
   * @defaultValue false
   */
  readonly includeEvmAccounts?: boolean;
  /**
   * Enable SSR support & optimizations
   *
   * @experimental
   * @defaultValue false
   */
  readonly ssr?: boolean;
};

export function defineConfig<
  const TChains extends Readonly<Record<string, ChainConfig>>,
  const TTargetChainIds extends Extract<keyof TChains, string>[],
>(config: Config<TChains, TTargetChainIds>) {
  return config;
}
