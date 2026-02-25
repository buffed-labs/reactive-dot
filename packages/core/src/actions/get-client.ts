import type { ChainConfig } from "../config.js";
import {
  createClientFromLightClientProvider,
  isLightClientProvider,
  type LightClientProvider,
} from "../providers/light-client/provider.js";
import { createClient, type PolkadotClient } from "polkadot-api";
import type { JsonRpcProvider } from "polkadot-api";

const clientCache = new WeakMap<ChainConfig, Promise<PolkadotClient>>();

export function getClient(chainConfig: ChainConfig) {
  return (
    clientCache.get(chainConfig) ??
    clientCache.set(chainConfig, _getClient(chainConfig)).get(chainConfig)!
  );
}

async function _getClient(chainConfig: ChainConfig) {
  const providerOrGetter = await chainConfig.provider;

  if (isLightClientProvider(providerOrGetter)) {
    return createClientFromLightClientProvider(providerOrGetter);
  }

  // Hack to detect wether function is a `JsonRpcProvider` or a getter of `JsonRpcProvider`
  const providerOrController = await ((providerOrGetter as (...args: unknown[]) => unknown).length > 0
    ? (providerOrGetter as unknown as JsonRpcProvider | LightClientProvider)
    : (
        providerOrGetter as Exclude<
          typeof providerOrGetter,
          JsonRpcProvider | LightClientProvider
        > as () => unknown
      )());

  if (isLightClientProvider(providerOrController)) {
    return createClientFromLightClientProvider(providerOrController);
  }

  return createClient(providerOrController as JsonRpcProvider);
}
