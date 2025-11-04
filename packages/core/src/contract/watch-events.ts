import {
  type Contract,
  InkContract,
  type SolidityContract,
} from "./contract.js";
import {
  type InkContractEventNames,
  type InkContractEventOf,
  watchInkContractEvent,
} from "./ink/watch-event.js";
import {
  type SolidityContractEventNames,
  type SolidityContractEventOf,
  watchSolidityContractEvent,
} from "./solidity/watch-event.js";

export type ContractEventNames<TContract extends Contract> =
  TContract extends InkContract
    ? InkContractEventNames<TContract>
    : TContract extends SolidityContract
      ? SolidityContractEventNames<TContract>
      : never;

export type ContractEventOf<
  TContract extends Contract,
  TEventName extends ContractEventNames<TContract>,
> = TContract extends InkContract
  ? TEventName extends InkContractEventNames<TContract>
    ? InkContractEventOf<TContract, TEventName>
    : never
  : TContract extends SolidityContract
    ? TEventName extends SolidityContractEventNames<TContract>
      ? SolidityContractEventOf<TContract, TEventName>
      : never
    : never;

export const watchContractEvent = function watchContractEvent(
  ...args: Parameters<
    typeof watchInkContractEvent & typeof watchSolidityContractEvent
  >
) {
  return args[1] instanceof InkContract
    ? watchInkContractEvent(
        ...(args as unknown as Parameters<typeof watchInkContractEvent>),
      )
    : watchSolidityContractEvent(
        ...(args as Parameters<typeof watchSolidityContractEvent>),
      );
} as typeof watchInkContractEvent & typeof watchSolidityContractEvent;
