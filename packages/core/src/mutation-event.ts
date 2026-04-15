import type { Address } from "./address.js";
import type { ChainId } from "./chains.js";
import type { Contract } from "./contract/contract.js";
import type { Transaction } from "polkadot-api";

export type MutationEvent = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  chainId: ChainId;
  call?: Transaction["decodedCall"];
};

export type ContractMutationEvent = MutationEvent & {
  contractCalls: Array<{
    contract: Contract;
    address: Address;
    message: string;
  }>;
};
