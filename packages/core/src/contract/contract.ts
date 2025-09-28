import type { GenericInkDescriptors } from "./ink/types.js";
import type { Abi } from "abitype";

export class InkContract<
  T extends GenericInkDescriptors = GenericInkDescriptors,
> {
  constructor(
    /** @internal */
    readonly id: string,
    /** @internal */
    readonly descriptor: T,
  ) {}
}

export class SolidityContract<T extends Abi = Abi> {
  constructor(
    /** @internal */
    readonly id: string,
    /** @internal */
    readonly abi: T,
  ) {}
}

export type Contract = InkContract | SolidityContract;

/** @deprecated Specify the contract type explicitly */
export function defineContract<T extends GenericInkDescriptors>(config: {
  id?: string;
  descriptor: T;
}): InkContract<T>;
export function defineContract<T extends GenericInkDescriptors>(config: {
  id?: string;
  type: "ink";
  descriptor: T;
}): InkContract<T>;
export function defineContract<const T extends Abi>(config: {
  id?: string;
  type: "solidity";
  abi: T;
}): SolidityContract<T>;
export function defineContract(
  config: { id?: string } & (
    | { type?: "ink"; descriptor: GenericInkDescriptors }
    | { type: "solidity"; abi: Abi }
  ),
) {
  const id = config.id ?? globalThis.crypto.randomUUID();

  switch (config.type) {
    case "solidity":
      return new SolidityContract(id, config.abi);
    case undefined:
    case "ink":
    default:
      return new InkContract(id, config.descriptor);
  }
}
