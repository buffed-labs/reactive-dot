import type { ChainDescriptorOf, ChainId } from "./chains.js";
import type {
  SimpleInkQueryInstruction,
  SimpleSolidityQueryInstruction,
} from "./internal.js";
import type {
  ContractReadInstruction,
  Query,
  QueryInstruction,
  SimpleQueryInstruction,
} from "./query-builder.js";

// https://github.com/microsoft/TypeScript/issues/54451
type MappedOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

export interface DataStore {
  invalidateQuery<TChainId extends ChainId | undefined>(
    query: (
      query: Query<[], ChainDescriptorOf<TChainId>>,
    ) => Query<QueryInstruction[], ChainDescriptorOf<TChainId>>,
    options?: { chainId?: TChainId },
  ): void;

  /**
   * @experimental
   */
  invalidateChainQueries<TChainId extends ChainId | undefined>(
    shouldInvalidate: (
      instruction: MappedOmit<SimpleQueryInstruction, "directives">,
    ) => boolean,
    options?: {
      chainId?: TChainId;
    },
  ): void;

  /**
   * @experimental
   */
  invalidateContractQueries<TChainId extends ChainId | undefined>(
    shouldInvalidate: (
      instruction: MappedOmit<
        Pick<ContractReadInstruction, "contract" | "address"> &
          (SimpleInkQueryInstruction | SimpleSolidityQueryInstruction),
        "directives"
      >,
    ) => boolean,
    options?: {
      chainId?: TChainId;
    },
  ): void;
}
