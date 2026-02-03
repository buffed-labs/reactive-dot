import type { WalletAccount } from "./wallets/account.js";
import type { PolkadotSigner } from "polkadot-api";

export type Signer = PolkadotSigner | WalletAccount;

export function extractPolkadotSigner(
  signer: Signer | undefined,
): PolkadotSigner | undefined {
  return signer === undefined
    ? signer
    : "polkadotSigner" in signer
      ? signer.polkadotSigner
      : signer;
}
