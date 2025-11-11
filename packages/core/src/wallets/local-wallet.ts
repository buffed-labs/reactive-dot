import type { MaybePromise } from "../types.js";
import type { PolkadotSignerAccount } from "./account.js";
import { Wallet, type WalletOptions } from "./wallet.js";
import { BehaviorSubject, skip, type Subscription } from "rxjs";

type AccountStore<T extends Pick<PolkadotSignerAccount, "id">> = {
  add(account: T): MaybePromise<void>;
  clear(): MaybePromise<void>;
  delete(account: { id: T["id"] }): MaybePromise<void>;
  delete(accountId: T["id"]): MaybePromise<void>;
  has(account: { id: T["id"] }): MaybePromise<boolean>;
  has(accountId: T["id"]): MaybePromise<boolean>;
  values(): Iterable<T> | AsyncIterable<T>;
};

const finalizationRegistry = new FinalizationRegistry(
  (subscription: Subscription) => subscription.unsubscribe(),
);

/**
 * @experimental
 */
export abstract class LocalWallet<
  TAccount extends Pick<PolkadotSignerAccount, "id">,
  TJsonAccount = unknown,
  TOptions extends WalletOptions = WalletOptions,
  TStorageKey extends string = string,
> extends Wallet<TOptions, "accounts" | TStorageKey> {
  protected abstract accountToJson(account: Omit<TAccount, "id">): TJsonAccount;

  protected abstract accountFromJson(jsonAccount: TJsonAccount): TAccount;

  protected localAccounts$: BehaviorSubject<TAccount[]> = new BehaviorSubject<
    TAccount[]
  >([]);

  constructor(options?: TOptions) {
    super(options);

    finalizationRegistry.register(
      this,
      this.localAccounts$
        .pipe(skip(1))
        .subscribe((accounts) =>
          this.storage.setItem(
            "accounts",
            JSON.stringify(
              accounts.map(({ id, ...account }) => this.accountToJson(account)),
            ),
          ),
        ),
    );
  }

  initialize() {
    this.localAccounts$.next(
      JSON.parse(this.storage.getItem("accounts") ?? JSON.stringify([])).map(
        (rawAccount: TJsonAccount) => this.accountFromJson(rawAccount),
      ),
    );
  }

  /**
   * @experimental
   */
  accountStore: AccountStore<TAccount> = {
    add: (account: TAccount) => {
      this.localAccounts$.next(
        this.localAccounts$.value
          .filter((storedAccount) => storedAccount.id !== account.id)
          .concat([account]),
      );
    },
    clear: () => {
      this.localAccounts$.next([]);
    },
    delete: (identifiable: string | { id: string }) => {
      const id =
        typeof identifiable === "string" ? identifiable : identifiable.id;

      this.localAccounts$.next(
        this.localAccounts$.value.filter(
          (storedAccount) => storedAccount.id !== id,
        ),
      );
    },
    has: (identifiable: string | { id: string }) => {
      const id =
        typeof identifiable === "string" ? identifiable : identifiable.id;

      return this.localAccounts$.value.some((account) => account.id === id);
    },
    values: () => this.localAccounts$.value,
  };
}
