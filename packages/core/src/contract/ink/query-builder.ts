/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Address } from "../../address.js";
import type {
  BaseInstruction,
  InstructionResponseWithDirectives,
  MultiInstruction,
} from "../../query-builder.js";
import type {
  ExcludeProperties,
  Finality,
  FlatHead,
  StringKeyOf,
} from "../../types.js";
import type { UnwrapResult } from "./result.js";
import type { GenericInkDescriptors } from "./types.js";

type StorageReadInstruction = BaseInstruction<"storage"> & {
  path: string;
  key: unknown | undefined;
  at: Finality | undefined;
};

type MultiStorageReadInstruction = MultiInstruction<
  StorageReadInstruction,
  "key",
  "keys"
>;

export type InferStorageReadInstructionPayload<
  TInstruction extends StorageReadInstruction | MultiStorageReadInstruction,
  TDescriptor extends GenericInkDescriptors,
> = TDescriptor["__types"]["storage"][TInstruction["path"]]["value"];

type MessageSendInstruction = BaseInstruction<"message"> & {
  name: string;
  body: unknown;
  origin: Address | undefined;
  at: Finality | undefined;
};

type MultiMessageSendInstruction = MultiInstruction<
  MessageSendInstruction,
  "body",
  "bodies"
>;

export type InferMessageSendInstructionPayload<
  TInstruction extends MessageSendInstruction | MultiMessageSendInstruction,
  TDescriptor extends GenericInkDescriptors,
> = UnwrapResult<
  TDescriptor["__types"]["messages"][TInstruction["name"]]["response"]
>;

export type SimpleInkQueryInstruction =
  | StorageReadInstruction
  | MessageSendInstruction;

export type InkQueryInstruction =
  | SimpleInkQueryInstruction
  | MultiStorageReadInstruction
  | MultiMessageSendInstruction;

type InferQueryInstructionPayloadPreDirectives<
  TInstruction extends InkQueryInstruction,
  TDescriptor extends GenericInkDescriptors,
> = TInstruction extends StorageReadInstruction | MultiStorageReadInstruction
  ? InferStorageReadInstructionPayload<TInstruction, TDescriptor>
  : TInstruction extends MessageSendInstruction | MultiMessageSendInstruction
    ? InferMessageSendInstructionPayload<TInstruction, TDescriptor>
    : never;

export type InferQueryInstructionPayload<
  TInstruction extends InkQueryInstruction,
  TDescriptor extends GenericInkDescriptors,
> = InstructionResponseWithDirectives<
  TInstruction,
  InferQueryInstructionPayloadPreDirectives<TInstruction, TDescriptor>
>;

export type InferInkInstructionsPayload<
  TInstructions extends InkQueryInstruction[],
  TDescriptor extends GenericInkDescriptors,
> = FlatHead<
  Extract<
    {
      [Index in keyof TInstructions]: InferQueryInstructionPayload<
        TInstructions[Index],
        TDescriptor
      >;
    },
    unknown[]
  >
>;

export type InferInkQueryPayload<T extends InkQuery> =
  T extends InkQuery<infer Descriptor, infer Instructions>
    ? InferInkInstructionsPayload<Instructions, Descriptor>
    : never;

export class InkQuery<
  TDescriptor extends GenericInkDescriptors = GenericInkDescriptors,
  const TInstructions extends InkQueryInstruction[] = InkQueryInstruction[],
> {
  readonly #instructions: TInstructions;

  constructor(
    instructions: TInstructions = [] as InkQueryInstruction[] as TInstructions,
  ) {
    this.#instructions = instructions;
  }

  get instructions() {
    return Object.freeze(this.#instructions.slice()) as TInstructions;
  }

  rootStorage<TDefer extends boolean = false>(options?: {
    at?: Finality;
    defer?: TDefer;
  }) {
    return this.#append({
      type: "storage",
      path: "" as const,
      key: undefined,
      at: options?.at,
      directives: { defer: options?.defer as NoInfer<TDefer> },
    } satisfies StorageReadInstruction);
  }

  storage<
    const TPath extends Exclude<
      StringKeyOf<TDescriptor["__types"]["storage"]>,
      ""
    >,
    const TDefer extends boolean = false,
  >(
    path: TPath,
    ...[
      key,
      options,
    ]: TDescriptor["__types"]["storage"][TPath]["key"] extends undefined
      ? [
          key?: TDescriptor["__types"]["storage"][TPath]["key"],
          options?: { at?: Finality; defer?: TDefer },
        ]
      : [
          key: TDescriptor["__types"]["storage"][TPath]["key"],
          options?: { at?: Finality; defer?: TDefer },
        ]
  ) {
    return this.#append({
      type: "storage",
      path,
      key: key as any,
      at: options?.at,
      directives: { defer: options?.defer as NoInfer<TDefer> },
    } satisfies StorageReadInstruction);
  }

  storages<
    const TPath extends Exclude<
      StringKeyOf<TDescriptor["__types"]["storage"]>,
      ""
    >,
    const TDefer extends boolean = false,
    const TStream extends boolean = false,
  >(
    path: TPath,
    keys: Array<TDescriptor["__types"]["storage"][TPath]["key"]>,
    options?: { at?: Finality; defer?: TDefer; stream?: TStream },
  ) {
    return this.#append({
      type: "storage",
      multi: true,
      directives: {
        defer: options?.defer as NoInfer<TDefer>,
        stream: options?.stream as NoInfer<TStream>,
      },
      path,
      keys,
      at: options?.at,
    } satisfies MultiStorageReadInstruction);
  }

  message<
    const TName extends StringKeyOf<
      ExcludeProperties<TDescriptor["__types"]["messages"], { mutates: true }>
    >,
    const TDefer extends boolean = false,
  >(
    name: TName,
    ...[body, options]: Extract<
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      undefined | {},
      TDescriptor["__types"]["messages"][TName]["message"]
    > extends never
      ? [
          body: TDescriptor["__types"]["messages"][TName]["message"],
          options?: { origin?: Address; at?: Finality; defer?: TDefer },
        ]
      : [
          body?: TDescriptor["__types"]["messages"][TName]["message"],
          options?: { origin?: Address; at?: Finality; defer?: TDefer },
        ]
  ) {
    return this.#append({
      type: "message",
      // TODO: this is needed for some reason
      name: name as typeof name,
      body,
      origin: options?.origin,
      at: options?.at,
      directives: { defer: options?.defer as NoInfer<TDefer> },
    } satisfies MessageSendInstruction);
  }

  messages<
    const TName extends StringKeyOf<
      ExcludeProperties<TDescriptor["__types"]["messages"], { mutates: true }>
    >,
    const TDefer extends boolean = false,
    const TStream extends boolean = false,
  >(
    name: TName,
    bodies: Array<TDescriptor["__types"]["messages"][TName]["message"]>,
    options?: {
      origin?: Address;
      at?: Finality;
      defer?: TDefer;
      stream?: TStream;
    },
  ) {
    return this.#append({
      type: "message",
      multi: true,
      directives: {
        defer: options?.defer as NoInfer<TDefer>,
        stream: options?.stream as NoInfer<TStream>,
      },
      // TODO: this is needed for some reason
      name: name as typeof name,
      bodies,
      origin: options?.origin,
      at: options?.at,
    } satisfies MultiMessageSendInstruction);
  }

  #append<const TInstruction extends InkQueryInstruction>(
    instruction: TInstruction,
  ) {
    return new InkQuery([...this.#instructions, instruction]) as InkQuery<
      TDescriptor,
      [...TInstructions, TInstruction]
    >;
  }
}
