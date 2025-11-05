import {
  type MutationEvent,
  MutationEventSubjectContext,
} from "../contexts/mutation.js";
import { use, useEffect, useEffectEvent } from "react";

/**
 * Hook that watches for mutation events.
 *
 * @group Hooks
 * @param listener - Callback when new mutation event is emitted
 */
export function useMutationListener(listener: (event: MutationEvent) => void) {
  const mutationEventSubject = use(MutationEventSubjectContext);

  const onMutation = useEffectEvent<typeof listener>((event) =>
    listener(event),
  );

  useEffect(() => {
    const subscription = mutationEventSubject.subscribe({ next: onMutation });

    return () => subscription.unsubscribe();
  }, [mutationEventSubject]);
}

/**
 * @deprecated Use {@link useMutationListener} instead
 */
export const useMutationEffect = useMutationListener;
