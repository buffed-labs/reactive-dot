import { aggregateWallets } from "../actions/aggregate-wallets.js";
import type { Config } from "../config.js";
import { whenWalletsChanged } from "./when-wallets-changed.js";
import { of } from "rxjs";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("../actions/aggregate-wallets.js", () => ({
  aggregateWallets: vi.fn(),
}));

const aggregateWalletsMock = vi.mocked(aggregateWallets);
const createConfig = (wallets?: Config["wallets"]) => ({ wallets }) as Config;

beforeEach(() => {
  vi.clearAllMocks();
});

it("defers aggregateWallets until subscribing", () => {
  aggregateWalletsMock.mockReturnValue(of([]) as never);
  const config = createConfig([{ id: "alpha" } as never]);

  const observable = whenWalletsChanged(config);
  expect(aggregateWalletsMock).not.toHaveBeenCalled();

  const subscription = observable.subscribe();
  subscription.unsubscribe();

  expect(aggregateWalletsMock).toHaveBeenCalledTimes(1);
  expect(aggregateWalletsMock).toHaveBeenCalledWith(config.wallets);
});

it("passes an empty array when wallets config is missing", () => {
  aggregateWalletsMock.mockReturnValue(of([]) as never);

  const subscription = whenWalletsChanged(createConfig()).subscribe();
  subscription.unsubscribe();

  expect(aggregateWalletsMock).toHaveBeenCalledWith([]);
});

it("re-invokes aggregateWallets for each subscription", () => {
  aggregateWalletsMock.mockReturnValue(of([]) as never);
  const config = createConfig([]);

  const observable = whenWalletsChanged(config);
  const sub1 = observable.subscribe();
  const sub2 = observable.subscribe();
  sub1.unsubscribe();
  sub2.unsubscribe();

  expect(aggregateWalletsMock).toHaveBeenCalledTimes(2);
});
