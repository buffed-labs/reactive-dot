import { Wallet, type WalletOptions } from "./wallet.js";
import { BehaviorSubject, skip, type Subscription } from "rxjs";

type AccountStore<T> = {
  add(account: T): void;
  clear(): void;
  delete(account: T): void;
  has(account: T): boolean;
  values(): Iterable<T>;
};

const finalizationRegistry = new FinalizationRegistry(
  (subscription: Subscription) => subscription.unsubscribe(),
);

/**
 * @experimental
 */
export abstract class LocalWallet<
  TAccount,
  TJsonAccount = TAccount,
  TOptions extends WalletOptions = WalletOptions,
  TStorageKey extends string = string,
> extends Wallet<TOptions, "accounts" | TStorageKey> {
  protected abstract accountToJson(account: Omit<TAccount, "id">): TJsonAccount;

  protected abstract accountFromJson(jsonAccount: TJsonAccount): TAccount;

  protected abstract isAccountEqual(
    accountA: TAccount,
    accountB: TAccount,
  ): boolean;

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
              accounts.map((account) => this.accountToJson(account)),
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
    add: (account: TAccount) =>
      this.localAccounts$.next(
        this.localAccounts$.value
          .filter(
            (storedAccount) => !this.isAccountEqual(storedAccount, account),
          )
          .concat([account]),
      ),
    clear: () => this.localAccounts$.next([]),
    delete: (account: TAccount) =>
      this.localAccounts$.next(
        this.localAccounts$.value.filter(
          (storedAccount) => !this.isAccountEqual(storedAccount, account),
        ),
      ),
    has: (account: TAccount) =>
      this.localAccounts$.value.some((storedAccount) =>
        this.isAccountEqual(storedAccount, account),
      ),
    values: () => this.localAccounts$.value,
  };
}
