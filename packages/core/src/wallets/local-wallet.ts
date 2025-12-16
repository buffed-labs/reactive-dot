import type { PolkadotSignerAccount } from "./account.js";
import { Wallet, type WalletOptions } from "./wallet.js";
import { BehaviorSubject, skip, type Subscription } from "rxjs";

type AccountStore<T extends Pick<PolkadotSignerAccount, "id">> = {
  add(account: Omit<T, "id">): void;
  clear(): void;
  delete(account: { id: T["id"] }): void;
  delete(accountId: T["id"]): void;
  has(account: { id: T["id"] }): boolean;
  has(accountId: T["id"]): boolean;
  values(): Iterable<T>;
};

const finalizationRegistry = new FinalizationRegistry(
  (subscription: Subscription) => subscription.unsubscribe(),
);

/**
 * @experimental
 */
export abstract class LocalWallet<
  TAccount extends Pick<PolkadotSignerAccount, "id"> = Pick<
    PolkadotSignerAccount,
    "id"
  >,
  TJsonAccount = TAccount,
  TOptions extends WalletOptions = WalletOptions,
  TStorageKey extends string = string,
> extends Wallet<TOptions, "accounts" | TStorageKey> {
  protected abstract accountId(
    account: Omit<TAccount, "id">,
  ): PolkadotSignerAccount["id"];

  protected abstract accountToJson(account: Omit<TAccount, "id">): TJsonAccount;

  protected abstract accountFromJson(
    jsonAccount: TJsonAccount,
  ): Omit<TAccount, "id">;

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
        (rawAccount: TJsonAccount) => {
          const account = this.accountFromJson(rawAccount);
          return { ...account, id: this.accountId(account) };
        },
      ),
    );
  }

  /**
   * @experimental
   */
  accountStore: AccountStore<TAccount> = {
    add: (account: Omit<TAccount, "id">) => {
      const id = this.accountId(account);

      this.localAccounts$.next(
        this.localAccounts$.value
          .filter((storedAccount) => storedAccount.id !== id)
          .concat([{ ...account, id } as TAccount]),
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
