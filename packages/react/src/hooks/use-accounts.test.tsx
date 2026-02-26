import { ChainProvider } from "../contexts/chain.js";
import { ReactiveDotProvider } from "../contexts/provider.js";
import { useAccounts } from "./use-accounts.js";
import type { ChainSpecData } from "@polkadot-api/substrate-client";
import { defineConfig } from "@reactive-dot/core";
import * as internals from "@reactive-dot/core/internal/actions.js";
import { MockWallet } from "@reactive-dot/test";
import { act, renderHook } from "@testing-library/react";
import type { PolkadotSigner } from "polkadot-api";
import { Suspense } from "react";
import { beforeEach, expect, it, vi } from "vitest";

const getAccounts = vi.spyOn(internals, "getAccounts");

beforeEach(() => {
  vi.clearAllMocks();
});

it("returns accounts from connected wallets", async () => {
  const wallets = [
    new MockWallet(
      [
        {
          id: "1",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
        {
          id: "2",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
      ],
      true,
    ),
    new MockWallet(
      [
        {
          id: "3",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
        {
          id: "4",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
      ],
      true,
    ),
  ];

  const config = defineConfig({ chains: {}, wallets });

  const { result } = await act(() =>
    renderHook(() => useAccounts(), {
      wrapper: ({ children }) => (
        <ReactiveDotProvider config={config}>
          <Suspense>{children}</Suspense>
        </ReactiveDotProvider>
      ),
    }),
  );

  expect(result.current).toEqual([
    expect.objectContaining({ id: "1" }),
    expect.objectContaining({ id: "2" }),
    expect.objectContaining({ id: "3" }),
    expect.objectContaining({ id: "4" }),
  ]);
});

it("ignores context chainId when chainId is null", async () => {
  const wallets = [
    new MockWallet(
      [
        {
          id: "1",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
        {
          id: "2",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
      ],
      true,
    ),
  ];

  const config = defineConfig({ chains: {}, wallets });

  await act(() =>
    renderHook(() => useAccounts({ chainId: null }), {
      wrapper: ({ children }) => (
        <ReactiveDotProvider config={config}>
          <ChainProvider chainId="polkadot">
            <Suspense>{children}</Suspense>
          </ChainProvider>
        </ReactiveDotProvider>
      ),
    }),
  );

  expect(getAccounts).toHaveBeenCalledWith(
    expect.anything(),
    undefined,
    undefined,
    undefined,
  );
});

it("uses chainSpec when provided", async () => {
  const wallets = [
    new MockWallet(
      [
        {
          id: "1",
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
      ],
      true,
    ),
  ];

  const config = defineConfig({ chains: {}, wallets });
  const chainSpec = {
    name: "Custom Chain",
    properties: { ss58Format: 42 },
    genesisHash: "0x00",
  } as ChainSpecData;

  await act(() =>
    renderHook(() => useAccounts({ chainSpec: chainSpec }), {
      wrapper: ({ children }) => (
        <ReactiveDotProvider config={config}>
          <Suspense>{children}</Suspense>
        </ReactiveDotProvider>
      ),
    }),
  );

  expect(getAccounts).toHaveBeenCalledWith(
    expect.anything(),
    chainSpec,
    undefined,
    undefined,
  );
});
