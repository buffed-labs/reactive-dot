import { keccak_256 } from "@noble/hashes/sha3.js";
import {
  AccountId,
  FixedSizeBinary,
  type SS58String,
} from "@polkadot-api/substrate-bindings";

export type Address = SS58String | `0x${string}`;

export function toSs58String(
  address: Address,
  ss58Format?: number,
  padInt = 0xee,
) {
  if (!address.startsWith("0x") && ss58Format === undefined) {
    return address;
  }

  const accountId = AccountId(ss58Format);

  if (address.startsWith("0x")) {
    return accountId.dec(
      new Uint8Array([
        ...FixedSizeBinary.fromHex(address).asBytes().slice(0, 20),
        ...Array.from<number>({ length: 12 }).fill(padInt),
      ]),
    );
  }

  return accountId.dec(accountId.enc(address));
}

export function toH160Bytes(address: Address): FixedSizeBinary<20> {
  if (address.startsWith("0x")) {
    return FixedSizeBinary.fromHex(address);
  }

  return FixedSizeBinary.fromBytes(
    keccak_256(FixedSizeBinary.fromAccountId32<32>(address).asBytes()).slice(
      12,
    ),
  );
}

export function toH160Hex(address: Address): `0x${string}` {
  if (address.startsWith("0x")) {
    return address as `0x${string}`;
  }

  return toH160Bytes(address).asHex();
}

export function isEqual(address1: Address, address2: Address): boolean {
  return (
    toH160Hex(address1).toLowerCase() === toH160Hex(address2).toLowerCase()
  );
}
