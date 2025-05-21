import { isSsr } from "../utils/is-ssr.js";
import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import { atomWithObservableAndPromise } from "../utils/jotai/atom-with-observable-and-promise.js";
import { useAtomValue } from "./use-atom-value.js";
import { useConfig } from "./use-config.js";
import { usePausableAtomValue } from "./use-pausable-atom-value.js";
import type { Config } from "@reactive-dot/core";
import {
  aggregateWallets,
  getConnectedWallets,
} from "@reactive-dot/core/internal/actions.js";
import { atom } from "jotai";

/**
 * Hook for getting all available wallets.
 *
 * @group Hooks
 * @returns Available wallets
 */
export function useWallets() {
  return useAtomValue(walletsAtom(useConfig()));
}

/**
 * Hook for getting all connected wallets.
 *
 * @group Hooks
 * @returns Connected wallets
 */
export function useConnectedWallets() {
  return usePausableAtomValue(connectedWalletsAtom(useConfig()));
}

/**
 * @internal
 */
export const walletsAtom = atomFamilyWithErrorCatcher(
  (withErrorCatcher, config: Config) =>
    isSsr()
      ? atom(Promise.resolve([]))
      : withErrorCatcher(atom(() => aggregateWallets(config.wallets ?? []))),
);

/**
 * @internal
 */
export const connectedWalletsAtom = atomFamilyWithErrorCatcher(
  (withErrorCatcher, config: Config) =>
    atomWithObservableAndPromise(
      (get) => getConnectedWallets(get(walletsAtom(config))),
      withErrorCatcher,
    ),
);
