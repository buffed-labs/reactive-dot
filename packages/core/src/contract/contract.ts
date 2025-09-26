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

/** @experimental */
export function defineContract<T extends GenericInkDescriptors>(config: {
  type?: "ink";
  descriptor: T;
}): InkContract<T>;
export function defineContract<const T extends Abi>(config: {
  type: "solidity";
  abi: T;
}): SolidityContract<T>;
export function defineContract(
  config:
    | { type?: "ink"; descriptor: GenericInkDescriptors }
    | { type: "solidity"; abi: Abi },
) {
  const id = globalThis.crypto.randomUUID();

  switch (config.type) {
    case "solidity":
      return new SolidityContract(id, config.abi);
    case undefined:
    case "ink":
    default:
      return new InkContract(id, config.descriptor);
  }
}
