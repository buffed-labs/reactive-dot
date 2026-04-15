import type { Transaction, TxOptions } from "polkadot-api";

export type GenericTransaction = Transaction;

export type TxOptionsOf<T extends GenericTransaction> =
  T extends Transaction<infer Asset, infer Ext> ? TxOptions<Asset, Ext> : never;
