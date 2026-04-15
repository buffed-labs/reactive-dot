import { type MutationEvent } from "../contexts/mutation.js";
import type { ChainId } from "@reactive-dot/core";
import { MutationError, pending } from "@reactive-dot/core";
import type { Transaction, TxEvent } from "polkadot-api";
import {
  catchError,
  tap,
  type MonoTypeOperatorFunction,
  type Observable,
  type Subject,
} from "rxjs";

export function tapTx<T extends TxEvent>(
  mutationEventSubject: Subject<MutationEvent>,
  chainId: ChainId,
  transaction: Transaction,
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    const eventProps = {
      id: globalThis.crypto.randomUUID(),
      chainId,
      call: transaction.decodedCall,
    };

    mutationEventSubject.next({ ...eventProps, value: pending });

    return source.pipe(
      tap((value) => mutationEventSubject.next({ ...eventProps, value })),
      catchError((error) => {
        mutationEventSubject.next({
          ...eventProps,
          value: MutationError.from(error),
        });
        throw error;
      }),
    );
  };
}
