import { Binary, getSs58AddressInfo } from "@polkadot-api/substrate-bindings";
import { BaseError } from "@reactive-dot/core";
import {
  LocalWallet,
  type PolkadotSignerAccount,
} from "@reactive-dot/core/wallets.js";
import { map } from "rxjs";

type ReadonlyAccount = {
  id: string;
  publicKey: Uint8Array;
  name?: string;
};

type JsonReadonlyAccount = {
  publicKey: `0x${string}`;
  name?: string;
};

export class ReadonlyWallet extends LocalWallet<
  ReadonlyAccount,
  JsonReadonlyAccount
> {
  override readonly id = "readonly";

  override readonly name = "Readonly Wallet";

  override readonly accounts$ = this.localAccounts$.pipe(
    map((accounts) =>
      accounts.map(
        ({ publicKey, ...account }): PolkadotSignerAccount => ({
          ...account,
          polkadotSigner: undefined,
        }),
      ),
    ),
  );

  protected override accountToJson(
    account: Omit<ReadonlyAccount, "id">,
  ): JsonReadonlyAccount {
    return {
      ...account,
      publicKey: Binary.fromBytes(account.publicKey).asHex(),
    };
  }

  protected override accountFromJson(
    jsonAccount: JsonReadonlyAccount,
  ): ReadonlyAccount {
    return {
      ...jsonAccount,
      id: jsonAccount.publicKey,
      publicKey: Binary.fromHex(jsonAccount.publicKey).asBytes(),
    };
  }

  override readonly connected$ = this.accounts$.pipe(
    map((accounts) => accounts.length > 0),
  );

  connect() {
    const input = globalThis.prompt("Enter account address");

    if (!input) {
      throw new BaseError("No address provided");
    }

    const address = getSs58AddressInfo(input);

    if (address.isValid === false) {
      throw new BaseError("Invalid address");
    }

    this.accountStore.add({
      id: Binary.fromBytes(address.publicKey).asHex(),
      publicKey: address.publicKey,
    });
  }

  disconnect() {
    this.accountStore.clear();
  }
}
