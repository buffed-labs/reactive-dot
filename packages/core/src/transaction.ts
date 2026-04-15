import type { Transaction, TxOptions } from "polkadot-api";

export type TxOptionsOf<T extends Transaction> =
  T extends Transaction<infer Asset, infer Ext> ? TxOptions<Asset, Ext> : never;
