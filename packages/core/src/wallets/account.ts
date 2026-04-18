import type { Address } from "../address.js";
import type { Wallet } from "./wallet.js";
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";

type PolkadotSignerAccountBase =
  | { publicKey: Uint8Array; polkadotSigner: undefined }
  | {
      polkadotSigner:
        | InjectedPolkadotAccount["polkadotSigner"]
        /**
         * @experimental Questionable hack for Ledger. Do not use, may change without warning.
         */
        | ((networkInfo: {
            tokenSymbol: string;
            tokenDecimals: number;
          }) => InjectedPolkadotAccount["polkadotSigner"]);
    };

export type PolkadotSignerAccount = PolkadotSignerAccountBase & {
  id: string;
  name?: string;
  genesisHash?: InjectedPolkadotAccount["genesisHash"];
};

export interface PolkadotAccount extends Omit<PolkadotSignerAccount, "polkadotSigner"> {
  polkadotSigner: InjectedPolkadotAccount["polkadotSigner"] | undefined;
  address: Address;
}

export interface WalletAccount extends PolkadotAccount {
  wallet: Wallet;
}
