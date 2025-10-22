---
sidebar_position: 5
---

# Bulk refresh

Sometimes you need to refresh multiple queries at once based on certain criteria. The store provides methods to invalidate queries in bulk using a filter function.

```ts
import { useStore } from "@reactive-dot/react";

const store = useStore();

// Refresh all runtime-api queries
store.invalidateChainQueries(
  (instruction) => instruction.type === "runtime-api",
);

// Refresh all "NominationPoolsApi" runtime-api queries
store.invalidateChainQueries(
  (instruction) =>
    instruction.type === "runtime-api" &&
    instruction.api === "NominationPoolsApi",
);

// Refresh all queries to a specific contract
store.invalidateContractQueries(
  (instruction) => instruction.address === "CONTRACT_ADDRESS",
);

// Refresh all balanceOf queries to a contract
store.invalidateContractQueries(
  (instruction) =>
    instruction.kind === "ink" &&
    instruction.type === "message" &&
    instruction.name === "balanceOf",
);
```
