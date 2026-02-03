import { signerKey } from "../keys.js";
import {
  extractPolkadotSigner,
  type Signer,
} from "@reactive-dot/core/internal.js";
import { computed, provide, toValue, type MaybeRefOrGetter } from "vue";

export function provideSigner(signer: MaybeRefOrGetter<Signer | undefined>) {
  provide(
    signerKey,
    computed(() => extractPolkadotSigner(toValue(signer))),
  );
}
