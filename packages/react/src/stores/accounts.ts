import { withAtomFamilyErrorCatcher } from "../utils/jotai.js";
import { chainSpecDataAtomFamily } from "./client.js";
import { walletsAtom } from "./wallets.js";
import { getAccounts, type ChainId } from "@reactive-dot/core";
import type { Atom } from "jotai";
import { atomFamily, atomWithObservable } from "jotai/utils";
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer";

export const accountsAtom = atomFamily(
  (
    chainId: ChainId,
  ): Atom<InjectedPolkadotAccount[] | Promise<InjectedPolkadotAccount[]>> =>
    withAtomFamilyErrorCatcher(
      accountsAtom,
      chainId,
      atomWithObservable,
    )((get) =>
      getAccounts(get(walletsAtom), get(chainSpecDataAtomFamily(chainId))),
    ),
);
