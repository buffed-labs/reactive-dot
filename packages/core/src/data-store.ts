import type { ChainDescriptorOf, ChainId } from "./chains.js";
import type { Query, QueryInstruction } from "./query-builder.js";

export interface DataStore {
  invalidateQuery<TChainId extends ChainId | undefined>(
    query: (
      query: Query<[], ChainDescriptorOf<TChainId>>,
    ) => Query<QueryInstruction[], ChainDescriptorOf<TChainId>>,
    options?: { chainId?: TChainId },
  ): void;
}
