import { mutationEventKey } from "../keys.js";
import type { ChainComposableOptions } from "../types.js";
import { tapTx } from "../utils/tap-tx.js";
import { useAsyncAction } from "./use-async-action.js";
import { useChainId } from "./use-chain-id.js";
import { useSigner } from "./use-signer.js";
import { useTypedApiPromise } from "./use-typed-api.js";
import type { ChainId } from "@reactive-dot/core";
import { MutationError } from "@reactive-dot/core";
import type {
  ChainDescriptorOf,
  TxOptionsOf,
} from "@reactive-dot/core/internal.js";
import type { PolkadotSigner, Transaction, TypedApi } from "polkadot-api";
import { from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { inject, type MaybeRefOrGetter, toValue } from "vue";

/**
 * Composable for sending transactions to chains.
 *
 * @param action - The function to create the transaction
 * @param options - Additional options
 * @returns The current transaction state & submit function
 */
export function useMutation<
  TAction extends (
    tx: TypedApi<ChainDescriptorOf<TChainId>>["tx"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: any,
  ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Transaction<any, any, any, any>,
  TChainId extends ChainId | undefined,
>(
  action: TAction,
  options?: ChainComposableOptions<TChainId> & {
    /**
     * Override default signer
     */
    signer?: MaybeRefOrGetter<PolkadotSigner | undefined>;
    /**
     * Additional transaction options
     */
    txOptions?: MaybeRefOrGetter<TxOptionsOf<ReturnType<TAction>> | undefined>;
  },
) {
  const injectedSigner = useSigner();
  const typedApiPromise = useTypedApiPromise();
  const chainId = useChainId();

  const mutationEventRef = inject(
    mutationEventKey,
    () => {
      throw new Error("No mutation event ref provided");
    },
    true,
  );

  type SubmitOptions = {
    signer?: PolkadotSigner;
    txOptions?: TxOptionsOf<ReturnType<TAction>>;
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

      const id = globalThis.crypto.randomUUID();

      return from(typedApiPromise.value).pipe(
        switchMap((typedApi) => {
          const transaction = action(typedApi.tx, submitOptions?.variables);

          const eventProps = {
            id,
            chainId: chainId.value,
            call: transaction.decodedCall,
          };

          mutationEventRef.value = { ...eventProps, status: "pending" };

          return transaction
            .signSubmitAndWatch(
              signer,
              submitOptions?.txOptions ?? toValue(options?.txOptions),
            )
            .pipe(tapTx(mutationEventRef, chainId.value, transaction));
        }),
      );
    },
  );
}
