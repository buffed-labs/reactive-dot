import { ChainProvider } from "../contexts/chain.js";
import { ReactiveDotProvider } from "../contexts/provider.js";
import { useAccounts } from "./use-accounts.js";
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
          polkadotSigner: { publicKey: new Uint8Array([1]) } as PolkadotSigner,
        },
        {
          polkadotSigner: { publicKey: new Uint8Array([2]) } as PolkadotSigner,
        },
      ],
      true,
    ),
    new MockWallet(
      [
        {
          polkadotSigner: { publicKey: new Uint8Array([3]) } as PolkadotSigner,
        },
        {
          polkadotSigner: { publicKey: new Uint8Array([4]) } as PolkadotSigner,
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
    expect.objectContaining({
      polkadotSigner: { publicKey: new Uint8Array([1]) },
    }),
    expect.objectContaining({
      polkadotSigner: { publicKey: new Uint8Array([2]) },
    }),
    expect.objectContaining({
      polkadotSigner: { publicKey: new Uint8Array([3]) },
    }),
    expect.objectContaining({
      polkadotSigner: { publicKey: new Uint8Array([4]) },
    }),
  ]);
});

it("ignores context chainId when chainId is null", async () => {
  const wallets = [
    new MockWallet(
      [
        {
          polkadotSigner: { publicKey: new Uint8Array() } as PolkadotSigner,
        },
        {
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
