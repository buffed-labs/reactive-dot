import type { SimpleQueryInstruction } from "../query-builder.js";
import { preflight, query } from "./query.js";
import type { ChainDefinition, TypedApi } from "polkadot-api";
import { of, firstValueFrom } from "rxjs";
import { describe, it, expect } from "vitest";

const dummyValue = { result: "dummy" };

const fakeApi = {
  constants: {
    test: {
      foo: () => Promise.resolve(dummyValue),
    },
  },
  apis: {
    test: {
      foo: (...args: unknown[]) => Promise.resolve({ args, ...dummyValue }),
    },
  },
  query: {
    test: {
      foo: {
        getValue: (...args: unknown[]) =>
          Promise.resolve({
            type: "getValue",
            args,
            ...dummyValue,
          }),
        watchValue: (...args: unknown[]) =>
          of({
            type: "watchValue",
            args,
            ...dummyValue,
          }),
        getEntries: (..._: unknown[]) =>
          Promise.resolve([{ keyArgs: "foo", value: "bar" }]),
        watchEntries: (..._: unknown[]) =>
          of({ entries: [{ args: "foo", value: "bar" }], deltas: null }),
      },
    },
  },
} as unknown as TypedApi<ChainDefinition>;

describe("preflight", () => {
  it('should return "promise" for constant instruction', () => {
    const instruction = {
      type: "constant",
      pallet: "test",
      constant: "foo",
    } as SimpleQueryInstruction;

    expect(preflight(instruction)).toBe("promise");
  });

  it('should return "promise" for runtime-api instruction', () => {
    const instruction = {
      type: "runtime-api",
      api: "test",
      method: "foo",
      args: [],
      at: undefined,
      directives: {
        defer: undefined,
      },
    } as SimpleQueryInstruction;

    expect(preflight(instruction)).toBe("promise");
  });

  it('should return "observable" for storage-entries instruction', () => {
    const instruction = {
      type: "storage-entries",
      pallet: "test",
      storage: "foo",
      args: [],
      at: undefined,
      directives: {
        defer: undefined,
      },
    } as SimpleQueryInstruction;

    expect(preflight(instruction)).toBe("observable");
  });

  it('should return "observable" for storage instruction', () => {
    const instruction = {
      type: "storage",
      pallet: "test",
      storage: "foo",
      keys: [],
      at: undefined,
      directives: {
        defer: undefined,
      },
    } as SimpleQueryInstruction;

    expect(preflight(instruction)).toBe("observable");
  });

  it('should return "promise" if "at" is provided and starts with "0x"', () => {
    const instruction = {
      type: "storage",
      pallet: "test",
      storage: "foo",
      keys: [1],
      at: "0x1234",
      directives: {
        defer: undefined,
      },
    } as SimpleQueryInstruction;

    expect(preflight(instruction)).toBe("promise");
  });
});

it('should handle "constant" instruction', async () => {
  const instruction = {
    type: "constant",
    pallet: "test",
    constant: "foo",
  } as SimpleQueryInstruction;

  const result = await query(fakeApi, instruction);

  expect(result).toEqual(dummyValue);
});

it('should handle "runtime-api" instruction', async () => {
  const instruction = {
    type: "runtime-api",
    api: "test",
    method: "foo",
    args: [1, 2],
  } as SimpleQueryInstruction;

  const result = await query(fakeApi, instruction);

  expect(result).toEqual({
    args: [1, 2, { signal: undefined, at: undefined }],
    ...dummyValue,
  });
});

it('should handle "storage" instruction with at starting with "0x" (using getValue)', async () => {
  const instruction = {
    type: "storage",
    pallet: "test",
    storage: "foo",
    keys: [3],
    at: "0xabc",
    directives: {
      defer: undefined,
    },
  } as SimpleQueryInstruction;

  const result = await query(fakeApi, instruction);

  expect(result).toEqual({
    type: "getValue",
    args: [3, { at: "0xabc" }],
    ...dummyValue,
  });
});

it('should handle "storage" instruction without at or non-hex at (using watchValue)', async () => {
  const instruction = {
    type: "storage",
    pallet: "test",
    storage: "foo",
    keys: [3],
  } as SimpleQueryInstruction;

  const result = await firstValueFrom(
    // @ts-expect-error this is an observable
    query(fakeApi, instruction),
  );

  expect(result).toEqual({ type: "watchValue", args: [3], ...dummyValue });
});

it('should handle "storage-entries" instruction with at starting with "0x" (using getEntries)', async () => {
  const instruction = {
    type: "storage-entries",
    pallet: "test",
    storage: "foo",
    args: [3],
    at: "0xabc",
    directives: {
      defer: undefined,
    },
  } as SimpleQueryInstruction;

  const result = await query(fakeApi, instruction);

  expect(result).toMatchObject([
    Object.assign(["foo", "bar"], { keyArgs: "foo", value: "bar" }),
  ]);
});

it('should handle "storage-entries" instruction without at or non-hex at (using watchEntries)', async () => {
  const instruction = {
    type: "storage-entries",
    pallet: "test",
    storage: "foo",
    args: [3],
  } as SimpleQueryInstruction;

  const result = await firstValueFrom(
    // @ts-expect-error this is an observable
    query(fakeApi, instruction),
  );

  expect(result).toMatchObject([
    Object.assign(["foo", "bar"], { keyArgs: "foo", value: "bar" }),
  ]);
});
