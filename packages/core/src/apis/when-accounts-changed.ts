import { getAccounts } from "../actions/get-accounts.js";
import type { InferChainId } from "../chains.js";
import type { Config } from "../config.js";
import type { MaybeAsync } from "../types.js";
import { getClient } from "./get-client.js";
import { whenWalletsChanged } from "./when-wallets-changed.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import { defer } from "rxjs";

/**
 * Subscribe to accounts changes.
 *
 * @param config - The configuration
 * @param options - Additional options
 * @returns The currently connected accounts observable
 */
export function whenAccountsChanged<TConfig extends Config>(
  config: TConfig,
  options?: {
    chainId?: InferChainId<TConfig>;
    chainSpec?: MaybeAsync<ChainSpecData>;
  },
) {
  const chainId = options?.chainId;

  return getAccounts(
    whenWalletsChanged(config),
    options?.chainSpec ??
      (chainId === undefined
        ? undefined
        : defer(() =>
            getClient(config, { chainId }).then((client) =>
              client.getChainSpecData(),
            ),
          )),
    undefined,
    config.includeEvmAccounts === undefined
      ? undefined
      : { includeEvmAccounts: config.includeEvmAccounts },
  );
}
