import { getAccounts } from "../actions/get-accounts.js";
import { defineConfig } from "../config.js";
import { toObservable } from "../internal.js";
import type { PolkadotSignerAccount } from "../wallets/account.js";
import { Wallet } from "../wallets/wallet.js";
import { getClient } from "./get-client.js";
import { whenAccountsChanged } from "./when-accounts-changed.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import type { PolkadotClient } from "polkadot-api";
import { lastValueFrom, Observable } from "rxjs";
import { afterEach, expect, it, vi } from "vitest";

vi.mock("./get-client.js");
vi.mock("../actions/get-accounts.js");

afterEach(() => {
  vi.clearAllMocks();
});

it("fetches wallets", async () => {
  const wallet = new MockWallet();

  whenAccountsChanged(defineConfig({ chains: {}, wallets: [wallet] }));

  expect(getAccounts).toHaveBeenCalledWith(
    expect.any(Observable),
    undefined,
    undefined,
    undefined,
  );

  expect(
    lastValueFrom(toObservable(vi.mocked(getAccounts).mock.calls[0]![0])),
  ).resolves.toEqual([wallet]);
});

it("fetches wallets with chain-spec", () => {
  vi.mocked(getClient).mockResolvedValue({
    getChainSpecData: vi.fn().mockResolvedValue({
      name: "Polkadot",
      genesisHash: "0x",
      properties: {},
    }),
  } as Partial<PolkadotClient> as PolkadotClient);

  const wallet = new MockWallet();

  whenAccountsChanged(
    defineConfig({ chains: { test: {} as never }, wallets: [wallet] }),
    { chainId: "test" },
  );

  expect(getAccounts).toHaveBeenCalledWith(
    expect.any(Observable),
    expect.any(Observable),
    undefined,
    undefined,
  );

  expect(
    lastValueFrom(toObservable(vi.mocked(getAccounts).mock.calls[0]![1])),
  ).resolves.toEqual({
    name: "Polkadot",
    genesisHash: "0x",
    properties: {},
  });
});

it("uses the provided chainSpec when supplied", async () => {
  const wallet = new MockWallet();
  const chainSpec = {
    name: "Custom",
    genesisHash: "0x123",
    properties: { ss58Format: 42 },
  } as ChainSpecData;

  whenAccountsChanged(defineConfig({ chains: {}, wallets: [wallet] }), {
    chainSpec,
  });

  expect(getAccounts).toHaveBeenCalledWith(
    expect.any(Observable),
    chainSpec,
    undefined,
    undefined,
  );
});

it("fetches wallets with EVM accounts", () => {
  const wallet = new MockWallet();

  whenAccountsChanged(
    defineConfig({ chains: {}, wallets: [wallet], includeEvmAccounts: true }),
  );

  expect(getAccounts).toHaveBeenCalledWith(
    expect.any(Observable),
    undefined,
    undefined,
    { includeEvmAccounts: true },
  );
});

class MockWallet extends Wallet {
  id = "mock";

  name = "Mock";

  initialize() {
    throw new Error("Method not implemented.");
  }

  connected$ = new Observable<boolean>();

  connect() {
    throw new Error("Method not implemented.");
  }

  disconnect() {
    throw new Error("Method not implemented.");
  }

  accounts$ = new Observable<PolkadotSignerAccount[]>();
}
