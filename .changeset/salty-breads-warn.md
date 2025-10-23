---
"@reactive-dot/react": minor
---

Added optional direct promise access for hooks so you can opt out of suspense and await results directly.

Example:

```ts
import { useSpendableBalance } from "@reactive-dot/react";
import { use } from "react";

const balancePromise = useSpendableBalance("ADDRESS", { use: false }); // Promise<DenominatedNumber>
const balance = use(balancePromise); // DenominatedNumber
```

BREAKING CHANGES

- Removed the `useSpendableBalance(addresses: Address[])` overload, use `useSpendableBalances(addresses: Address[])` instead.
- Removed `useLazyLoadQuery(queries: Array<{ chainId: ChainID; query: Query }>)` overload. Use `{ use: false }` instead to avoid suspense waterfall for multi-chain queries.
- Removed the `defer` option from `useAccounts` and `useSpendableBalance(s)`. To opt out of suspense, use `{ use: false }` and combine with `usePromiseState` when you need a stateful value:

  ```ts
  import { useAccounts, usePromiseState } from "@reactive-dot/react";

  const accounts = usePromiseState(
    useAccounts({ use: false }),
    (prev) => prev ?? undefined,
  ); // WalletAccount[] | undefined
  ```
