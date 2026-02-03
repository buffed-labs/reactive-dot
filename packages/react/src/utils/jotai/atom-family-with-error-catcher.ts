import { type AtomFamily, atomFamily } from "./atom-family.js";
import { type Atom, atom, type Getter, type WritableAtom } from "jotai";

export const atomFamilyErrorsAtom = atom(
  () =>
    new Set<{
      atomFamily: AtomFamily<unknown[], unknown>;
      args: unknown[];
    }>(),
);

export function atomFamilyWithErrorCatcher<
  TArguments extends unknown[],
  TCached,
>(
  initializeAtom: (
    withErrorCatcher: <TAtomType extends Atom<unknown>>(
      atom: TAtomType,
    ) => TAtomType,
    ...args: TArguments
  ) => TCached,
  getKey?: (...args: TArguments) => unknown,
): AtomFamily<TArguments, TCached> {
  const baseAtomFamily = atomFamily((...args: TArguments) => {
    const withErrorCatcher = <TAtomType extends Atom<unknown>>(
      childAtom: TAtomType,
    ) => {
      const read = (get: Getter) => {
        try {
          const value = get(childAtom);

          if (!(value instanceof Promise)) {
            return value;
          }

          return value.catch((error) => {
            get(atomFamilyErrorsAtom).add({
              atomFamily: baseAtomFamily as AtomFamily<unknown[], unknown>,
              args,
            });

            throw error;
          });
        } catch (error) {
          get(atomFamilyErrorsAtom).add({
            atomFamily: baseAtomFamily as AtomFamily<unknown[], unknown>,
            args,
          });

          throw error;
        }
      };

      return "write" in childAtom
        ? atom(read, (_, set, ...args: unknown[]) =>
            set(
              childAtom as unknown as WritableAtom<unknown, unknown[], unknown>,
              ...args,
            ),
          )
        : atom(read);
    };

    return initializeAtom(withErrorCatcher as never, ...args);
  }, getKey);

  return baseAtomFamily;
}
