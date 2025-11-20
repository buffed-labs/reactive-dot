import { ReadonlyWallet } from "./readonly-wallet.js";
import type { PolkadotSigner } from "polkadot-api";
import { firstValueFrom } from "rxjs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

let wallet: ReadonlyWallet;

beforeEach(() => {
  wallet = new ReadonlyWallet();
});

afterEach(() => {
  vi.clearAllMocks();
});

it("should have correct id and name", () => {
  expect(wallet.id).toBe("readonly");
  expect(wallet.name).toBe("Readonly Wallet");
});

it("should map accounts to PolkadotSignerAccount", async () => {
  const mockPublicKey = new Uint8Array([1, 2, 3]);
  wallet.accountStore.add({
    publicKey: mockPublicKey,
    name: "Test Account",
  });

  const accounts = await firstValueFrom(wallet.accounts$);
  expect(accounts).toHaveLength(1);
  expect(accounts[0]!.polkadotSigner as PolkadotSigner).toBeUndefined();
});

it("should disconnect and clear accounts", () => {
  wallet.accountStore.add({
    publicKey: new Uint8Array([1, 2, 3]),
  });

  wallet.disconnect();

  expect(wallet.accountStore.values()).toHaveLength(0);
});

it("should emit connected$ as true when accounts exist", async () => {
  wallet.accountStore.add({
    publicKey: new Uint8Array([1, 2, 3]),
  });

  const connected = await firstValueFrom(wallet.connected$);
  expect(connected).toBe(true);
});

it("should emit connected$ as false when no accounts exist", async () => {
  const connected = await firstValueFrom(wallet.connected$);
  expect(connected).toBe(false);
});
