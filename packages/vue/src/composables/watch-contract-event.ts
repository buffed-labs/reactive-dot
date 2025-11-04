import type { ChainComposableOptions } from "../types.js";
import { useTypedApiPromise } from "./use-typed-api.js";
import type { Address } from "@reactive-dot/core";
import {
  type Contract,
  type ContractEventNames,
  type ContractEventOf,
  watchContractEvent as baseWatchContractEvent,
} from "@reactive-dot/core/internal.js";
import { onWatcherCleanup, toValue, watchEffect } from "vue";

/**
 * Composable for listening to contract events.
 *
 * @param contract - The contract instance to listen to events from
 * @param address - The contract address
 * @param eventName - The name of the event to listen for
 * @param listener - Callback function invoked when the event is emitted
 * @param options - Additional options
 */
export function watchContractEvent<
  TContract extends Contract,
  TEventName extends ContractEventNames<TContract>,
>(
  contract: TContract,
  address: Address | undefined,
  eventName: TEventName,
  listener: (event: ContractEventOf<TContract, TEventName>) => void,
  options?: ChainComposableOptions,
) {
  const typedApiPromise = useTypedApiPromise(options);

  watchEffect(() => {
    const subscriptionPromise = toValue(typedApiPromise).then((typedApi) =>
      baseWatchContractEvent(
        typedApi,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contract as any,
        address,
        eventName,
      ).subscribe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listener as any,
      ),
    );

    onWatcherCleanup(() =>
      subscriptionPromise.then((subscription) => subscription.unsubscribe()),
    );
  });
}
