import type { Wallet } from "../wallets/wallet.js";

const initializedWallets = new WeakSet<Wallet>();

export function initializeWallets(wallets: Wallet[]) {
  return Promise.all(
    wallets.map(async (wallet) => {
      if (!initializedWallets.has(wallet)) {
        try {
          initializedWallets.add(wallet);
          await wallet.initialize();
        } catch (error: unknown) {
          initializedWallets.delete(wallet);
          throw error;
        }
      }
    }),
  );
}
