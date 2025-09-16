/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ExtractExactProperties,
  StringKeyOf,
  UndefinedToOptional,
} from "../../types.js";
import type {
  Event,
  InkCallableDescriptor,
  InkDescriptors,
  InkStorageDescriptor,
} from "@polkadot-api/ink-contracts";

export type MessageOfDescriptor<
  T extends GenericInkDescriptors,
  TMessageName extends string,
> = T["__types"]["messages"][TMessageName];

export type InkTxBody<
  TDescriptor extends GenericInkDescriptors,
  TMessageName extends StringKeyOf<
    ExtractExactProperties<
      TDescriptor["__types"]["messages"],
      { mutates: true }
    >
  >,
> = UndefinedToOptional<{
  data: {} extends MessageOfDescriptor<TDescriptor, TMessageName>["message"]
    ? undefined
    : MessageOfDescriptor<TDescriptor, TMessageName>["message"];
  value: MessageOfDescriptor<TDescriptor, TMessageName>["payable"] extends true
    ? bigint
    : Extract<
          MessageOfDescriptor<TDescriptor, TMessageName>["payable"],
          false | undefined
        > extends never
      ? undefined
      : bigint | undefined;
}>;

export type GenericInkDescriptors = InkDescriptors<
  InkStorageDescriptor,
  InkCallableDescriptor,
  InkCallableDescriptor,
  Event
>;
