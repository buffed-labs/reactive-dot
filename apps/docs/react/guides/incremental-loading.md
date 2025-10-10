---
sidebar_position: 4
---

# Incremental loading

## `defer`

The `defer` directive may be specified on a query to imply de-prioritization, that causes the data to be in [`pending`](/react/api/core#pending) state in the initial response, and delivered as a subsequent response afterward. For React, this can also be used to opt-out of suspending.

:::info

When you pass `{ defer: true }` to the query, the result will now be either:

- A resolved value (the response you expect), or
- A special [`pending`](/react/api/core#pending) symbol from `@reactive-dot/core`, indicating that the data hasn’t arrived yet.

:::

```tsx
import { pending } from "@reactive-dot/core";
import { useLazyLoadQuery } from "@reactive-dot/react";

export function Tvl() {
  const tvl = useLazyLoadQuery((query) =>
    query.storage("NominationPools", "TotalValueLocked", [], { defer: true }),
  );

  if (tvl === pending) {
    return <progress />;
  }

  return <p>Total value locked: {tvl}</p>;
}
```

## `stream`

For multi-entry queries like `storages`, `runtimeApis`, etc., the `stream` directive allows the client to receive partial results as they become available, before the entire response is ready.

Take this basic example, where a component displays the total balance across multiple staking positions:

```tsx
import { useLazyLoadQuery } from "@reactive-dot/react";

export function TotalStaked({ addresses }: { addresses: string[] }) {
  const ledgers = useLazyLoadQuery((query) =>
    query.storages(
      "Staking",
      "Ledger",
      addresses.map((address) => [address] as const),
    ),
  );

  return (
    <p>Total staked: {ledgers.reduce((prev, curr) => prev + curr.total, 0n)}</p>
  );
}
```

This works well for a small number of accounts, where results load quickly. But with many accounts, waiting for the full response may be too slow and undesirable. To show users a partial result as soon as possible, you can enable streaming.

:::info

When you pass `{ stream: true }` to the query, each item in the result array will now be either:

- A resolved value (the response you expect), or
- A special [`pending`](/react/api/core#pending) symbol from `@reactive-dot/core`, indicating that the data for that item hasn’t arrived yet.

:::

This allows your UI to update incrementally as each item resolves:

```tsx
import { pending } from "@reactive-dot/core";
import { useLazyLoadQuery } from "@reactive-dot/react";

export function TotalStaked({ addresses }: { addresses: string[] }) {
  const ledgers = useLazyLoadQuery((query) =>
    query.storages(
      "Staking",
      "Ledger",
      addresses.map((address) => [address] as const),
      { stream: true },
    ),
  );

  const loadedLedgers = ledgers.filter((ledger) => ledger !== pending);

  const hasMore = ledgers.includes(pending);

  return (
    <p>
      Total staked:{" "}
      {loadedLedgers.reduce((prev, curr) => prev + curr.total, 0n)}
      {hasMore ? "..." : ""}
    </p>
  );
}
```

With `stream: true`, the component can render incrementally, updating the total as each balance loads.

:::tip

You can use the presence of `pending` to show loading indicators, spinners, or skeletons while waiting for the rest of the data.

:::
