import { BaseError } from "../errors.js";
import type { GenericInkDescriptors } from "./ink/types.js";
import type { Abi } from "abitype";

type InkContractConfig<
  T extends GenericInkDescriptors = GenericInkDescriptors,
> = {
  type: "ink";
  descriptor: T;
};

type SolidityContractConfig<T extends Abi = Abi> = {
  type: "solidity";
  abi: T;
};

type ContractConfig = InkContractConfig | SolidityContractConfig;

const configs = new Map<string, ContractConfig>();

export class InkContract<
  _ extends GenericInkDescriptors = GenericInkDescriptors,
> {
  readonly #id: string;

  constructor(id: string) {
    this.#id = id;
  }

  valueOf() {
    return this.#id;
  }
}

export class SolidityContract<_ extends Abi = Abi> {
  readonly #id: string;

  constructor(id: string) {
    this.#id = id;
  }

  valueOf() {
    return this.#id;
  }
}

export type Contract = InkContract | SolidityContract;

export type DescriptorOfContract<TContract extends InkContract> =
  TContract extends InkContract<infer TDescriptor> ? TDescriptor : never;

/** @experimental */
export function defineContract<T extends GenericInkDescriptors>(
  config: InkContractConfig<T>,
): InkContract<T>;
export function defineContract<const T extends Abi>(
  config: SolidityContractConfig<T>,
): SolidityContract<T>;
export function defineContract(config: ContractConfig): Contract {
  const id = globalThis.crypto.randomUUID();

  configs.set(id, config);

  switch (config.type) {
    case "ink":
      return new InkContract(id);
    case "solidity":
      return new SolidityContract(id);
  }
}

export function getContractConfig(contract: InkContract): InkContractConfig;
export function getContractConfig(
  contract: SolidityContract,
): SolidityContractConfig;
export function getContractConfig(contract: InkContract | SolidityContract) {
  const config = configs.get(contract.valueOf());

  if (config === undefined) {
    throw new BaseError(`Contract ${contract.valueOf()} not found`);
  }

  return config;
}
