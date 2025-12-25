import { getAccounts } from "../actions/get-accounts.js";
import type { InferChainId } from "../chains.js";
import type { Config } from "../config.js";
import { getClient } from "./get-client.js";
import { whenWalletsChanged } from "./when-wallets-changed.js";
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
  options?: { chainId?: InferChainId<TConfig> },
) {
  const chainId = options?.chainId;

  return getAccounts(
    whenWalletsChanged(config),
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
