import type { GenericTransaction } from "../../transaction.js";
import type { MaybePromise } from "../../types.js";
import type { SolidityContract } from "../contract.js";
import type { SolidityTxBody } from "./types.js";
import type { Abi, ExtractAbiFunctionNames } from "abitype";

export type SolidityMutationBuilder = <
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, "nonpayable" | "payable">,
>(
  contract: SolidityContract<TAbi>,
  address: string,
  functionName: TFunctionName,
  data: SolidityTxBody<TAbi, TFunctionName>,
) => MaybePromise<GenericTransaction>;
