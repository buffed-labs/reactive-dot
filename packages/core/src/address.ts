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
