import { AccountMismatchError } from "./errors.js";
import type { LedgerSigner } from "@polkadot-api/ledger-signer";
import { Binary } from "@polkadot-api/substrate-bindings";
import {
  LocalWallet,
  type PolkadotSignerAccount,
} from "@reactive-dot/core/wallets.js";
import { map } from "rxjs";

type LedgerAccount = {
  id: string;
  publicKey: Uint8Array;
  name?: string;
  path: number;
};

type JsonLedgerAccount = Omit<LedgerAccount, "publicKey" | "id"> & {
  publicKey: `0x${string}`;
};

export class LedgerWallet extends LocalWallet<
  LedgerAccount,
  JsonLedgerAccount
> {
  readonly id = "ledger";

  readonly name = "Ledger";

  readonly accounts$ = this.localAccounts$.pipe(
    map((accounts) =>
      accounts
        .toSorted((a, b) => a.path - b.path)
        .map(
          (account): PolkadotSignerAccount => ({
            id: account.id,
            ...(account.name === undefined ? {} : { name: account.name }),
            polkadotSigner: ({ tokenSymbol, tokenDecimals }) => ({
              publicKey: account.publicKey,
              signTx: async (...args) => {
                await this.#assertMatchingAccount(account);

                const ledgerSigner = await this.#getOrCreateLedgerSigner();
                const polkadotSigner = await ledgerSigner.getPolkadotSigner(
                  { tokenSymbol, decimals: tokenDecimals },
                  account.path,
                );

                return polkadotSigner.signTx(...args);
              },
              signBytes: async (...args) => {
                await this.#assertMatchingAccount(account);

                const ledgerSigner = await this.#getOrCreateLedgerSigner();
                const polkadotSigner = await ledgerSigner.getPolkadotSigner(
                  { tokenSymbol, decimals: tokenDecimals },
                  account.path,
                );

                return polkadotSigner.signBytes(...args);
              },
            }),
          }),
        ),
    ),
  );

  readonly connected$ = this.accounts$.pipe(
    map((accounts) => accounts.length > 0),
  );

  #ledgerSigner?: LedgerSigner;

  override accountToJson(account: Omit<LedgerAccount, "id">) {
    return {
      ...account,
      publicKey: Binary.fromBytes(account.publicKey).asHex(),
    };
  }

  protected override accountId(account: Omit<LedgerAccount, "id">) {
    return Binary.fromBytes(account.publicKey).asHex();
  }

  override accountFromJson(data: JsonLedgerAccount) {
    return {
      ...data,
      publicKey: Binary.fromHex(data.publicKey).asBytes(),
    };
  }

  async connect() {
    this.accountStore.add(await this.getConnectedAccount());
  }

  disconnect() {
    this.accountStore.clear();
  }

  /**
   * @experimental
   * @param path - The primary derivation index
   * @returns The connected Ledger's account
   */
  async getConnectedAccount(path = 0) {
    const ledgerSigner = await this.#getOrCreateLedgerSigner();
    const publicKey = await ledgerSigner.getPubkey(path);

    return {
      publicKey,
      path,
    } as LedgerAccount;
  }

  async #assertMatchingAccount(account: LedgerAccount) {
    const ledgerSigner = await this.#getOrCreateLedgerSigner();
    const publicKey = await ledgerSigner.getPubkey(account.path);

    if (
      Binary.fromBytes(account.publicKey).asHex() !==
      Binary.fromBytes(publicKey).asHex()
    ) {
      throw new AccountMismatchError();
    }
  }

  async #getOrCreateLedgerSigner() {
    if (this.#ledgerSigner !== undefined) {
      return this.#ledgerSigner;
    }

    if (!("Buffer" in globalThis)) {
      const {
        default: { Buffer },
      } = await import("buffer/");

      // @ts-expect-error polyfill types mismatch
      globalThis.Buffer = Buffer;
    }

    const [{ default: TransportWebUSB }, { LedgerSigner }] = await Promise.all([
      import("@ledgerhq/hw-transport-webusb"),
      import("@polkadot-api/ledger-signer"),
    ]);

    return (this.#ledgerSigner = new LedgerSigner(
      // @ts-expect-error Weird bug with Ledger
      await TransportWebUSB.create(),
    ));
  }
}
