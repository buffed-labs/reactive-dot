import { aggregateWallets } from "../actions/aggregate-wallets.js";
import type { Config } from "../config.js";
import { defer } from "rxjs";

/**
 * Subscribe to available wallets changes.
 *
 * @param config - The configuration
 * @returns The currently available wallets observable
 */
export function whenWalletsChanged(config: Config) {
  return defer(() => aggregateWallets(config.wallets ?? []));
}
