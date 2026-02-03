import { extractPolkadotSigner } from "./signer.js";
import type { WalletAccount } from "./wallets/account.js";
import type { PolkadotSigner } from "polkadot-api";
import { describe, expect, test } from "vitest";

describe("extractPolkadotSigner", () => {
  test("returns undefined when signer is undefined", () => {
    expect(extractPolkadotSigner(undefined)).toBeUndefined();
  });

  test("returns polkadotSigner property when signer is a WalletAccount", () => {
    const mockPolkadotSigner = {
      signTx: () => {},
    } as unknown as PolkadotSigner;
    const walletAccount = {
      polkadotSigner: mockPolkadotSigner,
      address: "0x123",
    } as WalletAccount;

    expect(extractPolkadotSigner(walletAccount)).toBe(mockPolkadotSigner);
  });

  test("returns signer directly when it is a PolkadotSigner", () => {
    const mockPolkadotSigner = {
      signTx: () => {},
    } as unknown as PolkadotSigner;

    expect(extractPolkadotSigner(mockPolkadotSigner)).toBe(mockPolkadotSigner);
  });
});
