import type { ChainId, idle, Query } from "@reactive-dot/core";
import type {
  QueryInstruction,
  ChainDescriptorOf,
  Falsy,
  FalsyGuard,
  InferQueryPayload,
} from "@reactive-dot/core/internal.js";

type ChainOptions<TChainId extends ChainId | undefined> = {
  /**
   * Override default chain ID
   */
  chainId: TChainId | undefined;
};

export type ChainHookOptions<
  TChainId extends ChainId | undefined = ChainId | undefined,
> = Partial<ChainOptions<TChainId>>;

export type QueryOptions<TChainId extends ChainId | undefined> =
  ChainOptions<TChainId> & { query: QueryArgument<TChainId> };

export type QueryArgument<TChainId extends ChainId | undefined> =
  | Query<QueryInstruction[], ChainDescriptorOf<TChainId>>
  | ((
      query: Query<[], ChainDescriptorOf<TChainId>>,
    ) => Query<QueryInstruction[], ChainDescriptorOf<TChainId>> | Falsy)
  | Falsy;

export type DeferOptions<TDefer extends boolean> = {
  /** Return fallback instead of suspending when the data is not ready */
  defer?: TDefer;
};

export type InferQueryArgumentResult<
  TChainId extends ChainId | undefined,
  TQuery extends QueryArgument<TChainId>,
> = TQuery extends Falsy
  ? typeof idle
  : TQuery extends Query
    ? InferQueryPayload<TQuery>
    : FalsyGuard<
        ReturnType<Exclude<TQuery, Falsy | Query>>,
        InferQueryPayload<
          Exclude<ReturnType<Exclude<TQuery, Falsy | Query>>, Falsy>
        >,
        typeof idle
      >;
