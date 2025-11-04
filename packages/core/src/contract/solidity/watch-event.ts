import { type Address, isEqual } from "../../address.js";
import type { SolidityContract } from "../contract.js";
import type { ContractCompatApi, ContractEvent } from "../types.js";
import type { ExtractAbiEvent, ExtractAbiEventNames } from "abitype";
import type { AbiEvent } from "ox";
import { defer } from "rxjs";
import { map, switchMap } from "rxjs/operators";

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

      return api.event.Revive.ContractEmitted.watch((event) => {
        if (
          address !== undefined &&
          !isEqual(event.contract.asHex(), address)
        ) {
          return false;
        }

        return event.topics.every((topic, index) => {
          const filterTopic = topics[index];

          return (
            filterTopic === undefined ||
            filterTopic === null ||
            (typeof filterTopic === "string" &&
              topic.asHex() === filterTopic) ||
            (Array.isArray(filterTopic) &&
              filterTopic.some((candidate) => topic.asHex() === candidate))
          );
        });
      }).pipe(
        map((event) => {
          const decoded = AbiEvent.decode(eventAbi, {
            data: event.payload.data.asHex(),
            topics: event.payload.topics.map((topic) => topic.asHex()),
          });

          return {
            block: event.meta.block,
            contract: event.payload.contract.asHex(),
            name: eventName,
            data: decoded,
          } as SolidityContractEventOf<TContract, TEventName>;
        }),
      );
    }),
  );
}
