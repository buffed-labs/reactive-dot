import type { GenericTransaction } from "../../transaction.js";
import type {
  StringKeyOf,
  ExtractExactProperties,
  MaybePromise,
} from "../../types.js";
import type { InkContract } from "../contract.js";
import type { GenericInkDescriptors, InkTxBody } from "./types.js";

export type InkMutationBuilder = <
  TDescriptor extends GenericInkDescriptors,
  TMessageName extends StringKeyOf<
    ExtractExactProperties<
      TDescriptor["__types"]["messages"],
      { mutates: true }
    >
  >,
>(
  contract: InkContract<TDescriptor>,
  address: string,
  message: TMessageName,
  ...[body]: InkTxBody<TDescriptor, TMessageName> extends Record<string, never>
    ? [body?: InkTxBody<TDescriptor, TMessageName>]
    : [body: InkTxBody<TDescriptor, TMessageName>]
) => MaybePromise<GenericTransaction>;
