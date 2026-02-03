import { MutationEventSubjectContext } from "../contexts/mutation.js";
import { SignerContext } from "../contexts/signer.js";
import { tapTx } from "../utils/tap-tx.js";
import type { BackwardCompatInputOptions, ChainHookOptions } from "./types.js";
import { useAsyncAction } from "./use-async-action.js";
import { internal_useChainId } from "./use-chain-id.js";
import { clientAtom } from "./use-client.js";
import { useConfig } from "./use-config.js";
import { MutationError } from "@reactive-dot/core";
import {
  getSolidityContractTx,
  InkContract,
  type Signer,
  type InkMutationBuilder,
  type MutationBuilder,
  type PatchedReturnType,
  type SolidityMutationBuilder,
  type TxOptionsOf,
  extractPolkadotSigner,
} from "@reactive-dot/core/internal.js";
import {
  getInkClient,
  getInkContractTx,
} from "@reactive-dot/core/internal/actions.js";
import { useAtomCallback } from "jotai/utils";
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
    input: any,
  ) => PatchedReturnType<MutationBuilder>,
>(
  action: TAction,
  options?: ChainHookOptions & {
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
  const config = useConfig();
  const chainId = internal_useChainId(options);
  const contextSigner = use(SignerContext);
  const mutationEventSubject = use(MutationEventSubjectContext);

  type SubmitOptions = {
    signer?: Signer;
    txOptions?: TxOptionsOf<Awaited<ReturnType<TAction>>>;
  } & (Parameters<TAction>["length"] extends 2
    ? BackwardCompatInputOptions<Parameters<TAction>[1]>
    : Partial<BackwardCompatInputOptions<Parameters<TAction>[1]>>);

  return useAsyncAction(
    useAtomCallback(
      (
        get,
        _,
        ...[submitOptions]: Parameters<TAction>["length"] extends 2
          ? [submitOptions: SubmitOptions]
          : [submitOptions?: SubmitOptions]
      ) => {
        const signer = extractPolkadotSigner(
          submitOptions?.signer ?? options?.signer ?? contextSigner,
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
              get(clientAtom(config, chainId)),
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
            await get(clientAtom(config, chainId)),
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
                submitOptions?.txOptions ?? options?.txOptions,
              )
              .pipe(tapTx(mutationEventSubject, chainId, tx)),
          ),
        );
      },
    ),
  );
}
