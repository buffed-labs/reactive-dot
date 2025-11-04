import {
  type MutationEvent,
  MutationEventSubjectContext,
} from "../contexts/mutation.js";
import { use, useEffect, useEffectEvent } from "react";

/**
 * Hook that watches for mutation events.
 *
 * @group Hooks
 * @param effect - Callback when new mutation event is emitted
 */
export function useMutationEffect(effect: (event: MutationEvent) => void) {
  const mutationEventSubject = use(MutationEventSubjectContext);

  const onMutation = useEffectEvent<typeof effect>((event) => effect(event));

  useEffect(() => {
    const subscription = mutationEventSubject.subscribe({ next: onMutation });

    return () => subscription.unsubscribe();
  }, [mutationEventSubject]);
}
