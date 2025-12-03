import { aggregateWallets } from "../actions/aggregate-wallets.js";
import { getAccounts } from "../actions/get-accounts.js";
import type { InferChainId } from "../chains.js";
import type { Config } from "../config.js";
import { getClient } from "./get-client.js";
import { defer } from "rxjs";

/**
 * Gets the accounts from the configured wallets.
 *
 * @param config - The configuration
 * @param options - Additional options
 * @returns The currently connected accounts
 */
export function whenAccountsChanged<TConfig extends Config>(
  config: TConfig,
  options?: { chainId?: InferChainId<TConfig> },
) {
  const chainId = options?.chainId;

  return getAccounts(
    defer(() => aggregateWallets(config.wallets ?? [])),
    chainId === undefined
      ? undefined
      : defer(() =>
          getClient(config, { chainId }).then((client) =>
            client.getChainSpecData(),
          ),
        ),
    undefined,
    config.includeEvmAccounts === undefined
      ? undefined
      : { includeEvmAccounts: config.includeEvmAccounts },
  );
}
