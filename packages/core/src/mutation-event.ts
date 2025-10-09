import type { Address } from "./address.js";
import type { ChainId } from "./chains.js";
import type { Contract } from "./contract/contract.js";
import type { GenericTransaction } from "./transaction.js";

export type MutationEvent = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  chainId: ChainId;
  call?: GenericTransaction["decodedCall"];
};

export type ContractMutationEvent = MutationEvent & {
  contractCalls: Array<{
    contract: Contract;
    address: Address;
    message: string;
  }>;
};
