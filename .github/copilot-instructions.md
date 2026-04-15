# ReactiveDOT AI Coding Agent Instructions

## Project Overview

ReactiveDOT is a reactive library for building Polkadot frontends. The monorepo provides:

- **Core**: Framework-agnostic library wrapping polkadot-api with reactive primitives
- **Framework bindings**: React (Jotai-based) and Vue adapters
- **Wallet ecosystem**: Pluggable wallet providers (Ledger, Mimir, WalletConnect, etc.)
- **Documentation**: Docusaurus site at `apps/docs/`

## Architecture

### Package Structure

- `packages/core` - VanillaJS core using RxJS Observables and polkadot-api
- `packages/react` - React hooks/components using Jotai for state management
- `packages/vue` - Vue composables
- `packages/wallet-*` - Individual wallet adapters implementing core `Wallet`/`WalletProvider` interfaces
- `packages/utils` - Shared utilities
- `examples/` - Demo apps showing library usage

### Key Patterns

**Config-first initialization**: Apps use `defineConfig()` to specify chains, providers, and wallets:

```typescript
const config = defineConfig({
  chains: { polkadot: { descriptor: polkadot, provider: lightClientProvider } },
  wallets: [new InjectedWalletProvider(), new LedgerWallet()],
});
```

**Query builder pattern**: Type-safe queries via `Query.builder()` with chainable methods. See [packages/core/src/query-builder.ts](packages/core/src/query-builder.ts) for implementation.

**Observable-based reactivity**: Core library returns RxJS Observables; React/Vue bindings convert to framework-native primitives (atoms/refs).

**Jotai architecture** (React): Each hook uses atom families with error boundaries. See [packages/react/src/utils/jotai/](packages/react/src/utils/jotai/) for custom atom utilities like `atomWithObservable` and `atomFamilyWithErrorCatcher`.

## Development Workflows

### Common Commands

```bash
# Development (all packages)
yarn dev

# Build packages only
yarn build:packages

# Test with Vitest
yarn test

# Lint
yarn lint
```

### Core Package Build

The `@reactive-dot/core` package has special build requirements:

```bash
# In packages/core
papi generate  # Generates descriptors before TypeScript compilation
```

This runs automatically via the `build` script but is critical for chain type generation.

### Nx Task Orchestration

The monorepo uses Nx for dependency-aware task execution. Key config in [nx.json](nx.json):

- Tasks auto-detect dependencies via `dependsOn: ["^build"]`
- Parallel execution: `parallel: 12`
- Cache outputs: `build` and `lint` tasks

## Code Conventions

### TypeScript Specifics

- **Strict mode enabled** (see `@tsconfig/strictest` in package.json files)
- **ESM-only**: Use `.js` file extensions in imports (TypeScript convention)

  ```typescript
  import { foo } from "./bar.js";

  // Not .ts
  ```

- **Workspace dependencies**: Use `workspace:^` protocol for internal packages

### Formatting

- **Prettier** is used for code formatting across all packages
- **Import sorting**: The `@trivago/prettier-plugin-sort-imports` plugin automatically organizes imports
- Formatting is integrated with ESLint via `eslint-config-prettier` to avoid conflicts
- Code is automatically formatted on commit via git hooks (Husky)
- Run manually if needed, though typically handled automatically by IDE and pre-commit hooks

### Testing

- **Vitest** as test runner with jsdom for React tests
- **Test colocation**: Place `.test.ts` files alongside source code
- **Example**: [packages/react/src/hooks/use-balance.test.ts](packages/react/src/hooks/use-balance.test.ts)

### Git & Releases

- **Conventional commits** via commitlint (see [commitlint.config.js](commitlint.config.js))
- **Changesets** for version management and changelogs
- **Publishing**: [scripts/publish.sh](scripts/publish.sh) handles LICENSE copying and npm publishing

## Integration Points

### polkadot-api (PAPI)

Core dependency for chain interactions. Key integrations:

- Type-safe descriptors from `@polkadot-api/descriptors`
- TypedApi for runtime queries/calls
- JSON-RPC and light client providers

### Light Client Provider

Embedded Substrate node via smoldot. Example usage in [examples/react/src/config.ts](examples/react/src/config.ts):

```typescript
const lightClientProvider = createLightClientProvider();
const relayProvider = lightClientProvider.addRelayChain({ id: "polkadot" });
const paraProvider = relayProvider.addParachain({ id: "polkadot_asset_hub" });
```

### Wallet Integration

All wallets implement interfaces from [packages/core/src/wallets/](packages/core/src/wallets/):

- `Wallet` - Direct wallet instance
- `WalletProvider` - Discovery/connection abstraction
- Accounts exposed as `Observable<PolkadotAccount[]>`

## Project-Specific Quirks

- **No implicit workspace resolution**: Always use explicit workspace dependencies
- **Descriptor generation timing**: Core package must run `papi generate` before build
- **React Suspense required**: React bindings expect Suspense boundaries (see `ReactiveDotProvider`)
- **Jotai store isolation**: Each `ReactiveDotProvider` creates isolated Jotai store via `useLocalStore()`
- **Node version pinned**: Volta enforces Node 24.x (see root [package.json](package.json))

## Common Tasks

**Adding a new wallet adapter**:

1. Create `packages/wallet-{name}/` following structure of existing wallet packages
2. Implement `Wallet` or `WalletProvider` from core
3. Add to `packages/wallet-all/build/index.js` if creating meta-package

**Adding React hooks**:

1. Create hook file in `packages/react/src/hooks/`
2. Define atom families using utilities from `utils/jotai/`
3. Export via `useAtomValue()` wrapper
4. Add tests colocated in `.test.ts` file

**Updating chain types**:

1. Update descriptor imports in relevant config files
2. Re-run `papi generate` in core package if schema changes
3. TypeScript will catch breaking changes via `TypedApi` inference
