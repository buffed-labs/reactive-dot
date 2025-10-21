// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ChainConfig } from "./config.js";
import type { ChainDefinition } from "polkadot-api";

export class UnsafeDescriptor<_ extends ChainDefinition = ChainDefinition> {}

/**
 * Create an unsafe chain descriptor for use in {@link ChainConfig}.
 * This descriptor will only be used for type checking and will not be
 * used at runtime to create a Polkadot-API client.
 *
 * @experimental
 * @typeParam T - The chain definition type
 * @returns A descriptor that will only be used for type checking
 */
export function unsafeDescriptor<T extends ChainDefinition>() {
  return new UnsafeDescriptor<T>();
}
