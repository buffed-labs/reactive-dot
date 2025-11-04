import type { ChainHookOptions } from "./types.js";
import { useTypedApi } from "./use-typed-api.js";
import type { Address } from "@reactive-dot/core";
import {
  type Contract,
  type ContractEventNames,
  type ContractEventOf,
  watchContractEvent,
} from "@reactive-dot/core/internal.js";
import { useEffect } from "react";

/**
 * Hook for listening to contract events.
 *
 * @group Hooks
 * @param contract - The contract instance to listen to events from
 * @param address - The contract address
 * @param eventName - The name of the event to listen for
 * @param listener - Callback function invoked when the event is emitted
 * @param options - Additional options
 */
export function useContractEventListener<
  TContract extends Contract,
  TEventName extends ContractEventNames<TContract>,
>(
  contract: TContract,
  address: Address | undefined,
  eventName: TEventName,
  listener: (event: ContractEventOf<TContract, TEventName>) => void,
  options?: ChainHookOptions,
) {
  const typedApi = useTypedApi(options);

  useEffect(() => {
    const subscription = watchContractEvent(
      typedApi,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contract as any,
      address,
      eventName,
    ).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listener as any,
    );

    return () => subscription.unsubscribe();
  }, [address, contract, eventName, listener, typedApi]);
}
