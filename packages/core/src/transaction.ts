import type { Transaction, TxObservable } from "polkadot-api";

export type GenericTransaction = Transaction<
  NonNullable<unknown>,
  string,
  string,
  unknown
>;

export type TxOptionsOf<T extends GenericTransaction> =
  T extends Transaction<infer _, infer __, infer ___, infer Asset, infer Ext>
    ? Parameters<TxObservable<Asset, Ext>>[1]
    : never;
