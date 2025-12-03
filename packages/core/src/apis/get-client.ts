import { getClient as baseGetClient } from "../actions/get-client.js";
import type { InferChainId } from "../chains.js";
import type { Config } from "../config.js";

export function getClient<TConfig extends Config>(
  config: TConfig,
  options: { chainId: InferChainId<TConfig> },
) {
  return baseGetClient(getChainConfig(config, options)!);
}

function getChainConfig<TConfig extends Config>(
  config: TConfig,
  options: { chainId: InferChainId<TConfig> },
) {
  return config.chains[options.chainId as keyof typeof config.chains];
}
