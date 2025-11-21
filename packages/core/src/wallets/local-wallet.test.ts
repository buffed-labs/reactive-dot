import { Storage } from "../storage.js";
import type { MaybePromise } from "../types.js";
import type { PolkadotSignerAccount } from "./account.js";
import { LocalWallet } from "./local-wallet.js";
import type { WalletOptions } from "./wallet.js";
import { BehaviorSubject } from "rxjs";
import { beforeEach, describe, expect, it } from "vitest";

interface TestAccount extends Pick<PolkadotSignerAccount, "id"> {
  name: string;
  address: string;
}

interface TestJsonAccount {
  name: string;
  address: string;
}

class TestLocalWallet extends LocalWallet<
  TestAccount,
  TestJsonAccount,
  WalletOptions
> {
  override readonly id = "test-wallet";
  override readonly name = "Test Local Wallet";

  override readonly connected$ = new BehaviorSubject(false);
  override connect(): MaybePromise<void> {
    throw new Error("Method not implemented.");
  }

  override disconnect(): MaybePromise<void> {
    throw new Error("Method not implemented.");
  }

  override readonly accounts$ = new BehaviorSubject([]);

  protected accountId(account: Omit<TestAccount, "id">) {
    return account.address;
  }

  protected accountToJson(account: Omit<TestAccount, "id">): TestJsonAccount {
    return { name: account.name, address: account.address };
  }

  protected accountFromJson(jsonAccount: TestJsonAccount): TestAccount {
    return { id: jsonAccount.address, ...jsonAccount };
  }
}

let wallet: TestLocalWallet;
let mockStorage = new Map<string, string>();
const storage = new Storage({
  prefix: "test",
  storage: {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
  },
});

beforeEach(() => {
  mockStorage = new Map();
  wallet = new TestLocalWallet({
    storage,
  });
});

describe("initialize", () => {
  it("initializes with empty accounts when storage is empty", () => {
    wallet.initialize();
    expect(wallet.accountStore.values()).toEqual([]);
  });

  it("loads accounts from storage", async () => {
    const accounts = [
      { name: "Alice", address: "0x123" },
      { name: "Bob", address: "0x456" },
    ];
    mockStorage.set(
      "test/wallet/test-wallet/accounts",
      JSON.stringify(accounts),
    );

    wallet.initialize();

    const values = Array.from(wallet.accountStore.values());
    expect(values).toHaveLength(2);
    expect(values[0]).toEqual({
      id: "0x123",
      name: "Alice",
      address: "0x123",
    });
    expect(values[1]).toEqual({ id: "0x456", name: "Bob", address: "0x456" });
  });
});

describe("accountStore.add", () => {
  beforeEach(() => {
    wallet.initialize();
  });

  it("adds a new account", async () => {
    const account: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    await wallet.accountStore.add(account);

    expect(wallet.accountStore.has("0x123")).toBe(true);
    expect(Array.from(wallet.accountStore.values())).toContainEqual({
      ...account,
      id: "0x123",
    });
  });

  it("replaces existing account with same id", async () => {
    const account1: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    const account2: Omit<TestAccount, "id"> = {
      name: "Alice Updated",
      address: "0x123",
    };

    await wallet.accountStore.add(account1);
    await wallet.accountStore.add(account2);

    const values = Array.from(wallet.accountStore.values());
    expect(values).toHaveLength(1);
    expect(values[0]!.name).toBe("Alice Updated");
  });

  it("persists accounts to storage", async () => {
    const account: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    await wallet.accountStore.add(account);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const stored = mockStorage.get("test/wallet/test-wallet/accounts");
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!)).toEqual([{ name: "Alice", address: "0x123" }]);
  });
});

describe("accountStore.delete", () => {
  beforeEach(() => {
    wallet.initialize();
  });

  it("deletes account by id string", async () => {
    const account: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    await wallet.accountStore.add(account);
    await wallet.accountStore.delete("0x123");

    expect(wallet.accountStore.has("0x123")).toBe(false);
  });

  it("deletes account by object with id", async () => {
    const account: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    await wallet.accountStore.add(account);
    await wallet.accountStore.delete({ id: "0x123" });

    expect(wallet.accountStore.has("0x123")).toBe(false);
  });
});

describe("accountStore.clear", () => {
  it("removes all accounts", async () => {
    wallet.initialize();
    await wallet.accountStore.add({
      name: "Alice",
      address: "0x123",
    });
    await wallet.accountStore.add({
      name: "Bob",
      address: "0x456",
    });

    await wallet.accountStore.clear();

    expect(Array.from(wallet.accountStore.values())).toHaveLength(0);
  });
});

describe("accountStore.has", () => {
  beforeEach(() => {
    wallet.initialize();
  });

  it("returns true for existing account id string", async () => {
    const account: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    await wallet.accountStore.add(account);

    expect(wallet.accountStore.has("0x123")).toBe(true);
  });

  it("returns true for existing account object", async () => {
    const account: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    await wallet.accountStore.add(account);

    expect(wallet.accountStore.has({ id: "0x123" })).toBe(true);
  });

  it("returns false for non-existent account", () => {
    expect(wallet.accountStore.has("0x999")).toBe(false);
  });
});

describe("accountStore.values", () => {
  it("returns all accounts", async () => {
    wallet.initialize();
    const account1: Omit<TestAccount, "id"> = {
      name: "Alice",
      address: "0x123",
    };
    const account2: Omit<TestAccount, "id"> = {
      name: "Bob",
      address: "0x456",
    };

    await wallet.accountStore.add(account1);
    await wallet.accountStore.add(account2);

    const values = Array.from(Array.from(wallet.accountStore.values()));
    expect(values).toHaveLength(2);
    expect(values).toContainEqual({ ...account1, id: "0x123" });
    expect(values).toContainEqual({ ...account2, id: "0x456" });
  });
});
