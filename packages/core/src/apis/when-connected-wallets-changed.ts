import { getConnectedWallets } from "../actions/get-connected-wallets.js";
import type { Config } from "../config.js";
import { whenWalletsChanged } from "./when-wallets-changed.js";
import { switchMap } from "rxjs";

/**
 * Subscribe to connected wallets changes.
 *
 * @param config - The configuration
 * @returns The currently connected wallets observable
 */
export function whenConnectedWalletsChanged(config: Config) {
  return whenWalletsChanged(config).pipe(
    switchMap((wallets) => getConnectedWallets(wallets)),
  );
}
