import { PolkadotVaultWallet } from "./polkadot-vault-wallet.js";
import { AccountId, Binary } from "@polkadot-api/substrate-bindings";
import { BaseError } from "@reactive-dot/core";
import type { PolkadotSigner } from "polkadot-api";
import { firstValueFrom } from "rxjs";
import { beforeEach, describe, expect, it, test, vi } from "vitest";

vi.mock("./vendor.js", () => ({
  createQrMessage: vi.fn(() => new Uint8Array([1, 2, 3])),
  createQrTransaction: vi.fn(() => new Uint8Array([4, 5, 6])),
  vaultQrEncryption: { sr25519: "sr25519" },
}));

vi.mock("@polkadot-api/signers-common", () => ({
  createV4Tx: vi.fn(() => new Uint8Array([7, 8, 9])),
}));

let wallet: PolkadotVaultWallet;

beforeEach(() => {
  wallet = new PolkadotVaultWallet();
});

describe("basic properties", () => {
  it("has correct id", () => {
    expect(wallet.id).toBe("polkadot-vault");
  });

  it("has correct name", () => {
    expect(wallet.name).toBe("Polkadot Vault");
  });
});

describe("getNewAccount", () => {
  it("parses valid vault response", async () => {
    const response =
      "substrate:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY:0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3";

    const promise = wallet.getNewAccount();

    const request = await firstValueFrom(wallet.request$);
    request?.response.resolve(response);

    const account = await promise;

    expect(account.genesisHash).toBe(
      "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
    );
    expect(Binary.fromBytes(account.publicKey).asHex()).toBe(
      Binary.fromBytes(
        AccountId().enc("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"),
      ).asHex(),
    );
  });

  it("throws error for invalid response type", async () => {
    const response = "invalid:address:0x123";

    const promise = wallet.getNewAccount();

    const request = await firstValueFrom(wallet.request$);
    request?.response.resolve(response);

    await expect(promise).rejects.toThrow(BaseError);
  });

  it("throws error for invalid response format", async () => {
    const response = "substrate:address";

    const promise = wallet.getNewAccount();

    const request = await firstValueFrom(wallet.request$);
    request?.response.resolve(response);

    await expect(promise).rejects.toThrow(BaseError);
  });

  it("throws error for invalid genesis hash", async () => {
    const response =
      "substrate:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY:invalidhash";

    const promise = wallet.getNewAccount();

    const request = await firstValueFrom(wallet.request$);
    request?.response.resolve(response);

    await expect(promise).rejects.toThrow(BaseError);
  });
});

describe("connect", () => {
  it("adds account from vault response", async () => {
    const response =
      "substrate:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY:0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3";

    const promise = wallet.connect();

    const request = await firstValueFrom(wallet.request$);
    request?.response.resolve(response);

    await promise;

    const accounts = await firstValueFrom(wallet.accounts$);
    expect(accounts).toHaveLength(1);
  });
});

describe("disconnect", () => {
  it("clears all accounts", async () => {
    await wallet.disconnect();

    const accounts = await firstValueFrom(wallet.accounts$);
    expect(accounts).toHaveLength(0);
  });
});

describe("request cancellation", () => {
  it("cancels previous request when new request is made", async () => {
    const promise1 = wallet.getNewAccount();
    wallet.getNewAccount();

    await expect(promise1).rejects.toThrow(BaseError);
  });
});

describe("connected$", () => {
  it("is false when no accounts", async () => {
    const connected = await firstValueFrom(wallet.connected$);
    expect(connected).toBe(false);
  });
});

describe("signing requests", () => {
  test("sign bytes", async () => {
    const accountPromise = wallet.getNewAccount();

    const request = await firstValueFrom(wallet.request$);
    request?.response.resolve(
      "substrate:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY:0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
    );

    wallet.accountStore.add(await accountPromise);

    const account = (await wallet.getAccounts())[0];
    expect(account).toBeDefined();

    const signer = account!.polkadotSigner as PolkadotSigner;
    const signedBytesPromise = signer.signBytes(new Uint8Array([10, 11, 12]));
    const signRequest = await firstValueFrom(wallet.request$);

    expect(signRequest).toBeDefined();
    expect(signRequest?.type).toBe("signature");

    signRequest!.response.resolve(Binary.fromHex("0x0a0b0c").asHex());

    const signedBytes = await signedBytesPromise;

    expect(Binary.fromBytes(signedBytes).asHex()).toBe("0x0a0b0c");
  });

  test.todo("sign transaction");
});
