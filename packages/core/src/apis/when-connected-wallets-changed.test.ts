import { getConnectedWallets } from "../actions/get-connected-wallets.js";
import type { Config } from "../config.js";
import { whenConnectedWalletsChanged } from "./when-connected-wallets-changed.js";
import { whenWalletsChanged } from "./when-wallets-changed.js";
import { firstValueFrom, Observable, of } from "rxjs";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("./when-wallets-changed.js", () => ({
  whenWalletsChanged: vi.fn(),
}));

vi.mock("../actions/get-connected-wallets.js", () => ({
  getConnectedWallets: vi.fn(),
}));

const config = {} as Config;

beforeEach(() => {
  vi.clearAllMocks();
});

it("subscribes to whenWalletsChanged with provided config", () => {
  vi.mocked(whenWalletsChanged).mockReturnValue(
    new Observable(() => {
      /* no-op */
    }),
  );

  whenConnectedWalletsChanged(config);

  expect(whenWalletsChanged).toHaveBeenCalledWith(config);
});

it("emits connected wallets returned by getConnectedWallets", async () => {
  const wallets = [{ id: "wallet-1" }] as never;
  const connectedWallets = [{ id: "wallet-1", connected: true }];

  vi.mocked(whenWalletsChanged).mockReturnValue(
    new Observable((subscriber) => {
      subscriber.next(wallets);
    }),
  );

  vi.mocked(getConnectedWallets).mockReturnValue(of(connectedWallets) as never);

  const result = await firstValueFrom(whenConnectedWalletsChanged(config));

  expect(getConnectedWallets).toHaveBeenCalledWith(wallets);
  expect(result).toEqual(connectedWallets);
});
