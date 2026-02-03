import { mutationEventKey } from "../keys.js";
import type {
  BackwardCompatInputOptions,
  ChainComposableOptions,
} from "../types.js";
import { tapTx } from "../utils/tap-tx.js";
import { useAsyncAction } from "./use-async-action.js";
import { useChainId } from "./use-chain-id.js";
import { useClientPromise } from "./use-client.js";
import { useSigner } from "./use-signer.js";
import { BaseError, MutationError } from "@reactive-dot/core";
import {
  extractPolkadotSigner,
  getSolidityContractTx,
  InkContract,
  type Signer,
  type InkMutationBuilder,
  type MutationBuilder,
  type PatchedReturnType,
  type SolidityMutationBuilder,
  type TxOptionsOf,
} from "@reactive-dot/core/internal.js";
import {
  getInkClient,
  getInkContractTx,
} from "@reactive-dot/core/internal/actions.js";
import { from, switchMap } from "rxjs";
import { inject, toValue } from "vue";

/**
 * Composable for mutating (writing to) a contract.
 *
 * @param action - The function to create the transaction
 * @param options - Additional options
 * @returns The current transaction state & submit function
 */
export function useContractMutation<
  TAction extends (
    builder: MutationBuilder,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
  ) => PatchedReturnType<MutationBuilder>,
>(
  action: TAction,
  options?: ChainComposableOptions & {
    /**
     * Override default signer
     */
    signer?: Signer;
    /**
     * Additional transaction options
     */
    txOptions?: TxOptionsOf<Awaited<ReturnType<TAction>>>;
  },
) {
  const injectedSigner = useSigner();
  const chainId = useChainId();
  const clientPromise = useClientPromise();
  const mutationEventRef = inject(
    mutationEventKey,
    () => {
      throw new BaseError("No mutation event ref provided");
    },
    true,
  );

  type SubmitOptions = {
    signer?: Signer;
    txOptions?: TxOptionsOf<Awaited<ReturnType<TAction>>>;
  } & (Parameters<TAction>["length"] extends 2
    ? BackwardCompatInputOptions<Parameters<TAction>[1]>
    : Partial<BackwardCompatInputOptions<Parameters<TAction>[1]>>);

  return useAsyncAction(
    (
      ...[submitOptions]: Parameters<TAction>["length"] extends 2
        ? [submitOptions: SubmitOptions]
        : [submitOptions?: SubmitOptions]
    ) => {
      const signer = extractPolkadotSigner(
        submitOptions?.signer ?? toValue(options?.signer) ?? injectedSigner,
      );

      if (signer === undefined) {
        throw new MutationError("No signer provided");
      }

      const inkMutationBuilder: InkMutationBuilder = async (
        contract,
        address,
        message,
        ...[body]
      ) =>
        getInkContractTx(
          ...(await Promise.all([
            await toValue(clientPromise),
            await getInkClient(contract),
          ])),
          signer,
          address,
          message,
          body,
        );

      const solidityMutationBuilder: SolidityMutationBuilder = async (
        contract,
        address,
        functionName,
        ...[body]
      ) =>
        getSolidityContractTx(
          await toValue(clientPromise),
          contract.abi,
          signer,
          address,
          functionName,
          body,
        );

      return from(
        Promise.resolve(
          action(
            // @ts-expect-error TODO: fix this
            (
              ...args: Parameters<InkMutationBuilder | SolidityMutationBuilder>
            ) =>
              args[0] instanceof InkContract
                ? inkMutationBuilder(
                    ...(args as Parameters<InkMutationBuilder>),
                  )
                : solidityMutationBuilder(
                    ...(args as Parameters<SolidityMutationBuilder>),
                  ),
            submitOptions === undefined
              ? undefined
              : "input" in submitOptions
                ? submitOptions.input
                : "variables" in submitOptions
                  ? submitOptions.variables
                  : undefined,
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
