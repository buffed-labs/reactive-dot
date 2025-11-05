import { mutationEventKey } from "../keys.js";
import type { MutationEvent } from "../types.js";
import { inject, watch } from "vue";

/**
 * Watch for mutation events.
 *
 * @param listener - Callback when new mutation event is emitted
 */
export function watchMutation(listener: (event: MutationEvent) => void) {
  watch(inject(mutationEventKey)!, (event) => {
    if (event !== undefined) {
      listener(event);
    }
  });
}

/**
 * @deprecated Use {@link watchMutation} instead
 */
export const watchMutationEffect = watchMutation;
