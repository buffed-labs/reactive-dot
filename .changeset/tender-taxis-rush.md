---
"@reactive-dot/react": patch
---

Enhanced the `useContractEventListener` & `useMutationEffect` hooks to simplify usage. Their callback now leverages `useEffectEvent` internally, eliminating the need to wrap it with `useCallback`.
