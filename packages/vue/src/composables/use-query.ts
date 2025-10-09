import type {
  ChainComposableOptions,
  InferQueryArgumentResult,
  QueryArgument,
} from "../types.js";
import {
  refresh,
  type Refreshable,
  refreshable,
} from "../utils/refreshable.js";
import { useAsyncData } from "./use-async-data.js";
import { internal_useChainId } from "./use-chain-id.js";
import { getInkClient } from "./use-ink-client.js";
import {
  lazyValue,
  mapLazyValue,
  useLazyValuesCache,
} from "./use-lazy-value.js";
import { useTypedApiPromise } from "./use-typed-api.js";
import { type Address, type ChainId, pending, Query } from "@reactive-dot/core";
import {
  type Contract,
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
  query as executeQuery,
  preflight,
  queryInk,
  querySolidity,
} from "@reactive-dot/core/internal/actions.js";
import type { ChainDefinition, TypedApi } from "polkadot-api";
import { combineLatest, from, isObservable, type Observable, of } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef,
  toValue,
  unref,
} from "vue";

/**
 * Composable for querying data from chain, and returning the response.
 *
 * @param query - The function to create the query
 * @param options - Additional options
 * @returns The data response
 */
export function useQuery<
  TChainId extends ChainId | undefined,
  TQuery extends QueryArgument<TChainId>,
>(query: TQuery, options?: ChainComposableOptions<TChainId>) {
  return useAsyncData(useQueryObservable(query, options));
}

/**
 * @internal
 */
export function useQueryObservable<
  TChainId extends ChainId | undefined,
  TQuery extends QueryArgument<TChainId>,
>(query: TQuery, options?: ChainComposableOptions<TChainId>) {
  const chainId = internal_useChainId(options);
  const typedApiPromise = useTypedApiPromise(options);
  const cache = useLazyValuesCache();

  const responses = computed(() => {
    const unwrappedQuery = unref(query);

    const queryValue =
      typeof unwrappedQuery !== "function"
        ? unwrappedQuery
        : unwrappedQuery(new Query());

    if (!queryValue) {
      return;
    }

    return queryValue.instructions.map((instruction) => {
      const response = (() => {
        if (instruction.instruction === "read-contract") {
          const contract = instruction.contract;

          const processContractInstructions = (
            address: Address,
            instructions: InkQueryInstruction[] | SolidityQueryInstruction[],
          ) =>
            flatHead(
              instructions.map((instruction) => {
                const response = (() => {
                  if (!("multi" in instruction)) {
                    return queryContractInstruction(
                      chainId,
                      typedApiPromise,
                      contract,
                      address,
                      instruction,
                      cache,
                    );
                  }

                  const { multi, ...rest } = instruction;

                  switch (rest.instruction) {
                    case "read-storage": {
                      const { keys, ..._rest } = rest;

                      const responses = keys.map((key) =>
                        queryContractInstruction(
                          chainId,
                          typedApiPromise,
                          contract,
                          address,
                          { ..._rest, key },
                          cache,
                        ),
                      );

                      if (!_rest.directives.stream) {
                        return responses;
                      }

                      return responses.map(asDeferred);
                    }
                    case "send-message": {
                      const { bodies, ..._rest } = rest;

                      const responses = bodies.map((body) =>
                        queryContractInstruction(
                          chainId,
                          typedApiPromise,
                          contract,
                          address,
                          { ..._rest, body },
                          cache,
                        ),
                      );

                      if (!_rest.directives.stream) {
                        return responses;
                      }

                      return responses.map(asDeferred);
                    }
                    case "call-function": {
                      const { args, ..._rest } = rest;

                      const responses = args.map((args) =>
                        queryContractInstruction(
                          chainId,
                          typedApiPromise,
                          contract,
                          address,
                          { ..._rest, args },
                          cache,
                        ),
                      );

                      if (!_rest.directives.stream) {
                        return responses;
                      }

                      return responses.map(asDeferred);
                    }
                  }
                })();

                return maybeDeferInstructionResponse(
                  response,
                  instruction.directives.defer,
                );
              }),
            );

          if (!("multi" in instruction)) {
            return processContractInstructions(
              instruction.address,
              instruction.instructions,
            );
          }

          const { addresses, ...rest } = instruction;

          return addresses.map((address) => {
            const response = processContractInstructions(
              address,
              rest.instructions,
            );

            if (!rest.directives.stream) {
              return response;
            }

            return asDeferred(
              refreshable(
                computed(() =>
                  combineLatestNested(
                    response as unknown as ComputedRef<
                      Promise<unknown> | Observable<unknown>
                    >[],
                  ),
                ),
                () =>
                  recursiveRefresh(
                    response as unknown as Refreshable<
                      ComputedRef<Promise<unknown> | Observable<unknown>>
                    >[],
                  ),
              ),
            );
          });
        }

        if (!("multi" in instruction)) {
          return queryInstruction(instruction, chainId, typedApiPromise, cache);
        }

        return instruction.args.map((args) => {
          const { multi, ...rest } = instruction;

          const response = queryInstruction(
            { ...rest, args },
            chainId,
            typedApiPromise,
            cache,
          );

          if (!rest.directives.stream) {
            return response;
          }

          return asDeferred(response);
        });
      })();

      return maybeDeferInstructionResponse(
        // @ts-expect-error complex types
        response,
        instruction.directives.defer,
      );
    });
  });

  return refreshable(
    computed(() => {
      if (responses.value === undefined) {
        return;
      }

      return combineLatestNested(
        responses.value as unknown as ComputedRef<
          Promise<unknown> | Observable<unknown>
        >[],
      ).pipe(map(flatHead));
    }),
    () => {
      if (!responses.value) {
        return;
      }

      if (!Array.isArray(responses.value)) {
        return void refresh(responses.value);
      }

      recursiveRefresh(
        responses.value as unknown as Refreshable<
          ComputedRef<Promise<unknown> | Observable<unknown>>
        >[],
      );
    },
  ) as Refreshable<
    ComputedRef<Observable<InferQueryArgumentResult<TChainId, TQuery>>>
  >;
}

function queryInstruction(
  instruction: SimpleQueryInstruction,
  chainId: MaybeRefOrGetter<ChainId>,
  typedApiPromise: MaybeRefOrGetter<Promise<TypedApi<ChainDefinition>>>,
  cache: MaybeRefOrGetter<Map<string, ShallowRef<unknown>>>,
) {
  return lazyValue(
    computed(() => [
      "query",
      toValue(chainId),
      stringify(
        toValue(omit(instruction, ["directives" as keyof typeof instruction])),
      ),
    ]),
    () => {
      switch (preflight(toValue(instruction))) {
        case "promise":
          return toValue(typedApiPromise).then(
            (typedApi) =>
              executeQuery(typedApi, toValue(instruction)) as Promise<unknown>,
          );
        case "observable":
          return from(toValue(typedApiPromise)).pipe(
            switchMap(
              (typedApi) =>
                executeQuery(
                  typedApi,
                  toValue(instruction),
                ) as Observable<unknown>,
            ),
          );
      }
    },
    cache,
  );
}

function queryContractInstruction(
  chainId: MaybeRefOrGetter<ChainId>,
  typedApiPromise: MaybeRefOrGetter<Promise<TypedApi<ChainDefinition>>>,
  contract: Contract,
  address: MaybeRefOrGetter<string>,
  instruction: SimpleInkQueryInstruction | SimpleSolidityQueryInstruction,
  cache: MaybeRefOrGetter<Map<string, ShallowRef<unknown>>>,
) {
  if (contract instanceof InkContract) {
    const inkClient = getInkClient(contract, cache);

    return lazyValue(
      computed(() => [
        "ink-query",
        toValue(chainId),
        contract.id,
        stringify(
          omit(instruction, ["directives" as keyof typeof instruction]),
        ),
      ]),
      async () =>
        queryInk(
          await toValue(typedApiPromise),
          await toValue(inkClient),
          toValue(address),
          instruction as SimpleInkQueryInstruction,
        ),
      cache,
    );
  } else {
    return lazyValue(
      computed(() => [
        "solidity-query",
        toValue(chainId),
        contract.id,
        stringify(
          omit(instruction, ["directives" as keyof typeof instruction]),
        ),
      ]),
      async () =>
        querySolidity(
          await toValue(typedApiPromise),
          contract.abi,
          toValue(address),
          instruction as SimpleSolidityQueryInstruction,
        ),
      cache,
    );
  }
}

function maybeDeferInstructionResponse<T>(
  originalAtom:
    | Refreshable<ComputedRef<Promise<T> | Observable<T>>>
    | Refreshable<ComputedRef<Promise<T> | Observable<T>>>[],
  defer: boolean | undefined,
) {
  if (!defer) {
    return originalAtom;
  }

  if (!Array.isArray(originalAtom)) {
    return asDeferred(originalAtom);
  }

  return combineLatestNested(originalAtom).pipe(startWith(pending));
}

function asDeferred<T>(
  promiseOrObservable: Refreshable<ComputedRef<Promise<T> | Observable<T>>>,
) {
  return mapLazyValue(promiseOrObservable, (promiseOrObservable) =>
    (promiseOrObservable instanceof Promise
      ? from(promiseOrObservable)
      : promiseOrObservable
    ).pipe(startWith(pending)),
  );
}

function combineLatestNested(
  array: ComputedRef<Promise<unknown> | Observable<unknown>>[],
): Observable<unknown> {
  if (array.length === 0) {
    return of([]);
  }

  const observables = array.map((value) => {
    const nestedValue = toValue(value);

    if (Array.isArray(nestedValue)) {
      return combineLatestNested(nestedValue);
    }

    const future = (() => {
      if (isObservable(nestedValue)) {
        return nestedValue;
      }

      return from(nestedValue) as Observable<unknown>;
    })();

    return future;
  });

  return combineLatest(observables);
}

const recursiveRefresh = (
  refreshables:
    | Refreshable<ComputedRef<Promise<unknown> | Observable<unknown>>>
    | Refreshable<ComputedRef<Promise<unknown> | Observable<unknown>>>[],
) => {
  if (!Array.isArray(refreshables)) {
    refresh(refreshables);
  } else {
    for (const refreshable of refreshables) {
      recursiveRefresh(refreshable);
    }
  }
};
