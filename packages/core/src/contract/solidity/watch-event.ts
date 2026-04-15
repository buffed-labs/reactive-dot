import { type Address, isEqual } from "../../address.js";
import type { SolidityContract } from "../contract.js";
import type { ContractCompatApi, ContractEvent } from "../types.js";
import type { ExtractAbiEvent, ExtractAbiEventNames } from "abitype";
import type { AbiEvent } from "ox";
import { Binary } from "polkadot-api";
import { defer, mergeMap, switchMap } from "rxjs";

export type SolidityContractEventNames<TContract extends SolidityContract> =
  ExtractAbiEventNames<TContract["abi"]>;

export type SolidityContractEventOf<
  TContract extends SolidityContract,
  TEventName extends SolidityContractEventNames<TContract>,
> = ContractEvent<
  TEventName,
  AbiEvent.decode.ReturnType<ExtractAbiEvent<TContract["abi"], TEventName>>
>;

export function watchSolidityContractEvent<
  TContract extends SolidityContract,
  TEventName extends SolidityContractEventNames<TContract>,
>(
  api: ContractCompatApi,
  contract: TContract,
  address: Address | undefined,
  eventName: TEventName,
) {
  return defer(() => import("ox")).pipe(
    switchMap(({ AbiEvent }) => {
      const eventAbi = AbiEvent.fromAbi(contract.abi, eventName as string);
      const { topics } = AbiEvent.encode(eventAbi);

      return api.event.Revive.ContractEmitted.watch().pipe(
        mergeMap(({ block, events }) =>
          events
            .filter((evt) => {
              const payload = evt.payload;
              if (
                address !== undefined &&
                !isEqual(payload.contract, address)
              ) {
                return false;
              }

              return payload.topics.every((topic, index) => {
                const filterTopic = topics[index];

                return (
                  filterTopic === undefined ||
                  filterTopic === null ||
                  (typeof filterTopic === "string" && topic === filterTopic) ||
                  (Array.isArray(filterTopic) &&
                    filterTopic.some((candidate) => topic === candidate))
                );
              });
            })
            .map((evt) => {
              const decoded = AbiEvent.decode(eventAbi, {
                data: Binary.toHex(evt.payload.data) as `0x${string}`,
                topics: evt.payload.topics as readonly `0x${string}`[],
              });

              return {
                block,
                contract: evt.payload.contract,
                name: eventName,
                data: decoded,
              } as SolidityContractEventOf<TContract, TEventName>;
            }),
        ),
      );
    }),
  );
}
