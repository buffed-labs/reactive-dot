import type { UndefinedToOptional } from "../types.js";

export function omitUndefinedProperties<T extends Record<string, unknown>>(
  obj: T,
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as UndefinedToOptional<T>;
}
