import type { UndefinedToOptional } from "../../types.js";
import type { SolidityContract } from "../contract.js";
import type {
  Abi,
  ExtractAbiFunctionNames,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
} from "abitype";

export type SolidityTxBody<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, "nonpayable" | "payable">,
> = UndefinedToOptional<{
  args: AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
    "inputs"
  >["length"] extends 0
    ?
        | AbiParametersToPrimitiveTypes<
            ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
            "inputs"
          >
        | undefined
    : AbiParametersToPrimitiveTypes<
        ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
        "inputs"
      >;
  value: ExtractAbiFunction<
    TAbi,
    TFunctionName
  >["stateMutability"] extends "payable"
    ? bigint
    : undefined;
}>;

export type AbiOfContract<TContract extends SolidityContract> =
  TContract extends SolidityContract<infer Abi> ? Abi : never;
