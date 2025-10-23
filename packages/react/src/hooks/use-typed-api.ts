import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import type { ChainHookOptions } from "./types.js";
import { useAtomValue } from "./use-atom-value.js";
import { internal_useChainId } from "./use-chain-id.js";
import { clientAtom } from "./use-client.js";
import { useConfig } from "./use-config.js";
import { useStablePromise } from "./use-stable-promise.js";
import { BaseError, type ChainId, type Config } from "@reactive-dot/core";
import {
  UnsafeDescriptor,
  type ChainDescriptorOf,
} from "@reactive-dot/core/internal.js";
import { atom } from "jotai";
import { soon } from "jotai-eager";
import type { ChainDefinition, TypedApi } from "polkadot-api";
import { use } from "react";

/**
 * Hook for getting Polkadot-API typed API.
 *
 * @group Hooks
 * @param options - Additional options
 * @returns Polkadot-API typed API
 */
export function useTypedApi<TChainId extends ChainId | undefined>(
  options?: ChainHookOptions<TChainId>,
) {
  return use(
    useStablePromise(
      useAtomValue(typedApiAtom(useConfig(), internal_useChainId(options))),
    ),
  ) as TypedApi<ChainDescriptorOf<TChainId>>;
}

/**
 * @internal
 */
export const typedApiAtom = atomFamilyWithErrorCatcher(
  (withErrorCatcher, config: Config, chainId: ChainId) =>
    withErrorCatcher(
      atom((get) => {
        const chainConfig = config.chains[chainId];

        if (chainConfig === undefined) {
          throw new BaseError(`No config provided for chain ${chainId}`);
        }

        return soon(
          get(clientAtom(config, chainId)),
          (client) =>
            (chainConfig.descriptor instanceof UnsafeDescriptor
              ? client.getUnsafeApi()
              : client.getTypedApi(
                  chainConfig.descriptor,
                )) as TypedApi<ChainDefinition>,
        );
      }),
    ),
);
