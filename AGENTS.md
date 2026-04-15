# ReactiveDOT Workspace Instructions

## Build and Test

- Use Yarn 4 at repo root (`packageManager: yarn@4.13.0`).
- Main commands:
  - `yarn dev` (Nx run-many dev)
  - `yarn build` (Nx run-many build)
  - `yarn build:packages` (packages only)
  - `yarn lint` (fails on warnings via `--max-warnings=0`)
  - `yarn test` (Vitest)
- Node version is pinned to `24.x` (see `package.json` engines and Volta setup).
- For `packages/core`, descriptor generation is mandatory before compile (`papi generate`). The core build script already does this; avoid running raw `tsc` there without generation.

## Architecture

- Monorepo roles:
  - `packages/core`: framework-agnostic reactive runtime over `polkadot-api` (RxJS-based)
  - `packages/react`: React bindings and hooks (Jotai-based)
  - `packages/vue`: Vue composables
  - `packages/wallet-*`: wallet adapters implementing core wallet interfaces
  - `packages/utils`: shared helpers and utilities
  - `apps/docs`: Docusaurus docs source
  - `examples/*`: integration examples
- Config-first setup is the default pattern (`defineConfig` with chains/providers/wallets).
- Query logic is centered around the query builder API in `packages/core/src/query-builder.ts`.

## Conventions

- TypeScript is strict (`@tsconfig/strictest` usage across packages).
- ESM import paths must use `.js` extensions in TypeScript source files.
- Internal package dependencies should use explicit `workspace:^` ranges.
- Tests are colocated as `*.test.ts` near source.
- React bindings assume Suspense boundaries and provider-scoped Jotai stores.

## Agent Guardrails

- Prefer Nx/Yarn workspace commands over per-package ad hoc scripts unless task scope is limited.
- Do not duplicate architecture/docs prose already maintained in docs; link to existing sources:
  - Repo overview: `README.md`
  - Docs app: `apps/docs/README.md`
  - Package docs: `packages/core/README.md`, `packages/react/README.md`, `packages/utils/README.md`, `packages/test/README.md`
  - Release/versioning notes: `.changeset/README.md`
- When adding wallet adapters, follow existing `packages/wallet-*` structure and interfaces under `packages/core/src/wallets/`.
- When adding React hooks, mirror patterns from `packages/react/src/hooks/` and Jotai helpers in `packages/react/src/utils/jotai/`.

## High-Signal References

- Core query pattern: `packages/core/src/query-builder.ts`
- Core public API surface: `packages/core/src/index.ts`
- React hook example: `packages/react/src/hooks/use-balance.ts`
- React test example: `packages/react/src/hooks/use-balance.test.ts`
- Example app config: `examples/react/src/config.ts`
