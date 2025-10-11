import type {
  BaseInstruction,
  InstructionResponseWithDirectives,
  MultiInstruction,
} from "../../query-builder.js";
import type { Finality, FlatHead } from "../../types.js";
import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";

export type FunctionCallInstruction = BaseInstruction<"function"> & {
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

type InferSolidityInstructionPayloadPreDirectives<
  TInstruction extends SolidityQueryInstruction,
  TAbi extends Abi,
> = TInstruction extends FunctionCallInstruction
  ? InferFunctionCallInstructionPayload<TInstruction, TAbi>
  : never;

export type InferSolidityInstructionPayload<
  TInstruction extends SolidityQueryInstruction,
  TAbi extends Abi,
> = InstructionResponseWithDirectives<
  TInstruction,
  InferSolidityInstructionPayloadPreDirectives<TInstruction, TAbi>
>;

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
    TDefer extends boolean = false,
  >(
    name: TName,
    ...[args, options]: TArguments["length"] extends 0
      ? [args?: TArguments, options?: { at?: Finality; defer?: TDefer }]
      : [args: TArguments, options?: { at?: Finality; defer?: TDefer }]
  ) {
    return this.#append({
      method: "function",
      name,
      args: (args ?? []) as unknown as unknown[],
      at: options?.at,
      directives: { defer: options?.defer as NoInfer<TDefer> },
    });
  }

  funcs<
    TName extends ExtractAbiFunctionNames<TAbi, "pure" | "view">,
    TArguments extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TAbi, TName>["inputs"],
      "inputs"
    >,
    TDefer extends boolean = false,
    TStream extends boolean = false,
  >(
    name: TName,
    args: TArguments[],
    options?: { at?: Finality; defer?: TDefer; stream?: TStream },
  ) {
    return this.#append({
      method: "function",
      name,
      args,
      at: options?.at,
      multi: true,
      directives: {
        defer: options?.defer as NoInfer<TDefer>,
        stream: options?.stream as NoInfer<TStream>,
      },
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
