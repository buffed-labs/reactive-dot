import {
  createQrMessage,
  createQrTransaction,
  vaultQrEncryption,
  vaultQrHeader,
  vaultQrPayloadType,
} from "./vendor.js";
import { expect, test } from "vitest";

test("consts", () => {
  expect(vaultQrHeader).toMatchInlineSnapshot(`
    Uint8Array [
      83,
    ]
  `);

  expect(vaultQrEncryption).toMatchInlineSnapshot(`
    {
      "ecdsa": 2,
      "ed25519": 0,
      "sr25519": 1,
      "unsigned": 255,
    }
  `);

  expect(vaultQrPayloadType).toMatchInlineSnapshot(`
    {
      "addSpecsUpdate": 193,
      "bulkTx": 4,
      "derivationsImport": 206,
      "legacyTx": 0,
      "loadMetadataUpdate": 128,
      "loadTypesUpdate": 129,
      "message": 3,
      "tx": 2,
    }
  `);
});

test("createQrTransaction", () =>
  expect(
    createQrTransaction(
      vaultQrEncryption.ecdsa,
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5, 6]),
      new Uint8Array([7, 8]),
      new Uint8Array([9, 10, 11]),
    ),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      83,
      2,
      2,
      1,
      2,
      3,
      12,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
    ]
  `));

test("createQrMessage", () =>
  expect(
    createQrMessage(
      vaultQrEncryption.sr25519,
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5, 6]),
      new Uint8Array([7, 8, 9]),
    ),
  ).toMatchInlineSnapshot(`
    Uint8Array [
      83,
      1,
      3,
      1,
      2,
      3,
      12,
      4,
      5,
      6,
      7,
      8,
      9,
    ]
  `));
