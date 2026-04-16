export function omit<TRecord extends object, TKey extends keyof TRecord>(
  object: TRecord,
  keys: TKey[],
) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key as TKey)),
  ) as Omit<TRecord, TKey>;
}
