import type { PolkadotSignerAccount } from "./account.js";
import { Wallet, type WalletOptions } from "./wallet.js";

/**
 * @experimental
 */
export abstract class LocalWallet<
  TAccount extends Pick<PolkadotSignerAccount, "id">,
  TOptions extends WalletOptions,
  TStorageKey extends string,
> extends Wallet<TOptions, TStorageKey> {
  /**
   * @experimental
   */
  abstract accountStore: {
    add(account: TAccount): void | Promise<void>;
    clear(): void | Promise<void>;
    delete(account: { id: TAccount["id"] }): void | Promise<void>;
    delete(accountId: TAccount["id"]): void | Promise<void>;
    has(account: { id: TAccount["id"] }): boolean | Promise<boolean>;
    has(accountId: TAccount["id"]): boolean | Promise<boolean>;
    values(): Iterable<TAccount>;
  };
}
