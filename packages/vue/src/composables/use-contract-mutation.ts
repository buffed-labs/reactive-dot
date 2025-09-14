import { mutationEventKey } from "../keys.js";
import type { ChainComposableOptions } from "../types.js";
import { tapTx } from "../utils/tap-tx.js";
import { useAsyncAction } from "./use-async-action.js";
import { useChainId } from "./use-chain-id.js";
import { getInkClient } from "./use-ink-client.js";
import { useLazyValuesCache } from "./use-lazy-value.js";
import { useSigner } from "./use-signer.js";
import { useTypedApiPromise } from "./use-typed-api.js";
import { MutationError } from "@reactive-dot/core";
import type {
  InkMutationBuilder,
  PatchedReturnType,
  TxOptionsOf,
} from "@reactive-dot/core/internal.js";
import { getInkContractTx } from "@reactive-dot/core/internal/actions.js";
import type { PolkadotSigner } from "polkadot-api";
import { from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { inject, toValue } from "vue";

/**
 * Composable for mutating (writing to) a contract.
 *
 * @experimental
 * @param action - The function to create the transaction
 * @param options - Additional options
 * @returns The current transaction state & submit function
 */
export function useContractMutation<
  TAction extends (
    builder: InkMutationBuilder,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: any,
  ) => PatchedReturnType<InkMutationBuilder>,
>(
  action: TAction,
  options?: ChainComposableOptions & {
    /**
     * Override default signer
     */
    signer?: PolkadotSigner;
    /**
     * Additional transaction options
     */
    txOptions?: TxOptionsOf<Awaited<ReturnType<TAction>>>;
  },
) {
  const cache = useLazyValuesCache();
  const injectedSigner = useSigner();
  const chainId = useChainId();
  const typedApiPromise = useTypedApiPromise();
  const mutationEventRef = inject(
    mutationEventKey,
    () => {
      throw new Error("No mutation event ref provided");
    },
    true,
  );

  type SubmitOptions = {
    signer?: PolkadotSigner;
    txOptions?: TxOptionsOf<Awaited<ReturnType<TAction>>>;
  } & (Parameters<TAction>["length"] extends 2
    ? { variables: Parameters<TAction>[1] }
    : { variables?: Parameters<TAction>[1] });

  return useAsyncAction(
    (
      ...[submitOptions]: Parameters<TAction>["length"] extends 2
        ? [submitOptions: SubmitOptions]
        : [submitOptions?: SubmitOptions]
    ) => {
      const signer =
        submitOptions?.signer ?? toValue(options?.signer) ?? injectedSigner;

      if (signer === undefined) {
        throw new MutationError("No signer provided");
      }

      return from(
        Promise.resolve(
          action(
            // @ts-expect-error TODO: fix this
            async (contract, contractAddress, message, body) =>
              getInkContractTx(
                await toValue(typedApiPromise),
                await toValue(getInkClient(contract, cache)),
                signer,
                contractAddress,
                // @ts-expect-error TODO: fix this
                message,
                body,
              ),
            submitOptions?.variables,
          ),
        ),
      ).pipe(
        switchMap((tx) =>
          tx
            .signSubmitAndWatch(
              signer,
              submitOptions?.txOptions ?? toValue(options?.txOptions),
            )
            .pipe(tapTx(mutationEventRef, chainId.value, tx)),
        ),
      );
    },
  );
}
