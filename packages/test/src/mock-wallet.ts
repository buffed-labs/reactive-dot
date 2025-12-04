import {
  type PolkadotSignerAccount,
  Wallet,
} from "@reactive-dot/core/wallets.js";
import { BehaviorSubject, delay, map } from "rxjs";

export class MockWallet extends Wallet {
  readonly id = "mock";

  readonly name = "Mock wallet";

  readonly initialized$ = new BehaviorSubject(false);

  readonly connected$ = new BehaviorSubject(false);

  #delay = 0;

  readonly accounts$ = this.connected$.pipe(
    delay(this.#delay),
    map((connected) => (connected ? this.accounts : [])),
  );

  constructor(
    readonly accounts: PolkadotSignerAccount[],
    connected = false,
    delay = 0,
  ) {
    super();
    this.connected$.next(connected);
    this.#delay = delay;
  }

  initialize() {
    this.initialized$.next(true);
  }

  connect() {
    this.connected$.next(true);
  }

  disconnect() {
    this.connected$.next(false);
  }
}
