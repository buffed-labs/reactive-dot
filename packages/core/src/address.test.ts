import { isEqual, toH160Hex, toSs58String } from "./address.js";
import { AccountId, FixedSizeBinary } from "polkadot-api";
import { describe, expect, it, test } from "vitest";

const ss58Alice = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"; // Alice's address (default/format 42)
const h160HexForAliceSs58Derived = "0x9621dde636de098b43efb0fa9b61facfe328f99d";

const genericH160Hex = "0x1234567890123456789012345678901234567890";
const genericH160FixedBinary = FixedSizeBinary.fromHex(genericH160Hex);

const genericPaddedBytes = new Uint8Array(32).fill(0xee);
genericPaddedBytes.set(genericH160FixedBinary.asBytes()); // First 20 bytes

const ss58Format42ForGenericH160 = AccountId(42).dec(genericPaddedBytes);
const ss58Format0ForGenericH160 = AccountId(0).dec(genericPaddedBytes);

describe("toSs58String", () => {
  it("should convert hex string to SS58 address with default format", () =>
    expect(toSs58String(genericH160Hex)).toBe(ss58Format42ForGenericH160));

  it("should convert hex string to SS58 address with specified format (2)", () => {
    const accountId = AccountId(2);

    expect(toSs58String(genericH160Hex, 2)).toBe(
      accountId.dec(accountId.enc(ss58Format0ForGenericH160)),
    );
  });

  it("should return the same SS58 address if input is SS58String (default format)", () =>
    expect(toSs58String(ss58Alice)).toBe(ss58Alice));

  it("should return the same SS58 address if input is SS58String with specified format (2)", () => {
    const accountId = AccountId(2);

    expect(toSs58String(ss58Alice, 2)).toBe(
      accountId.dec(accountId.enc(ss58Alice)),
    );
  });
});

describe("toH160Hex", () => {
  it("leaves hex string as is", () => {
    const input = genericH160Hex;
    const result = toH160Hex(input);

    expect(result).toBe(genericH160Hex);
  });

  it("converts an SS58 address string to H160 FixedSizeBinary", () => {
    const input = ss58Alice;
    const result = toH160Hex(input);

    expect(result).toBe(h160HexForAliceSs58Derived);
  });
});

test("isEqual", () => {
  expect(isEqual(ss58Alice, h160HexForAliceSs58Derived)).toBeTruthy();

  expect(
    isEqual(ss58Format0ForGenericH160, ss58Format42ForGenericH160),
  ).toBeTruthy();

  expect(isEqual(ss58Alice, genericH160Hex)).toBeFalsy();

  expect(
    isEqual(
      "0xa0cf798816d4b9b9866b5330eea46a18382f251e",
      "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    ),
  ).toBeTruthy();

  expect(
    isEqual(
      "0xa0cf798816d4b9b9866b5330eea46a18382f251e",
      "0xA0Cf798816D4b9b9866b5330EEa46a18382f251f",
    ),
  ).toBeFalsy();
});
