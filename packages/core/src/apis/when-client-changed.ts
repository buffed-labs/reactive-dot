import type { InferChainId } from "../chains.js";
import type { Config } from "../config.js";
import { getClient } from "./get-client.js";
import { defer } from "rxjs";

/**
 * Subscribe to client changes.
 *
 * @param config - The configuration
 * @param options - Additional options
 * @returns The currently configured client observable
 */
export function whenClientChanged<TConfig extends Config>(
  config: TConfig,
  options: { chainId: InferChainId<TConfig> },
) {
  return defer(() => getClient(config, options));
}
