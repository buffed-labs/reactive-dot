---
sidebar_position: 3
---

# Advanced async handling

ReactiveDOT provides flexible async handling patterns that work seamlessly with React 19's concurrent features. By default, all hooks suspend, but you can opt-out to gain fine-grained control over loading states and error handling.

## Suspense mode (default)

By default, ReactiveDOT hooks suspend while data is loading, integrating naturally with React's Suspense boundaries.

```tsx
import { useSpendableBalance } from "@reactive-dot/react";
import { Suspense } from "react";

function UserBalance({ address }: { address: string }) {
  // highlight-start
  // Suspends until balance is loaded
  const balance = useSpendableBalance(address);
  // highlight-end

  return <div>Balance: {balance.toLocaleString()}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading balance...</div>}>
      <UserBalance address={ADDRESS} />
    </Suspense>
  );
}
```

## Promise mode

Opt-out of suspense by passing `{ use: false }` to get a **stable, stateful Promise** instead. This gives you full control over async state management.

:::info Promise stability & reactivity

The promise maintains a stable reference across re-renders, making it safe to use with React 19's `use` function. However, it's also reactive: when the underlying data changes (from chain subscriptions, query invalidations, or parameter updates), the promise automatically resolves to the new value, triggering a re-render.

:::

### Using React's `use` function

The simplest way to consume a promise is with React 19's built-in `use` function, which suspends at the call site.

```tsx
import { useSpendableBalance } from "@reactive-dot/react";
import { use, Suspense } from "react";

function UserBalance({ address }: { address: string }) {
  // highlight-next-line
  const balancePromise = useSpendableBalance(address, { use: false });

  // highlight-start
  // Suspends here until promise resolves
  const balance = use(balancePromise);
  // highlight-end

  return <div>Balance: {balance.toLocaleString()}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserBalance address={ADDRESS} />
    </Suspense>
  );
}
```

### Using [`usePromiseState`](/react/api/react/functions/usePromiseState) for non-suspending UIs

When you want to handle loading states without suspense, use [`usePromiseState`](/react/api/react/functions/usePromiseState) to track promise state. This is particularly useful when creating reusable hooks where you don't want to surprise consumers with unexpected suspense behavior.

```tsx
import { pending } from "@reactive-dot/core";
import { useSpendableBalance, usePromiseState } from "@reactive-dot/react";

function UserBalance({ address }: { address: string }) {
  const balancePromise = useSpendableBalance(address, { use: false });
  // highlight-next-line
  const balance = usePromiseState(balancePromise);

  // highlight-next-line
  if (balance === pending) {
    return <div>Loading balance...</div>;
  }

  return <div>Balance: {balance.toLocaleString()}</div>;
}
```

#### Providing fallback values

You can provide a fallback function to avoid the `pending` symbol entirely:

```tsx
import { useSpendableBalance, usePromiseState } from "@reactive-dot/react";

function UserBalance({ address }: { address: string }) {
  const balancePromise = useSpendableBalance(address, { use: false });

  // highlight-start
  // Falls back to previous value or undefined while loading
  const balance = usePromiseState(
    balancePromise,
    (previousValue) => previousValue ?? undefined,
  );
  // highlight-end

  if (balance === undefined) {
    return <div>Loading balance...</div>;
  }

  return <div>Balance: {balance.toLocaleString()}</div>;
}
```

This is useful for:

- Creating reusable hooks with predictable behavior (no surprise suspense)
- Showing stale data while refreshing
- Providing default values during initial load
- Having explicit control over loading states

:::tip Reusable hooks

When building reusable hooks, consider using [`usePromiseState`](/react/api/react/functions/usePromiseState) over the default suspense mode. This gives consumers explicit control over how they handle loading states, avoiding unexpected suspense behavior.

:::

### Using [`usePromises`](/react/api/react/functions/usePromises) for parallel requests

Load multiple promises in parallel and suspend until all resolve:

```tsx
import {
  useSpendableBalance,
  useBlock,
  useLazyLoadQuery,
  usePromises,
} from "@reactive-dot/react";
import { Suspense } from "react";

function UserProfile({ address }: { address: string }) {
  // highlight-start
  const [balance, block, identity] = usePromises([
    useSpendableBalance(address, { use: false }),
    useBlock({ use: false }),
    useLazyLoadQuery(
      (query) => query.storage("Identity", "IdentityOf", [address]),
      { use: false },
    ),
  ]);
  // highlight-end

  return (
    <div>
      <p>Balance: {balance.toLocaleString()}</p>
      <p>Block: {block.number.toLocaleString()}</p>
      <p>Identity: {identity?.info.display.asText() ?? "None"}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <UserProfile address={ADDRESS} />
    </Suspense>
  );
}
```

### Using the [`Await`](/react/api/react/functions/Await) component

The [`Await`](/react/api/react/functions/Await) component provides a declarative way to handle promises with render props:

```tsx
import { useSpendableBalance, Await } from "@reactive-dot/react";
import { Suspense } from "react";

function UserBalance({ address }: { address: string }) {
  const balancePromise = useSpendableBalance(address, { use: false });

  return (
    // highlight-start
    <Suspense fallback={<div>Loading...</div>}>
      <Await promise={balancePromise}>
        {(balance) => <div>Balance: {balance.toLocaleString()}</div>}
      </Await>
    </Suspense>
    // highlight-end
  );
}

function App() {
  return <UserBalance address={ADDRESS} />;
}
```

## Choosing the right pattern

| Pattern                                                             | Use case                                              |
| ------------------------------------------------------------------- | ----------------------------------------------------- |
| **Default (Suspense)**                                              | Simplest approach, great for most cases               |
| **`use`**                                                           | When you need promise control but still want suspense |
| **[`usePromiseState`](/react/api/react/functions/usePromiseState)** | Custom loading states without suspense                |
| **[`usePromises`](/react/api/react/functions/usePromises)**         | Parallel data fetching with suspense                  |
| **[`Await`](/react/api/react/functions/Await)**                     | Declarative promise handling, good for composition    |

## Error handling

All patterns work with React's Error Boundaries. Strategically place Error Boundaries at different levels of your component tree based on how granular you want your error UI to be:

```tsx
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    // highlight-start
    // Top-level boundary for critical errors
    // highlight-end
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserBalance address={ADDRESS} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Or use multiple boundaries for isolated error handling
function Dashboard() {
  return (
    <div>
      {/* Balance section can fail independently */}
      <ErrorBoundary fallback={<div>Failed to load balance</div>}>
        <Suspense fallback={<div>Loading balance...</div>}>
          <UserBalance address={ADDRESS} />
        </Suspense>
      </ErrorBoundary>

      {/* Identity section can fail independently */}
      <ErrorBoundary fallback={<div>Failed to load identity</div>}>
        <Suspense fallback={<div>Loading identity...</div>}>
          <UserIdentity address={ADDRESS} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

:::warning Error Boundaries required

Components using async hooks will throw errors that propagate up the component tree. Without an Error Boundary, these errors can crash your entire app. Place boundaries strategically based on your desired error handling granularity.

:::

## Best practices

1. **Start with suspense mode** - It's the simplest and most React-idiomatic approach
2. **Use `{ use: false }` when you need control** - For custom loading states or parallel requests
3. **Consider [`usePromiseState`](/react/api/react/functions/usePromiseState) for reusable hooks** - Avoids surprising consumers with suspense
4. **Combine patterns** - Different parts of your app can use different patterns
5. **Place Error Boundaries strategically** - Wrap sections of your app where you want errors to be caught and displayed, based on how granular you want your error UI to be

## Complete example

Here's a full example combining multiple patterns:

```tsx
import { pending } from "@reactive-dot/core";
import {
  useSpendableBalance,
  useBlock,
  useLazyLoadQuery,
  usePromises,
  usePromiseState,
  Await,
} from "@reactive-dot/react";
import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

// highlight-start
// Simple suspense
// highlight-end
function QuickBalance({ address }: { address: string }) {
  const balance = useSpendableBalance(address);
  return <div>{balance.toLocaleString()}</div>;
}

// highlight-start
// Non-suspending with explicit state control
// highlight-end
function SmoothBalance({ address }: { address: string }) {
  const balance = usePromiseState(useSpendableBalance(address, { use: false }));

  return (
    <div className={balance === pending ? "loading" : ""}>
      {balance?.toLocaleString() ?? "Loading..."}
    </div>
  );
}

// highlight-start
// Parallel requests with different data sources
// highlight-end
function UserDashboard({ address }: { address: string }) {
  const [balance, block, identity] = usePromises([
    useSpendableBalance(address, { use: false }),
    useBlock({ use: false }),
    useLazyLoadQuery(
      (query) => query.storage("Identity", "IdentityOf", [address]),
      { use: false },
    ),
  ]);

  return (
    <div>
      <p>Balance: {balance.toLocaleString()}</p>
      <p>Block: #{block.number.toLocaleString()}</p>
      <p>Identity: {identity?.info.display.asText() ?? "None"}</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={<div>Error loading data</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <QuickBalance address={ADDRESS_1} />
        <SmoothBalance address={ADDRESS_2} />
        <UserDashboard address={ADDRESS_3} />
      </Suspense>
    </ErrorBoundary>
  );
}
```
