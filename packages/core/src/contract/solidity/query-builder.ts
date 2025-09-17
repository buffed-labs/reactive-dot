import type { BaseInstruction, MultiInstruction } from "../../query-builder.js";
import type { Finality, FlatHead } from "../../types.js";
import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";

export type FunctionCallInstruction = BaseInstruction<"call-function"> & {
  name: string;
  args: unknown[];
  at: Finality | undefined;
};

export type InferFunctionCallInstructionPayload<
  TInstruction extends FunctionCallInstruction,
  TAbi extends Abi,
> = FlatHead<
  Extract<
    AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TAbi, TInstruction["name"]>["outputs"],
      "outputs"
    >,
    ReadonlyArray<unknown>
  >
>;

export type SimpleSolidityQueryInstruction = FunctionCallInstruction;

export type SolidityQueryInstruction =
  | SimpleSolidityQueryInstruction
  | MultiInstruction<FunctionCallInstruction>;

export type InferSolidityInstructionPayload<
  TInstruction extends SolidityQueryInstruction,
  TAbi extends Abi,
> = TInstruction extends FunctionCallInstruction
  ? InferFunctionCallInstructionPayload<TInstruction, TAbi>
  : TInstruction extends MultiInstruction<FunctionCallInstruction>
    ? InferFunctionCallInstructionPayload<TInstruction, TAbi>[]
    : never;

export type InferSolidityInstructionsPayload<
  TInstructions extends SolidityQueryInstruction[],
  TAbi extends Abi,
> = FlatHead<
  Extract<
    {
      [Index in keyof TInstructions]: InferSolidityInstructionPayload<
        TInstructions[Index],
        TAbi
      >;
    },
    unknown[]
  >
>;

export class SolidityQuery<
  TAbi extends Abi = Abi,
  const TInstructions extends
    SolidityQueryInstruction[] = SolidityQueryInstruction[],
> {
  readonly #instructions: TInstructions;

  constructor(
    instructions: TInstructions = [] as SolidityQueryInstruction[] as TInstructions,
  ) {
    this.#instructions = instructions;
  }

  get instructions() {
    return Object.freeze(this.#instructions.slice()) as TInstructions;
  }

  func<
    TName extends ExtractAbiFunctionNames<TAbi, "pure" | "view">,
    TArguments extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TAbi, TName>["inputs"],
      "inputs"
    >,
  >(
    name: TName,
    ...[args, options]: TArguments["length"] extends 0
      ? [args?: TArguments, options?: { at?: Finality }]
      : [args: TArguments, options?: { at?: Finality }]
  ) {
    return this.#append({
      instruction: "call-function",
      name,
      args: (args ?? []) as unknown as unknown[],
      at: options?.at,
    });
  }

  funcs<
    TName extends ExtractAbiFunctionNames<TAbi, "pure" | "view">,
    TArguments extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TAbi, TName>["inputs"],
      "inputs"
    >,
  >(name: TName, args: TArguments[], options?: { at?: Finality }) {
    return this.#append({
      instruction: "call-function",
      name,
      args,
      at: options?.at,
      multi: true,
    });
  }

  #append<const TInstruction extends SolidityQueryInstruction>(
    instruction: TInstruction,
  ) {
    return new SolidityQuery([
      ...this.#instructions,
      instruction,
    ]) as SolidityQuery<TAbi, [...TInstructions, TInstruction]>;
  }
}
