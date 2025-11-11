import { compact } from "@polkadot-api/substrate-bindings";
import { mergeUint8 } from "@polkadot-api/utils";

// https://github.com/novasamatech/parity-signer/blob/738e34f0b60f86b718267cfe1ca766bd291640ed/docs/src/development/UOS.md
export const vaultQrHeader = new Uint8Array([0x53]);

export const vaultQrEncryption = {
  ed25519: 0x00,
  sr25519: 0x01,
  ecdsa: 0x02,
  unsigned: 0xff,
} as const;

export type VaultQrEncryption =
  (typeof vaultQrEncryption)[keyof typeof vaultQrEncryption];

export const VaultQrPayloadType = {
  legacyTx: 0x00,
  tx: 0x02,
  message: 0x03,
  bulkTx: 0x04,
  loadMetadataUpdate: 0x80,
  loadTypesUpdate: 0x81,
  addSpecsUpdate: 0xc1,
  derivationsImport: 0xce,
} as const;

export type VaultQrPayloadType =
  (typeof VaultQrPayloadType)[keyof typeof VaultQrPayloadType];

export const createQrTransaction = (
  encryption: VaultQrEncryption,
  publicKey: Uint8Array,
  callData: Uint8Array,
  extensions: Uint8Array,
  genesisHash: Uint8Array,
) =>
  mergeUint8([
    vaultQrHeader,
    new Uint8Array([encryption]),
    new Uint8Array([VaultQrPayloadType.tx]),
    publicKey,
    compact.enc(callData.length),
    callData,
    extensions,
    genesisHash,
  ]);

export const createQrMessage = (
  encryption: VaultQrEncryption,
  publicKey: Uint8Array,
  data: Uint8Array,
  genesisHash: Uint8Array,
) =>
  mergeUint8([
    vaultQrHeader,
    new Uint8Array([encryption]),
    new Uint8Array([VaultQrPayloadType.message]),
    publicKey,
    compact.enc(data.length),
    data,
    genesisHash,
  ]);
