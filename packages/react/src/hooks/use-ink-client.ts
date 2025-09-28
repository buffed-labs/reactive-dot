import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import type { InkContract } from "@reactive-dot/core/internal.js";
import { getInkClient } from "@reactive-dot/core/internal/actions.js";
import { atom, type Atom } from "jotai";

// TODO: figure out why explicit type annotation is needed
/**
 * @internal
 */
export const inkClientAtom: (
  contract: InkContract,
) => Atom<ReturnType<typeof getInkClient>> = atomFamilyWithErrorCatcher(
  (withErrorCatcher, contract: InkContract) =>
    withErrorCatcher(atom(() => getInkClient(contract))),
  (contract) => contract.id,
);
