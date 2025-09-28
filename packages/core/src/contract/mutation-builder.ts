import type { GenericTransaction } from "../transaction.js";
import type {
  ExtractExactProperties,
  MaybePromise,
  StringKeyOf,
} from "../types.js";
import type { InkContract, SolidityContract } from "./contract.js";
import type { GenericInkDescriptors, InkTxBody } from "./ink/types.js";
import type { SolidityTxBody } from "./solidity/types.js";
import type { Abi, ExtractAbiFunctionNames } from "abitype";

export type MutationBuilder = {
  <
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
    ...[body]: InkTxBody<TDescriptor, TMessageName> extends Record<
      string,
      never
    >
      ? [body?: InkTxBody<TDescriptor, TMessageName>]
      : [body: InkTxBody<TDescriptor, TMessageName>]
  ): MaybePromise<GenericTransaction>;
  <
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<
      TAbi,
      "nonpayable" | "payable"
    >,
  >(
    contract: SolidityContract<TAbi>,
    address: string,
    functionName: TFunctionName,
    ...[body]: SolidityTxBody<TAbi, TFunctionName> extends Record<string, never>
      ? [body?: SolidityTxBody<TAbi, TFunctionName>]
      : [body: SolidityTxBody<TAbi, TFunctionName>]
  ): MaybePromise<GenericTransaction>;
};
