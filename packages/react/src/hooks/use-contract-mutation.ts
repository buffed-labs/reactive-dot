import { MutationEventSubjectContext } from "../contexts/mutation.js";
import { SignerContext } from "../contexts/signer.js";
import { tapTx } from "../utils/tap-tx.js";
import type { ChainHookOptions } from "./types.js";
import { useAsyncAction } from "./use-async-action.js";
import { internal_useChainId } from "./use-chain-id.js";
import { useConfig } from "./use-config.js";
import { typedApiAtom } from "./use-typed-api.js";
import { MutationError } from "@reactive-dot/core";
import {
  getSolidityContractTx,
  InkContract,
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
import { useAtomCallback } from "jotai/utils";
import type { PolkadotSigner } from "polkadot-api";
import { use } from "react";
import { from, switchMap } from "rxjs";

/**
 * Hook for mutating (writing to) a contract.
 *
 * @group Hooks
 * @param action - The function to create the transaction
 * @param options - Additional options
 * @returns The current transaction state & submit function
 */
export function useContractMutation<
  TAction extends (
    builder: MutationBuilder,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: any,
  ) => PatchedReturnType<MutationBuilder>,
>(
  action: TAction,
  options?: ChainHookOptions & {
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
  const config = useConfig();
  const chainId = internal_useChainId(options);
  const contextSigner = use(SignerContext);
  const mutationEventSubject = use(MutationEventSubjectContext);

  type SubmitOptions = {
    signer?: PolkadotSigner;
    txOptions?: TxOptionsOf<Awaited<ReturnType<TAction>>>;
  } & (Parameters<TAction>["length"] extends 2
    ? { variables: Parameters<TAction>[1] }
    : { variables?: Parameters<TAction>[1] });

  return useAsyncAction(
    useAtomCallback(
      (
        get,
        _,
        ...[submitOptions]: Parameters<TAction>["length"] extends 2
          ? [submitOptions: SubmitOptions]
          : [submitOptions?: SubmitOptions]
      ) => {
        const signer =
          submitOptions?.signer ?? options?.signer ?? contextSigner;

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
              get(typedApiAtom(config, chainId)),
              getInkClient(contract),
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
            await get(typedApiAtom(config, chainId)),
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
                ...args: Parameters<
                  InkMutationBuilder | SolidityMutationBuilder
                >
              ) =>
                args[0] instanceof InkContract
                  ? inkMutationBuilder(
                      ...(args as Parameters<InkMutationBuilder>),
                    )
                  : solidityMutationBuilder(
                      ...(args as Parameters<SolidityMutationBuilder>),
                    ),
              submitOptions?.variables,
            ),
          ),
        ).pipe(
          switchMap((tx) =>
            tx
              .signSubmitAndWatch(
                signer,
                submitOptions?.txOptions ?? options?.txOptions,
              )
              .pipe(tapTx(mutationEventSubject, chainId, tx)),
          ),
        );
      },
    ),
  );
}
