import type { Address } from "../address.js";
import type { Wallet } from "./wallet.js";
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";

export type PolkadotSignerAccount = {
  id: string;
  polkadotSigner:
    | InjectedPolkadotAccount["polkadotSigner"]
    /**
     * @experimental Questionable hack for Ledger. Do not use, may change without warning.
     */
    | ((networkInfo: {
        tokenSymbol: string;
        tokenDecimals: number;
      }) => InjectedPolkadotAccount["polkadotSigner"])
    | undefined;
  name?: string;
  genesisHash?: InjectedPolkadotAccount["genesisHash"];
};

export type PolkadotAccount = Omit<PolkadotSignerAccount, "polkadotSigner"> & {
  polkadotSigner: InjectedPolkadotAccount["polkadotSigner"];
  address: Address;
};

export type WalletAccount = PolkadotAccount & {
  wallet: Wallet;
};
