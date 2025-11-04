import { type InkContract } from "../../contract/contract.js";
import type { GenericInkDescriptors } from "./types.js";
import type { getInkClient as getInkClientType } from "polkadot-api/ink";

const clientCache = new WeakMap<
  GenericInkDescriptors,
  ReturnType<typeof getInkClientType>
>();

export function getInkClient(contract: InkContract) {
  return import("polkadot-api/ink").then(
    ({ getInkClient }) =>
      clientCache.get(contract.descriptor) ??
      clientCache
        .set(contract.descriptor, getInkClient(contract.descriptor))
        .get(contract.descriptor)!,
  );
}
