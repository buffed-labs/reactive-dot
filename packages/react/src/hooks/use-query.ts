import { atomFamilyWithErrorCatcher } from "../utils/jotai/atom-family-with-error-catcher.js";
import type { AtomFamily } from "../utils/jotai/atom-family.js";
import {
  atomWithObservableAndPromise,
  mapAtomWithObservableAndPromise,
  type ObservableAndPromiseAtom,
} from "../utils/jotai/atom-with-observable-and-promise.js";
import { atomWithPromise } from "../utils/jotai/atom-with-promise.js";
import { maybePromiseAll } from "../utils/maybe-promise-all.js";
import { objectId } from "../utils/object-id.js";
import type {
  ChainHookOptions,
  InferQueryArgumentResult,
  QueryArgument,
  SuspenseOptions,
} from "./types.js";
import { internal_useChainId } from "./use-chain-id.js";
import { useConfig } from "./use-config.js";
import { inkClientAtom } from "./use-ink-client.js";
import { useMaybeUse } from "./use-maybe-use.js";
import { usePausableAtomValue } from "./use-pausable-atom-value.js";
import { useQueryRefresher } from "./use-query-refresher.js";
import { useRenderEffect } from "./use-render-effect.js";
import { useStablePromise } from "./use-stable-promise.js";
import { typedApiAtom } from "./use-typed-api.js";
import {
  type Address,
  type ChainId,
  type Config,
  idle,
  pending,
  Query,
} from "@reactive-dot/core";
import {
  type Contract,
  type DataStore,
  flatHead,
  InkContract,
  type InkQueryInstruction,
  omit,
  type SimpleInkQueryInstruction,
  type SimpleQueryInstruction,
  type SimpleSolidityQueryInstruction,
  type SolidityQueryInstruction,
  stringify,
} from "@reactive-dot/core/internal.js";
import {
  preflight,
  query,
  queryInk,
  querySolidity,
} from "@reactive-dot/core/internal/actions.js";
import { atom, type Getter, type WritableAtom } from "jotai";
import { soon, soonAll } from "jotai-eager";
import { unwrap } from "jotai/utils";
import { useMemo } from "react";
import { from, type Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

type FetchOptions = {
  /**
   * A unique identifier that, when changed, forces a refresh of the current query.
   */
  fetchKey?: string | number;
};

/**
 * Hook for querying data from chain, and returning the response.
 *
 * @group Hooks
 * @param query - The function to create the query
 * @param options - Additional options
 * @returns The data response
 */
export function useLazyLoadQuery<
  TChainId extends ChainId | undefined,
  TQuery extends QueryArgument<TChainId>,
  TUse extends boolean = true,
>(
  query: TQuery,
  options?: ChainHookOptions<TChainId> & SuspenseOptions<TUse> & FetchOptions,
) {
  const refresh = useQueryRefresher(query, options);

  const fetchKey =
    options !== undefined && "fetchKey" in options
      ? options.fetchKey
      : undefined;

  useRenderEffect(() => {
    refresh();
  }, fetchKey);

  const queryValue = useMemo(
    () =>
      !query ? undefined : query instanceof Query ? query : query(new Query()),
    [query],
  );

  const config = useConfig();
  const chainId = internal_useChainId(options);

  return useMaybeUse(
    useStablePromise(
      usePausableAtomValue(
        !queryValue
          ? ({ promiseAtom: atom(idle), observableAtom: atom(idle) } as never)
          : queryPayloadAtom(config, { chainId, query: queryValue }),
      ) as
        | InferQueryArgumentResult<TChainId, TQuery>
        | Promise<InferQueryArgumentResult<TChainId, TQuery>>,
    ),
    options,
  );
}

/**
 * Hook for querying data from chain, returning the response & a refresher function.
 *
 * @deprecated Use {@link useLazyLoadQuery} with {@link FetchOptions.fetchKey | options.fetchKey} instead
 * @param query - The function to create the query
 * @param options - Additional options
 * @returns The data response & a function to refresh it
 */
export function useLazyLoadQueryWithRefresh<
  TChainId extends ChainId | undefined,
  TQuery extends QueryArgument<TChainId>,
>(
  query: TQuery,
  options?: ChainHookOptions<TChainId>,
): [data: InferQueryArgumentResult<TChainId, TQuery>, refresh: () => void];
export function useLazyLoadQueryWithRefresh(
  ...args: unknown[]
): [unknown, unknown] {
  // @ts-expect-error need to spread args
  const data = useLazyLoadQuery(...args);
  // @ts-expect-error need to spread args
  const refresh = useQueryRefresher(...args);

  return [data, refresh];
}

export const contractInstructionPayloadAtom: AtomFamily<
  [
    config: Config,
    chainId: ChainId,
    contract: Contract,
    address: Address,
    instruction: SimpleInkQueryInstruction | SimpleSolidityQueryInstruction,
  ],
  {
    promiseAtom: WritableAtom<unknown, [], void>;
    observableAtom: WritableAtom<unknown, [], void>;
    __meta: {
      config: Config;
      chainId: ChainId;
      instruction: Parameters<
        Parameters<DataStore["invalidateContractQueries"]>[0]
      >[0];
    };
  }
> = atomFamilyWithErrorCatcher(
  (
    withErrorCatcher,
    config: Config,
    chainId: ChainId,
    contract: Contract,
    address: Address,
    instruction: SimpleInkQueryInstruction | SimpleSolidityQueryInstruction,
  ) => {
    const promiseAtom = withErrorCatcher(
      atomWithPromise((get, { signal }) => {
        const typedApiPromise = get(typedApiAtom(config, chainId));

        if (contract instanceof InkContract) {
          return soon(
            soonAll([typedApiPromise, get(inkClientAtom(contract))]),
            ([api, inkClient]) =>
              queryInk(
                api,
                inkClient,
                address,
                instruction as SimpleInkQueryInstruction,
                { signal },
              ),
          );
        }

        return soon(typedApiPromise, (api) =>
          querySolidity(
            api,
            contract.abi,
            address,
            instruction as SimpleSolidityQueryInstruction,
            { signal },
          ),
        );
      }),
    );
    return {
      promiseAtom,
      observableAtom: promiseAtom,
      __meta: {
        config,
        chainId,
        instruction: {
          ...instruction,
          kind: contract instanceof InkContract ? "ink" : "solidity",
          contract,
          address,
        } as Parameters<
          Parameters<DataStore["invalidateContractQueries"]>[0]
        >[0],
      },
    };
  },
  (config, chainId, contract, address, instruction) =>
    [
      objectId(config),
      chainId,
      contract.id,
      address,
      stringify(omit(instruction, ["directives" as keyof typeof instruction])),
    ].join(),
);

export const instructionPayloadAtom = atomFamilyWithErrorCatcher(
  (
    withErrorCatcher,
    config: Config,
    chainId: ChainId,
    instruction: SimpleQueryInstruction,
  ) =>
    Object.assign(
      (() => {
        switch (preflight(instruction)) {
          case "promise": {
            const atom = withErrorCatcher(
              atomWithPromise((get, { signal }) =>
                soon(get(typedApiAtom(config, chainId)), (api) =>
                  query(api, instruction, { signal }),
                ),
              ),
            );

            return {
              observableAtom: atom,
              promiseAtom: atom,
            };
          }
          case "observable":
            return atomWithObservableAndPromise(
              (get) =>
                from(Promise.resolve(get(typedApiAtom(config, chainId)))).pipe(
                  switchMap(
                    (api) => query(api, instruction) as Observable<unknown>,
                  ),
                ),
              withErrorCatcher,
            );
        }
      })(),
      { __meta: { config, chainId, instruction } },
    ),
  (config, chainId, instruction) =>
    [
      objectId(config),
      chainId,
      stringify(omit(instruction, ["directives" as keyof typeof instruction])),
    ].join(),
);

/**
 * @internal
 */
export function getQueryInstructionPayloadAtoms(
  config: Config,
  chainId: ChainId,
  query: Query,
) {
  return query.instructions.map((instruction) => {
    const responseAtom = (() => {
      if (instruction.type === "contract") {
        const processContractInstructions = (
          address: Address,
          instructions: InkQueryInstruction[] | SolidityQueryInstruction[],
        ) => {
          return flatHead(
            instructions.map((instruction) => {
              const responseAtom = (() => {
                if (!("multi" in instruction)) {
                  return contractInstructionPayloadAtom(
                    config,
                    chainId,
                    contract,
                    address,
                    instruction,
                  );
                }

                const { multi, ...rest } = instruction;

                switch (rest.type) {
                  case "storage": {
                    const { keys, ..._rest } = rest;

                    return keys.map((key) => {
                      const atom = contractInstructionPayloadAtom(
                        config,
                        chainId,
                        contract,
                        address,
                        {
                          ..._rest,
                          key,
                        },
                      );

                      return _rest.directives.stream ? asDeferred(atom) : atom;
                    });
                  }
                  case "message": {
                    const { bodies, ..._rest } = rest;

                    return bodies.map((body) => {
                      const atom = contractInstructionPayloadAtom(
                        config,
                        chainId,
                        contract,
                        address,
                        {
                          ..._rest,
                          body,
                        },
                      );

                      return _rest.directives.stream ? asDeferred(atom) : atom;
                    });
                  }
                  case "function": {
                    const { args, ..._rest } = rest;

                    return args.map((args) => {
                      const atom = contractInstructionPayloadAtom(
                        config,
                        chainId,
                        contract,
                        address,
                        {
                          ..._rest,
                          args,
                        },
                      );

                      return _rest.directives.stream ? asDeferred(atom) : atom;
                    });
                  }
                }
              })();

              return maybeDeferInstructionResponse(
                responseAtom,
                instruction.directives.defer,
              );
            }),
          );
        };

        const { contract } = instruction;

        if (!("multi" in instruction)) {
          return processContractInstructions(
            instruction.address,
            instruction.instructions,
          );
        }

        const { addresses, multi, ...rest } = instruction;

        return addresses.map((address) => {
          const atoms = processContractInstructions(address, rest.instructions);

          if (!rest.directives.stream) {
            return atoms;
          }

          if (!Array.isArray(atoms)) {
            return asDeferred(atoms);
          }

          return asDeferred({
            promiseAtom: atom((get) => getNestedAtoms(get, atoms, false)),
            observableAtom: atom((get) => getNestedAtoms(get, atoms, true)),
          });
        });
      }

      if (!("multi" in instruction)) {
        return instructionPayloadAtom(config, chainId, instruction);
      }

      return ("keys" in instruction ? instruction.keys : instruction.args).map(
        (args) => {
          const { multi, directives, ...rest } = instruction;

          const argsObj = "keys" in rest ? { keys: args } : { args };

          const atom = instructionPayloadAtom(config, chainId, {
            ...rest,
            ...argsObj,
            directives,
          });

          if (!directives.stream) {
            return atom;
          }

          return asDeferred(atom);
        },
      );
    })();

    return maybeDeferInstructionResponse(
      // @ts-expect-error complex types
      responseAtom,
      instruction.directives.defer,
    );
  });
}

/**
 * @internal
 * TODO: should be memoized within render function instead
 * https://github.com/pmndrs/jotai/discussions/1553
 */
export const queryPayloadAtom = atomFamilyWithErrorCatcher(
  (
    withErrorCatcher,
    config: Config,
    params: { chainId: ChainId; query: Query },
  ) => {
    const atoms = getQueryInstructionPayloadAtoms(
      config,
      params.chainId,
      params.query,
    );

    return {
      promiseAtom: withErrorCatcher(
        atom((get) => soon(getNestedAtoms(get, atoms, false), flatHead)),
      ),
      observableAtom: withErrorCatcher(
        atom((get) => soon(getNestedAtoms(get, atoms, true), flatHead)),
      ),
    };
  },
  (config, params) =>
    [
      objectId(config),
      params.chainId,
      stringify(params.query.instructions),
    ].join(),
);

function unwrapObservableOrPromiseAtom(
  atoms: ReturnType<typeof atomWithObservableAndPromise>,
  asObservable: boolean,
) {
  return asObservable ? atoms.observableAtom : atoms.promiseAtom;
}

type UnwrapObservableOrPromiseAtoms<T extends unknown[]> = {
  [P in keyof T]: T[P] extends ReturnType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof atomWithObservableAndPromise<infer Value, any>
  >
    ? Value
    : T[P] extends unknown[]
      ? UnwrapObservableOrPromiseAtoms<T[P]>
      : unknown;
};

function getNestedAtoms<T extends unknown[]>(
  get: Getter,
  nestedAtomArray: T,
  asObservable: boolean,
): UnwrapObservableOrPromiseAtoms<T> {
  return maybePromiseAll(
    nestedAtomArray.map((_atom) => {
      const atom = _atom as
        | ReturnType<typeof atomWithObservableAndPromise>
        | Array<ReturnType<typeof atomWithObservableAndPromise>>;

      if (!Array.isArray(atom)) {
        return get(unwrapObservableOrPromiseAtom(atom, asObservable));
      }

      return getNestedAtoms(get, atom, asObservable);
    }),
  ) as UnwrapObservableOrPromiseAtoms<T>;
}

function maybeDeferInstructionResponse(
  originalAtom:
    | ObservableAndPromiseAtom<unknown>
    | ObservableAndPromiseAtom<unknown>[],
  defer: boolean | undefined,
) {
  if (!defer) {
    return originalAtom;
  }

  if (!Array.isArray(originalAtom)) {
    return asDeferred(originalAtom);
  }

  return asDeferred({
    promiseAtom: atom((get) => getNestedAtoms(get, originalAtom, false)),
    observableAtom: atom((get) => getNestedAtoms(get, originalAtom, true)),
  });
}

function asDeferred<TAtom extends ObservableAndPromiseAtom<unknown>>(
  atom: TAtom,
) {
  return mapAtomWithObservableAndPromise(atom, (atom) =>
    unwrap(atom, () => pending),
  );
}
