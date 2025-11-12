import {
  createQrMessage,
  createQrTransaction,
  vaultQrEncryption,
} from "./vendor.js";
import { createV4Tx } from "@polkadot-api/signers-common";
import {
  Binary,
  decAnyMetadata,
  getSs58AddressInfo,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";
import { mergeUint8 } from "@polkadot-api/utils";
import { BaseError } from "@reactive-dot/core";
import {
  LocalWallet,
  type PolkadotSignerAccount,
} from "@reactive-dot/core/wallets.js";
import { BehaviorSubject, map } from "rxjs";

type BaseVaultRequest<TType extends string, TData = void> = TData extends void
  ? { type: TType }
  : { type: TType; data: TData };

type VaultRequestPayload =
  | BaseVaultRequest<"account">
  | BaseVaultRequest<"signature", Uint8Array>;

export type VaultRequest = VaultRequestPayload & {
  response: PromiseWithResolvers<string>;
};

type VaultAccount = {
  id: string;
  publicKey: Uint8Array;
  genesisHash: `0x${string}`;
  name?: string;
};

type JsonVaultAccount = {
  publicKey: `0x${string}`;
  genesisHash: `0x${string}`;
  name?: string;
};

export class PolkadotVaultWallet extends LocalWallet<
  VaultAccount,
  JsonVaultAccount
> {
  override readonly id = "polkadot-vault";

  override readonly name = "Polkadot Vault";

  protected override accountToJson(account: Omit<VaultAccount, "id">) {
    return {
      ...account,
      publicKey: Binary.fromBytes(account.publicKey).asHex(),
    };
  }

  protected override accountFromJson(data: JsonVaultAccount) {
    return {
      ...data,
      publicKey: Binary.fromHex(data.publicKey).asBytes(),
      id: [data.genesisHash, data.publicKey].join(),
    };
  }

  override async connect() {
    return this.accountStore.add(await this.getNewAccount());
  }

  override disconnect() {
    return this.accountStore.clear();
  }

  readonly #request$ = new BehaviorSubject<VaultRequest | undefined>(undefined);

  readonly request$ = this.#request$.asObservable();

  #request(request: VaultRequestPayload) {
    this.#request$.value?.response.reject(new BaseError("Cancelled"));
    const response = Promise.withResolvers<string>();
    this.#request$.next({ ...request, response });

    return response.promise.finally(() => {
      if (this.#request$.value?.response === response) {
        this.#request$.next(undefined);
      }
    });
  }

  async getNewAccount() {
    const response = await this.#request({ type: "account" });

    const split = response.split(":") as [
      type: string,
      address: string,
      genesisHash: `0x${string}`,
    ];

    if (
      split[0] !== "substrate" ||
      split.length != 3 ||
      !split[2]!.startsWith("0x")
    ) {
      throw new BaseError("Invalid response");
    }

    const [, address, genesisHash] = split;
    const account = getSs58AddressInfo(address);

    if (!account.isValid) {
      throw new BaseError("Invalid response");
    }

    return {
      id: [genesisHash, Binary.fromBytes(account.publicKey).asHex()].join(),
      publicKey: account.publicKey,
      genesisHash,
    } as VaultAccount;
  }

  async #requestSignature(data: Uint8Array) {
    return Binary.fromHex(
      await this.#request({ type: "signature", data }),
    ).asBytes();
  }

  override readonly accounts$ = this.localAccounts$.pipe(
    map((accounts) =>
      accounts.map(
        ({ id, name, genesisHash, publicKey }) =>
          ({
            id,
            polkadotSigner: {
              publicKey,
              ...(name === undefined ? {} : { name }),
              signBytes: async (data) => {
                const qrPayload = createQrMessage(
                  vaultQrEncryption.sr25519,
                  publicKey,
                  mergeUint8([
                    Binary.fromText("<Bytes>").asBytes(),
                    data,
                    Binary.fromText("</Bytes>").asBytes(),
                  ]),
                  Binary.fromHex(genesisHash).asBytes(),
                );

                return this.#requestSignature(qrPayload);
              },
              signTx: async (callData, signedExtensions, metadata) => {
                const decMeta = unifyMetadata(decAnyMetadata(metadata));
                const extra: Array<Uint8Array> = [];
                const additionalSigned: Array<Uint8Array> = [];
                decMeta.extrinsic.signedExtensions.map(({ identifier }) => {
                  const signedExtension = signedExtensions[identifier];
                  if (!signedExtension)
                    throw new BaseError(
                      `Missing ${identifier} signed extension`,
                    );
                  extra.push(signedExtension.value);
                  additionalSigned.push(signedExtension.additionalSigned);
                });
                const extensions = mergeUint8([...extra, ...additionalSigned]);

                const genesisBytes =
                  signedExtensions["CheckGenesis"]?.additionalSigned ??
                  Binary.fromHex(genesisHash).asBytes();

                const qrPayload = createQrTransaction(
                  vaultQrEncryption.sr25519,
                  publicKey,
                  callData,
                  extensions,
                  genesisBytes,
                );

                const signature = await this.#requestSignature(qrPayload);

                const tx = createV4Tx(
                  decMeta,
                  publicKey,
                  // Remove encryption code, we already know it
                  signature.slice(1),
                  extra,
                  callData,
                  // TODO schema?
                  "Sr25519",
                );

                return tx;
              },
            },
          }) satisfies PolkadotSignerAccount,
      ),
    ),
  );

  override readonly connected$ = this.accounts$.pipe(
    map((accounts) => accounts.length > 0),
  );
}
