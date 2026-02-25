import { type Address, isEqual } from "../../address.js";
import { BaseError } from "../../errors.js";
import type { InkContract } from "../contract.js";
import { getInkClient } from "../ink/get-ink-client.js";
import type { ContractCompatApi, ContractEvent } from "../types.js";
import type { EventSpecV5 } from "@polkadot-api/ink-contracts";
import { combineLatest, defer, map, mergeMap, from } from "rxjs";

export type InkContractEventNames<TContract extends InkContract> =
  TContract["descriptor"]["__types"]["event"]["type"];

export type InkContractEventOf<
  TContract extends InkContract,
  TEventName extends InkContractEventNames<TContract>,
> = ContractEvent<
  TEventName,
  Extract<
    TContract["descriptor"]["__types"]["event"],
    { type: TEventName }
  > extends never
    ? never
    : Extract<
        TContract["descriptor"]["__types"]["event"],
        { type: TEventName }
      >["value"]
>;

export function watchInkContractEvent<
  TContract extends InkContract,
  TEventName extends InkContractEventNames<TContract>,
>(
  api: ContractCompatApi,
  contract: TContract,
  address: Address | undefined,
  eventName: TEventName,
) {
  const eventSpec = contract.descriptor.metadata?.spec.events.find(
    (event) => event.label === eventName,
  ) as EventSpecV5;

  const signatureTopic = eventSpec.signature_topic;

  if (signatureTopic === undefined) {
    throw new BaseError(`Event ${eventName} does not have a signature topic`);
  }

  return combineLatest([
    defer(() => getInkClient(contract)),
    api.event.Revive.ContractEmitted.watch().pipe(
      mergeMap(({ block, events }) =>
        from(
          events
            .filter((event) => {
              const payload = event.payload;
              if (
                address !== undefined &&
                !isEqual(payload.contract, address)
              ) {
                return false;
              }
              return payload.topics.some(
                (topic) => topic === signatureTopic,
              );
            })
            .map((event) => ({
              payload: event.payload,
              block,
            })),
        ),
      ),
    ),
  ]).pipe(
    map(([inkClient, event]) => {
      const decoded = inkClient.event.decode(event.payload, signatureTopic);
      return {
        block: event.block,
        contract: event.payload.contract,
        name: decoded.type,
        data: decoded.value,
      } as InkContractEventOf<TContract, TEventName>;
    }),
  );
}
