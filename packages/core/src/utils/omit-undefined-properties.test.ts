import { omitUndefinedProperties } from "./omit-undefined-properties.js";
import { expect, it } from "vitest";

it("removes keys with undefined values", () => {
  const input = { a: 1, b: undefined, c: "hello", d: null };
  const result = omitUndefinedProperties(input);

  expect(result).toEqual({ a: 1, c: "hello", d: null });
});

it("preserves keys with null, false, or zero values", () => {
  const input = { a: null, b: false, c: 0 };
  const result = omitUndefinedProperties(input);

  expect(result).toEqual(input);
});

it("returns the same object if no undefined properties", () => {
  const input = { a: 10, b: "test" };
  const result = omitUndefinedProperties(input);

  expect(result).toEqual(input);
});

it("returns an empty object when all properties are undefined", () => {
  const input = { a: undefined, b: undefined };
  const result = omitUndefinedProperties(input);

  expect(result).toEqual({});
});

it("handles an empty object", () => {
  const input = {};
  const result = omitUndefinedProperties(input);

  expect(result).toEqual({});
});

it("does not remove nested undefined values", () => {
  const input = { a: { b: undefined, c: 2 } };
  const result = omitUndefinedProperties(input);

  expect(result).toEqual({ a: { b: undefined, c: 2 } });
});
