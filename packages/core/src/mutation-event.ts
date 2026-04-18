import type { Address } from "./address.js";
import type { ChainId } from "./chains.js";
import type { Contract } from "./contract/contract.js";
import type { Transaction } from "polkadot-api";

export interface MutationEvent {
  id: `${string}-${string}-${string}-${string}-${string}`;
  chainId: ChainId;
  call?: Transaction["decodedCall"];
}

export interface ContractMutationEvent extends MutationEvent {
  contractCalls: Array<{
    contract: Contract;
    address: Address;
    message: string;
  }>;
}
