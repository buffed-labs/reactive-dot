# @reactive-dot/react

## 0.61.2

### Patch Changes

- [#1002](https://github.com/buffed-labs/reactive-dot/pull/1002) [`f477d12`](https://github.com/buffed-labs/reactive-dot/commit/f477d12fd5932ce8c427a8b9558232e558fa55e0) Thanks [@tien](https://github.com/tien)! - Renamed mutation listener hook & composable.

## 0.61.1

### Patch Changes

- [#999](https://github.com/buffed-labs/reactive-dot/pull/999) [`1b09865`](https://github.com/buffed-labs/reactive-dot/commit/1b0986539ebe580f7af1022ed00d47f36d40b4a1) Thanks [@tien](https://github.com/tien)! - Enhanced the `useContractEventListener` & `useMutationEffect` hooks to simplify usage. Their callback now leverages `useEffectEvent` internally, eliminating the need to wrap it with `useCallback`.

## 0.61.0

### Minor Changes

- [#996](https://github.com/buffed-labs/reactive-dot/pull/996) [`4fc6abc`](https://github.com/buffed-labs/reactive-dot/commit/4fc6abc70d49b69cc838a73187f2885f76ce7d1e) Thanks [@tien](https://github.com/tien)! - Added hook and composable for watching contract events.

### Patch Changes

- [#992](https://github.com/buffed-labs/reactive-dot/pull/992) [`05dd278`](https://github.com/buffed-labs/reactive-dot/commit/05dd278f8af49a52b586d2361e8e8ca135cefc04) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

- Updated dependencies [[`4fc6abc`](https://github.com/buffed-labs/reactive-dot/commit/4fc6abc70d49b69cc838a73187f2885f76ce7d1e), [`05dd278`](https://github.com/buffed-labs/reactive-dot/commit/05dd278f8af49a52b586d2361e8e8ca135cefc04)]:
  - @reactive-dot/core@0.61.0

## 0.60.2

### Patch Changes

- [#987](https://github.com/buffed-labs/reactive-dot/pull/987) [`aa48eec`](https://github.com/buffed-labs/reactive-dot/commit/aa48eecf75d22dc7b2caed2c1ff24e72b14abc44) Thanks [@tien](https://github.com/tien)! - Added default `Suspense` boundary to `ReactiveDotProvider` to prevent possible infinite loops when consumers forget to add a root boundary.

## 0.60.1

### Patch Changes

- [#977](https://github.com/buffed-labs/reactive-dot/pull/977) [`80e6dc7`](https://github.com/buffed-labs/reactive-dot/commit/80e6dc7ed68fd58b47e7795fab96498f42ecd69b) Thanks [@tien](https://github.com/tien)! - Improved `usePromiseState`:
  - Skip extra render when Promise is already fulfilled
  - Set fallback value in render rather than part of side effect

## 0.60.0

### Minor Changes

- [#972](https://github.com/buffed-labs/reactive-dot/pull/972) [`0c6a9fe`](https://github.com/buffed-labs/reactive-dot/commit/0c6a9fe072752ae531591543011d6baaa7dde633) Thanks [@tien](https://github.com/tien)! - Added `Await` component.

## 0.59.1

### Patch Changes

- [#970](https://github.com/buffed-labs/reactive-dot/pull/970) [`8b5443b`](https://github.com/buffed-labs/reactive-dot/commit/8b5443b04f5de3de48abd55299490659da9faa66) Thanks [@tien](https://github.com/tien)! - Fixed infinite render loop when using conditional queries.

## 0.59.0

### Minor Changes

- [#968](https://github.com/buffed-labs/reactive-dot/pull/968) [`cbde012`](https://github.com/buffed-labs/reactive-dot/commit/cbde012323628a518bbdc255bf81cff0921b490e) Thanks [@tien](https://github.com/tien)! - Added optional direct promise access for hooks so you can opt out of suspense and await results directly.

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

## 0.58.0

### Minor Changes

- [#955](https://github.com/buffed-labs/reactive-dot/pull/955) [`bacfd76`](https://github.com/buffed-labs/reactive-dot/commit/bacfd761aff9aba3d97ec6bf31957531e7bfcfa0) Thanks [@tien](https://github.com/tien)! - Added option to skip runtime check using `unsafeDescriptor`.

### Patch Changes

- Updated dependencies [[`bacfd76`](https://github.com/buffed-labs/reactive-dot/commit/bacfd761aff9aba3d97ec6bf31957531e7bfcfa0)]:
  - @reactive-dot/core@0.58.0

## 0.57.0

### Minor Changes

- [#949](https://github.com/buffed-labs/reactive-dot/pull/949) [`ffdcf32`](https://github.com/buffed-labs/reactive-dot/commit/ffdcf32dbaea850e8dc9aad7413ee4a259dfbc4f) Thanks [@tien](https://github.com/tien)! - Added the `includeEvmAccounts` option to the configuration, defaulting to `false`. This filters out EVM accounts from wallets by default, mitigating potential errors caused by unexpected EVM accounts.

### Patch Changes

- Updated dependencies [[`ffdcf32`](https://github.com/buffed-labs/reactive-dot/commit/ffdcf32dbaea850e8dc9aad7413ee4a259dfbc4f), [`7aa74c3`](https://github.com/buffed-labs/reactive-dot/commit/7aa74c3fcc64d0321848289cb0f26ba0f554ecaa)]:
  - @reactive-dot/core@0.57.0

## 0.56.0

### Minor Changes

- [#940](https://github.com/buffed-labs/reactive-dot/pull/940) [`170291d`](https://github.com/buffed-labs/reactive-dot/commit/170291d230bfc1c31058fd7ca71118aea9193fe3) Thanks [@tien](https://github.com/tien)! - Added `invalidateChainQueries` and `invalidateContractQueries` methods to enable bulk invalidation of queries matching a predicate.

### Patch Changes

- Updated dependencies [[`170291d`](https://github.com/buffed-labs/reactive-dot/commit/170291d230bfc1c31058fd7ca71118aea9193fe3)]:
  - @reactive-dot/core@0.56.0

## 0.55.1

### Patch Changes

- [#922](https://github.com/buffed-labs/reactive-dot/pull/922) [`3202ab8`](https://github.com/buffed-labs/reactive-dot/commit/3202ab8852ffb6a9757541d74a9a8dedad815ebb) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

- Updated dependencies [[`3202ab8`](https://github.com/buffed-labs/reactive-dot/commit/3202ab8852ffb6a9757541d74a9a8dedad815ebb)]:
  - @reactive-dot/core@0.55.1

## 0.55.0

### Minor Changes

- [#920](https://github.com/buffed-labs/reactive-dot/pull/920) [`058878a`](https://github.com/buffed-labs/reactive-dot/commit/058878af6302d01f2ad052246ba204a43196a5bf) Thanks [@tien](https://github.com/tien)! - Add `useStore` hook & composable for cache management. This enhancement lays the groundwork for more sophisticated cache management features in future releases.

### Patch Changes

- Updated dependencies [[`fbd10ed`](https://github.com/buffed-labs/reactive-dot/commit/fbd10ede089f9ab3fff848b296471136b9107f48), [`058878a`](https://github.com/buffed-labs/reactive-dot/commit/058878af6302d01f2ad052246ba204a43196a5bf)]:
  - @reactive-dot/core@0.55.0

## 0.54.0

### Minor Changes

- [#916](https://github.com/buffed-labs/reactive-dot/pull/916) [`6286277`](https://github.com/buffed-labs/reactive-dot/commit/6286277940fd4a77257dffc86f6644bc8dbc9b89) Thanks [@tien](https://github.com/tien)! - Added support for getting spendable balance of H160 (EVM) addresses via `useSpendableBalance(s)` hook/composable.

### Patch Changes

- Updated dependencies [[`6286277`](https://github.com/buffed-labs/reactive-dot/commit/6286277940fd4a77257dffc86f6644bc8dbc9b89)]:
  - @reactive-dot/core@0.54.0

## 0.53.0

### Patch Changes

- Updated dependencies [[`4c34540`](https://github.com/buffed-labs/reactive-dot/commit/4c34540c1dab6b3329d2564325bc3445d896ddb0)]:
  - @reactive-dot/core@0.53.0

## 0.52.0

### Minor Changes

- [#897](https://github.com/buffed-labs/reactive-dot/pull/897) [`ca4ce86`](https://github.com/buffed-labs/reactive-dot/commit/ca4ce862eb411cf159ef505a5c20cd77b6530ddc) Thanks [@tien](https://github.com/tien)! - Added an option to defer loading balance(s) when using the `useSpendableBalance(s)` hook.

## 0.51.2

### Patch Changes

- [#901](https://github.com/buffed-labs/reactive-dot/pull/901) [`d6c59dd`](https://github.com/buffed-labs/reactive-dot/commit/d6c59dd18d1c53d13624986aa0ece0830a2ca211) Thanks [@tien](https://github.com/tien)! - Fixed dependencies range.

## 0.51.0

### Minor Changes

- [#893](https://github.com/buffed-labs/reactive-dot/pull/893) [`1c6c155`](https://github.com/buffed-labs/reactive-dot/commit/1c6c1557c17ecb5cb02fdd97e73bd30386f9c3d4) Thanks [@tien](https://github.com/tien)! - Added an option to defer loading accounts when using the `useAccounts` hook.

## 0.50.0

### Minor Changes

- [#853](https://github.com/buffed-labs/reactive-dot/pull/853) [`b981d30`](https://github.com/buffed-labs/reactive-dot/commit/b981d307cf6fa86d03d36a55de268bea705a4ae4) Thanks [@tien](https://github.com/tien)! - Added support for Solidity contracts running on PolkaVM

### Patch Changes

- Updated dependencies [[`b981d30`](https://github.com/buffed-labs/reactive-dot/commit/b981d307cf6fa86d03d36a55de268bea705a4ae4)]:
  - @reactive-dot/core@0.50.0

## 0.49.1

### Patch Changes

- [#882](https://github.com/buffed-labs/reactive-dot/pull/882) [`30e3179`](https://github.com/buffed-labs/reactive-dot/commit/30e31794c3462d3edad2c53ebe58a021e6537941) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

- Updated dependencies [[`d05c0a3`](https://github.com/buffed-labs/reactive-dot/commit/d05c0a369f29b068c3eee5f4dd0d1a666625eefd), [`30e3179`](https://github.com/buffed-labs/reactive-dot/commit/30e31794c3462d3edad2c53ebe58a021e6537941)]:
  - @reactive-dot/core@0.49.1

## 0.49.0

### Minor Changes

- [#874](https://github.com/buffed-labs/reactive-dot/pull/874) [`0e0d617`](https://github.com/buffed-labs/reactive-dot/commit/0e0d617f33e773c4243f6393e79c7f754f73b0e5) Thanks [@tien](https://github.com/tien)! - Added an option to explicitly ignore filtering accounts by supported chain when setting `chainId` to `null`.

## 0.48.0

### Minor Changes

- [#864](https://github.com/buffed-labs/reactive-dot/pull/864) [`6def43b`](https://github.com/buffed-labs/reactive-dot/commit/6def43b8942dff05a14a9bc73e99da12c05d212e) Thanks [@tien](https://github.com/tien)! - Introduced the `defer` directive to enable incremental loading for single queries, improving performance and user experience by allowing partial data to be rendered as it becomes available.

### Patch Changes

- Updated dependencies [[`6def43b`](https://github.com/buffed-labs/reactive-dot/commit/6def43b8942dff05a14a9bc73e99da12c05d212e)]:
  - @reactive-dot/core@0.48.0

## 0.47.3

### Patch Changes

- [#857](https://github.com/buffed-labs/reactive-dot/pull/857) [`db1931a`](https://github.com/buffed-labs/reactive-dot/commit/db1931a9da858dcac527f1a0e492b9d5207df9c8) Thanks [@tien](https://github.com/tien)! - Fixed mismatched dependencies range.

- Updated dependencies [[`db1931a`](https://github.com/buffed-labs/reactive-dot/commit/db1931a9da858dcac527f1a0e492b9d5207df9c8)]:
  - @reactive-dot/core@0.47.3

## 0.47.1

### Patch Changes

- [#849](https://github.com/buffed-labs/reactive-dot/pull/849) [`fab5844`](https://github.com/buffed-labs/reactive-dot/commit/fab5844738da579616a704d1062f13f629803e47) Thanks [@tien](https://github.com/tien)! - Fixed data from multichain queries not being flattened.

## 0.47.0

### Minor Changes

- [#845](https://github.com/buffed-labs/reactive-dot/pull/845) [`dd2c26e`](https://github.com/buffed-labs/reactive-dot/commit/dd2c26e2df9bf05429fa3ae046bae11d0b92c61c) Thanks [@tien](https://github.com/tien)! - Added support for passing variables directly to mutation hooks and composables.

### Patch Changes

- [#846](https://github.com/buffed-labs/reactive-dot/pull/846) [`75a1754`](https://github.com/buffed-labs/reactive-dot/commit/75a1754ab9b003ee1abef5251c19385f789530d2) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.46.3

### Patch Changes

- [#833](https://github.com/buffed-labs/reactive-dot/pull/833) [`b697b7f`](https://github.com/buffed-labs/reactive-dot/commit/b697b7f54682463c9e9ca0acbac7bc38caf9c991) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

- Updated dependencies [[`b697b7f`](https://github.com/buffed-labs/reactive-dot/commit/b697b7f54682463c9e9ca0acbac7bc38caf9c991)]:
  - @reactive-dot/core@0.46.3

## 0.46.2

### Patch Changes

- [#817](https://github.com/buffed-labs/reactive-dot/pull/817) [`4f8eb3b`](https://github.com/buffed-labs/reactive-dot/commit/4f8eb3ba5a5ff650118f85f4bf93f6f7c0c75fe2) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.46.0

### Patch Changes

- Updated dependencies [[`2d7be44`](https://github.com/buffed-labs/reactive-dot/commit/2d7be4468ab0e66b6c26e9bfa9c92be0054c3c16)]:
  - @reactive-dot/core@0.46.0

## 0.45.0

### Minor Changes

- [#793](https://github.com/buffed-labs/reactive-dot/pull/793) [`4e2d46d`](https://github.com/buffed-labs/reactive-dot/commit/4e2d46df07b756de5cc89bb3548d0152bede8bc0) Thanks [@tien](https://github.com/tien)! - Added dedicated `useSpendableBalances` hook/composable.

## 0.44.0

### Patch Changes

- Updated dependencies [[`cfe99f2`](https://github.com/buffed-labs/reactive-dot/commit/cfe99f263ad2306a4a7e413ee54b0a27c189e657)]:
  - @reactive-dot/core@0.44.0

## 0.43.3

### Patch Changes

- [#777](https://github.com/buffed-labs/reactive-dot/pull/777) [`f674f5e`](https://github.com/buffed-labs/reactive-dot/commit/f674f5ec69beb8db1344d2fbf386699aa2feff5f) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.43.1

### Patch Changes

- Updated dependencies [[`16020b2`](https://github.com/buffed-labs/reactive-dot/commit/16020b2d00675ddb96d73a10d57b425c52180474)]:
  - @reactive-dot/core@0.43.1

## 0.43.0

### Minor Changes

- [#727](https://github.com/buffed-labs/reactive-dot/pull/727) [`b847f5b`](https://github.com/buffed-labs/reactive-dot/commit/b847f5b8c85cfc9802b9eb041c5025487a8b884f) Thanks [@tien](https://github.com/tien)! - Added support for streaming multi-query responses, allowing results to be processed incrementally instead of waiting for all queries to complete.

- [#712](https://github.com/buffed-labs/reactive-dot/pull/712) [`cc6e89d`](https://github.com/buffed-labs/reactive-dot/commit/cc6e89dc3d7b1fdf01e00d7f5ed4881aeebbe690) Thanks [@tien](https://github.com/tien)! - Return a subscribable subject for asynchronous actions that execute an observable.

### Patch Changes

- Updated dependencies [[`b847f5b`](https://github.com/buffed-labs/reactive-dot/commit/b847f5b8c85cfc9802b9eb041c5025487a8b884f)]:
  - @reactive-dot/core@0.43.0

## 0.42.4

### Patch Changes

- [#708](https://github.com/buffed-labs/reactive-dot/pull/708) [`11bbeb7`](https://github.com/buffed-labs/reactive-dot/commit/11bbeb784d5458e73b3a01cc65faad06de27a4b1) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.42.3

### Patch Changes

- [#694](https://github.com/buffed-labs/reactive-dot/pull/694) [`b5bca5d`](https://github.com/buffed-labs/reactive-dot/commit/b5bca5d71f479d0fe14f26e752ebc948a60ffe3b) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.42.2

### Patch Changes

- [#689](https://github.com/buffed-labs/reactive-dot/pull/689) [`3041301`](https://github.com/buffed-labs/reactive-dot/commit/3041301dd26c1ed39261468632dabaa75bb12a14) Thanks [@tien](https://github.com/tien)! - Fixed query subscriptions.

## 0.42.1

### Patch Changes

- [#687](https://github.com/buffed-labs/reactive-dot/pull/687) [`c72782e`](https://github.com/buffed-labs/reactive-dot/commit/c72782e14079c5cabb09e27ea7144dad5b96bcb0) Thanks [@tien](https://github.com/tien)! - Fixed incorrect data returned for queries with one single instruction.

## 0.42.0

### Minor Changes

- [#632](https://github.com/buffed-labs/reactive-dot/pull/632) [`f102c65`](https://github.com/buffed-labs/reactive-dot/commit/f102c65a65548fe7c77dd75caa2a83f1a22ea080) Thanks [@tien](https://github.com/tien)! - Added experimental support for Ink! contracts.

### Patch Changes

- Updated dependencies [[`f102c65`](https://github.com/buffed-labs/reactive-dot/commit/f102c65a65548fe7c77dd75caa2a83f1a22ea080)]:
  - @reactive-dot/core@0.42.0

## 0.41.0

### Minor Changes

- [#675](https://github.com/buffed-labs/reactive-dot/pull/675) [`bf36c59`](https://github.com/buffed-labs/reactive-dot/commit/bf36c594da0cf996cde4adb6d706d759f2f73ad3) Thanks [@tien](https://github.com/tien)! - Introduced an option to enable experimental Server-Side Rendering (SSR) optimizations.

### Patch Changes

- Updated dependencies [[`bf36c59`](https://github.com/buffed-labs/reactive-dot/commit/bf36c594da0cf996cde4adb6d706d759f2f73ad3)]:
  - @reactive-dot/core@0.41.0

## 0.40.4

### Patch Changes

- [#673](https://github.com/buffed-labs/reactive-dot/pull/673) [`2c37021`](https://github.com/buffed-labs/reactive-dot/commit/2c37021f97085ad4919f19fdff7cf4d6b68d0e45) Thanks [@tien](https://github.com/tien)! - Resolved an issue where wallets were incorrectly fetched during server-side rendering (SSR).

- [#667](https://github.com/buffed-labs/reactive-dot/pull/667) [`013f026`](https://github.com/buffed-labs/reactive-dot/commit/013f02681ee6f1ddb7a75e1496b522560b20898f) Thanks [@tien](https://github.com/tien)! - Marked the module as client-only by adding the `'use client'` directive to ensure proper client-side rendering behavior.

- [#668](https://github.com/buffed-labs/reactive-dot/pull/668) [`af0d7cc`](https://github.com/buffed-labs/reactive-dot/commit/af0d7cc17335c050593284ecc3cd415b686485e3) Thanks [@tien](https://github.com/tien)! - Fixed a potential issue where states could leak in a Server-Side Rendering (SSR) environment.

- Updated dependencies [[`2b632ff`](https://github.com/buffed-labs/reactive-dot/commit/2b632ff111610ca0505a4a1fbf59d03386c5a9b6), [`1a96cbe`](https://github.com/buffed-labs/reactive-dot/commit/1a96cbe51e4891733bb4497f18ea2341e68bf3ba)]:
  - @reactive-dot/core@0.40.4

## 0.40.3

### Patch Changes

- [#658](https://github.com/buffed-labs/reactive-dot/pull/658) [`fd8bc9a`](https://github.com/buffed-labs/reactive-dot/commit/fd8bc9a4aef7cd6d58c2e8efbd51b5b8cb73f20c) Thanks [@tien](https://github.com/tien)! - Fixed intermittent suspense flickers.

## 0.40.2

### Patch Changes

- Updated dependencies [[`c3e90bf`](https://github.com/buffed-labs/reactive-dot/commit/c3e90bf99df5ff42a5b4942d246d30c158e8f1f9)]:
  - @reactive-dot/core@0.40.2

## 0.40.1

### Patch Changes

- [#640](https://github.com/buffed-labs/reactive-dot/pull/640) [`1d8b7cb`](https://github.com/buffed-labs/reactive-dot/commit/1d8b7cb53477270bb6d138375a43d27b45803730) Thanks [@tien](https://github.com/tien)! - Fixed incorrect `useBalance` on array of one address.

## 0.40.0

### Minor Changes

- [#609](https://github.com/buffed-labs/reactive-dot/pull/609) [`6cbd74a`](https://github.com/buffed-labs/reactive-dot/commit/6cbd74afaea1f274ed7a2c2b709b4ca75f94bf4d) Thanks [@tien](https://github.com/tien)! - Added the ability to refresh a query by using the `options.fetchKey` parameter.

  ```tsx
  import { useState, useTransition } from "react";

  function QueryWithRefresh() {
    const [fetchCount, setFetchCount] = useState(0);
    const [isPending, startTransition] = useTransition();

    const pendingRewards = useLazyLoadQuery(
      (builder) =>
        builder.runtimeApi("NominationPoolsApi", "pending_rewards", [
          ACCOUNT_ADDRESS,
        ]),
      { fetchKey: fetchCount },
    );

    return (
      <div>
        <p>{pendingRewards.toLocaleString()}</p>
        <button
          onClick={() =>
            startTransition(() => setFetchCount((count) => count + 1))
          }
          disabled={isPending}
        >
          Refresh
        </button>
      </div>
    );
  }
  ```

### Patch Changes

- Updated dependencies [[`98d1ded`](https://github.com/buffed-labs/reactive-dot/commit/98d1ded71b14a3faefe009412083775e91599a86), [`d83ad3e`](https://github.com/buffed-labs/reactive-dot/commit/d83ad3e7b588b0bacdf6e4eed64f061d2af00fa0)]:
  - @reactive-dot/core@0.40.0

## 0.39.2

### Patch Changes

- Updated dependencies [[`82177f4`](https://github.com/buffed-labs/reactive-dot/commit/82177f4b31f3fc3874f2538f346409d464e61769)]:
  - @reactive-dot/core@0.39.2

## 0.39.1

### Patch Changes

- [#583](https://github.com/buffed-labs/reactive-dot/pull/583) [`4e47d40`](https://github.com/buffed-labs/reactive-dot/commit/4e47d40516862aa54f367110e74a4ff3ebaca637) Thanks [@tien](https://github.com/tien)! - Refactor suspense handling.

## 0.39.0

### Minor Changes

- [#579](https://github.com/buffed-labs/reactive-dot/pull/579) [`2af8d7b`](https://github.com/buffed-labs/reactive-dot/commit/2af8d7b57c73b8fce6247c43978472777a9d1055) Thanks [@tien](https://github.com/tien)! - Improved subscription cleanup mechanism for better memory management and performance.

## 0.38.5

### Patch Changes

- [#576](https://github.com/buffed-labs/reactive-dot/pull/576) [`1d30ac6`](https://github.com/buffed-labs/reactive-dot/commit/1d30ac65ced522a72656621ed6e3fcbdd39aa7af) Thanks [@tien](https://github.com/tien)! - Fixed mismatched initial value between observable and promise.

## 0.38.4

### Patch Changes

- [#574](https://github.com/buffed-labs/reactive-dot/pull/574) [`a7effd8`](https://github.com/buffed-labs/reactive-dot/commit/a7effd891072d9fbac0b59d799b32630c345ce17) Thanks [@tien](https://github.com/tien)! - Fixed a potential issue where an observable could unsubscribe before the component was mounted.

## 0.38.3

### Patch Changes

- [#572](https://github.com/buffed-labs/reactive-dot/pull/572) [`799f9f0`](https://github.com/buffed-labs/reactive-dot/commit/799f9f03c17e3f01f93847a1f26bb6a4a3e06214) Thanks [@tien](https://github.com/tien)! - Fixed issues where paused observables were not unsubscribing as expected.

## 0.38.2

### Patch Changes

- [#570](https://github.com/buffed-labs/reactive-dot/pull/570) [`059e104`](https://github.com/buffed-labs/reactive-dot/commit/059e10497c7e5cc4b9e595bb9d8ef97fdc7f0b57) Thanks [@tien](https://github.com/tien)! - Fixed potential dangling subscriptions, significantly enhancing performance.

## 0.38.1

### Patch Changes

- Updated dependencies [[`35c0f4d`](https://github.com/buffed-labs/reactive-dot/commit/35c0f4daf554ab4845aaca88beaf3364e49d7936)]:
  - @reactive-dot/core@0.38.1

## 0.38.0

### Patch Changes

- Updated dependencies [[`c741a7d`](https://github.com/buffed-labs/reactive-dot/commit/c741a7db3390984157c84e6bc6e127cdacddd9fa)]:
  - @reactive-dot/core@0.38.0

## 0.37.0

### Minor Changes

- [#556](https://github.com/buffed-labs/reactive-dot/pull/556) [`d753bba`](https://github.com/buffed-labs/reactive-dot/commit/d753bbaf96a44965a93eccd6eb90fb0add416b70) Thanks [@tien](https://github.com/tien)! - Renamed query builder methods.

### Patch Changes

- Updated dependencies [[`d753bba`](https://github.com/buffed-labs/reactive-dot/commit/d753bbaf96a44965a93eccd6eb90fb0add416b70)]:
  - @reactive-dot/core@0.37.0

## 0.36.4

### Patch Changes

- [#553](https://github.com/buffed-labs/reactive-dot/pull/553) [`47ba871`](https://github.com/buffed-labs/reactive-dot/commit/47ba8714c9ad603745a00a9e96ebd3229633631b) Thanks [@tien](https://github.com/tien)! - Fixed observable initial value not being populated after reading promise.

## 0.36.3

### Patch Changes

- [#547](https://github.com/buffed-labs/reactive-dot/pull/547) [`3958fe9`](https://github.com/buffed-labs/reactive-dot/commit/3958fe9ab2e8281632685eb72227c4052cc93a30) Thanks [@tien](https://github.com/tien)! - Fixed incorrect native token info when dealing with non-common chain's spec (array for `tokenSymbol` & `tokenDecimals`).

- Updated dependencies [[`3958fe9`](https://github.com/buffed-labs/reactive-dot/commit/3958fe9ab2e8281632685eb72227c4052cc93a30)]:
  - @reactive-dot/core@0.36.3

## 0.36.2

### Patch Changes

- [#543](https://github.com/buffed-labs/reactive-dot/pull/543) [`a58bbd6`](https://github.com/buffed-labs/reactive-dot/commit/a58bbd69addbc8f618b9f63b5714bab27ad69124) Thanks [@tien](https://github.com/tien)! - Refactored error handling.

- [#545](https://github.com/buffed-labs/reactive-dot/pull/545) [`87fcd8d`](https://github.com/buffed-labs/reactive-dot/commit/87fcd8d8361b535dca0670776d95c72cbe07e665) Thanks [@tien](https://github.com/tien)! - Reduced unnecessary promise creation.

## 0.36.1

### Patch Changes

- [#541](https://github.com/buffed-labs/reactive-dot/pull/541) [`3279d4c`](https://github.com/buffed-labs/reactive-dot/commit/3279d4c1136b8c171dbfdb4847ef635e76ab67d6) Thanks [@tien](https://github.com/tien)! - Fixed unexpected micro-suspensions on React 19.

## 0.36.0

### Patch Changes

- Updated dependencies [[`9304e56`](https://github.com/buffed-labs/reactive-dot/commit/9304e5624f4e3ba5d72a15258cad262ab315cf5f), [`2071712`](https://github.com/buffed-labs/reactive-dot/commit/207171252d45ce686d747b1709d76831e5a06198)]:
  - @reactive-dot/core@0.36.0

## 0.35.1

### Patch Changes

- [#531](https://github.com/buffed-labs/reactive-dot/pull/531) [`ddf9c66`](https://github.com/buffed-labs/reactive-dot/commit/ddf9c6661d2bf500054569c72e1eb6bce113eb88) Thanks [@tien](https://github.com/tien)! - Removed useless & dangling promises.

- [#529](https://github.com/buffed-labs/reactive-dot/pull/529) [`436fb6c`](https://github.com/buffed-labs/reactive-dot/commit/436fb6cfbbcb440db920321b2b248ed3115d2f90) Thanks [@tien](https://github.com/tien)! - Fixed observable error propagation.

## 0.35.0

### Minor Changes

- [#525](https://github.com/buffed-labs/reactive-dot/pull/525) [`d51bb86`](https://github.com/buffed-labs/reactive-dot/commit/d51bb8624e39a9d5a89f7d31b9398d4b79f26c84) Thanks [@tien](https://github.com/tien)! - Added the ability to pause subscriptions via `<QueryOptionsProvider active={false} />` context.

## 0.34.0

### Minor Changes

- [#514](https://github.com/buffed-labs/reactive-dot/pull/514) [`9de08c9`](https://github.com/buffed-labs/reactive-dot/commit/9de08c934f01a3eae8b4011b281f240ea70b06ed) Thanks [@tien](https://github.com/tien)! - BREAKING CHANGE: required React 19 as peer dependency.

- [#515](https://github.com/buffed-labs/reactive-dot/pull/515) [`00d1414`](https://github.com/buffed-labs/reactive-dot/commit/00d14149ed334bcacda523f2c86e21f631f986df) Thanks [@tien](https://github.com/tien)! - Added concurrent multi-chain query capability hooks.

### Patch Changes

- [#509](https://github.com/buffed-labs/reactive-dot/pull/509) [`dfd214b`](https://github.com/buffed-labs/reactive-dot/commit/dfd214b405355994fb37afb9a7d223fdaf21295f) Thanks [@tien](https://github.com/tien)! - Made `instructions` parameter optional in `Query` constructor.

- Updated dependencies [[`dfd214b`](https://github.com/buffed-labs/reactive-dot/commit/dfd214b405355994fb37afb9a7d223fdaf21295f), [`91d8a77`](https://github.com/buffed-labs/reactive-dot/commit/91d8a771d557c25f18a1bd972eb16300e3705b3d)]:
  - @reactive-dot/core@0.34.0

## 0.33.0

### Minor Changes

- [#504](https://github.com/buffed-labs/reactive-dot/pull/504) [`b8486a9`](https://github.com/buffed-labs/reactive-dot/commit/b8486a9f2d19049306e77f41199c8393c300e3b0) Thanks [@tien](https://github.com/tien)! - Added support for using pre-built queries. A pre-built query can now be passed directly to hooks & composables.

### Patch Changes

- Updated dependencies [[`b6c5cc7`](https://github.com/buffed-labs/reactive-dot/commit/b6c5cc7a9d4ba82b2d8c890cfcc569fe6703951f)]:
  - @reactive-dot/core@0.33.0

## 0.32.0

### Minor Changes

- [#503](https://github.com/buffed-labs/reactive-dot/pull/503) [`4872c0d`](https://github.com/buffed-labs/reactive-dot/commit/4872c0d7199f9d0542bd63683fc5eba2a286c9c9) Thanks [@tien](https://github.com/tien)! - Added `QueryRenderer` component.

### Patch Changes

- [#495](https://github.com/buffed-labs/reactive-dot/pull/495) [`3372262`](https://github.com/buffed-labs/reactive-dot/commit/33722622b1a8104e71ae3ce0776f7ef9609da922) Thanks [@tien](https://github.com/tien)! - Excluded tests from bundle.

- Updated dependencies []:
  - @reactive-dot/core@0.32.0

## 0.31.4

### Patch Changes

- [#491](https://github.com/buffed-labs/reactive-dot/pull/491) [`6ac1a56`](https://github.com/buffed-labs/reactive-dot/commit/6ac1a560c18a25cf76a52799d42904d43f23b6a7) Thanks [@tien](https://github.com/tien)! - Drastically improved query lookup performance.

## 0.31.3

### Patch Changes

- [#488](https://github.com/buffed-labs/reactive-dot/pull/488) [`be7ab3d`](https://github.com/buffed-labs/reactive-dot/commit/be7ab3df4736d7c3f3291ee000903403b3cae3ef) Thanks [@tien](https://github.com/tien)! - Memoize `useNativeTokenAmountFromPlanck` & `useNativeTokenAmountFromNumber` hooks' return value.

- [#490](https://github.com/buffed-labs/reactive-dot/pull/490) [`7bb0237`](https://github.com/buffed-labs/reactive-dot/commit/7bb023777642c9eee76ac81df80276b7fd78bf9d) Thanks [@tien](https://github.com/tien)! - Fixed possible infinite read loop.

## 0.31.2

### Patch Changes

- [#486](https://github.com/buffed-labs/reactive-dot/pull/486) [`5e0ec70`](https://github.com/buffed-labs/reactive-dot/commit/5e0ec705d91d5f559001c2594d8b99e73b578153) Thanks [@tien](https://github.com/tien)! - Fixed incorrect type conversion for native token amount conversion.

## 0.31.1

### Patch Changes

- [#483](https://github.com/buffed-labs/reactive-dot/pull/483) [`2a7ae77`](https://github.com/buffed-labs/reactive-dot/commit/2a7ae77f555565831cb93468586b4c6f4abc8362) Thanks [@tien](https://github.com/tien)! - Fixed incorrect conversion from number to native token amount .

## 0.31.0

### Patch Changes

- Updated dependencies [[`776d1ef`](https://github.com/buffed-labs/reactive-dot/commit/776d1ef29777550fdcec83b11713e53a68624d14)]:
  - @reactive-dot/core@0.31.0

## 0.30.0

### Patch Changes

- [#365](https://github.com/buffed-labs/reactive-dot/pull/365) [`dcc8c24`](https://github.com/buffed-labs/reactive-dot/commit/dcc8c241c7543bebecdc73438f627d6f7fd0610e) Thanks [@tien](https://github.com/tien)! - Moved core actions to internal exports.

- Updated dependencies [[`821f21b`](https://github.com/buffed-labs/reactive-dot/commit/821f21b511b4c7ef8b0eff2e3f9eb0a3addb36ac), [`dcc8c24`](https://github.com/buffed-labs/reactive-dot/commit/dcc8c241c7543bebecdc73438f627d6f7fd0610e)]:
  - @reactive-dot/core@0.30.0

## 0.29.0

### Patch Changes

- Updated dependencies [[`6e1ded0`](https://github.com/buffed-labs/reactive-dot/commit/6e1ded07876d9ee6471830038e8910c369f14a4b)]:
  - @reactive-dot/core@0.29.0

## 0.28.0

### Minor Changes

- [#387](https://github.com/buffed-labs/reactive-dot/pull/387) [`8ca10b3`](https://github.com/buffed-labs/reactive-dot/commit/8ca10b3f94b612a5d3ac1305d1674ff384e8d5a9) Thanks [@tien](https://github.com/tien)! - BREAKING: nested tx options to avoid possible property clash.

## 0.27.2

### Patch Changes

- [#385](https://github.com/buffed-labs/reactive-dot/pull/385) [`a7298be`](https://github.com/buffed-labs/reactive-dot/commit/a7298beac90c5c208bdb941417a24a990b95828d) Thanks [@tien](https://github.com/tien)! - Added React 19 support.

## 0.27.1

### Patch Changes

- Updated dependencies [[`aeef030`](https://github.com/buffed-labs/reactive-dot/commit/aeef0303347668d7c53de3373f581b95a723fb17)]:
  - @reactive-dot/core@0.27.1

## 0.27.0

### Patch Changes

- Updated dependencies [[`f1d984f`](https://github.com/buffed-labs/reactive-dot/commit/f1d984f0347de0928e09ab9b99a9989586031d52)]:
  - @reactive-dot/core@0.27.0

## 0.26.2

### Patch Changes

- Updated dependencies [[`a3da0de`](https://github.com/buffed-labs/reactive-dot/commit/a3da0de4207499ff6e766f7affd08d086803a897)]:
  - @reactive-dot/core@0.26.2

## 0.26.1

### Patch Changes

- [#337](https://github.com/buffed-labs/reactive-dot/pull/337) [`e5c37d0`](https://github.com/buffed-labs/reactive-dot/commit/e5c37d04fbdf5515c09f65875c4f8f6c6c1c5f01) Thanks [@tien](https://github.com/tien)! - Moved `initializeWallets` function to top-level exports.

- Updated dependencies [[`a638b48`](https://github.com/buffed-labs/reactive-dot/commit/a638b48e595f5dd6d87141f12f62616b507f3ed8), [`e5c37d0`](https://github.com/buffed-labs/reactive-dot/commit/e5c37d04fbdf5515c09f65875c4f8f6c6c1c5f01)]:
  - @reactive-dot/core@0.26.1

## 0.26.0

### Patch Changes

- Updated dependencies [[`ee5d6a3`](https://github.com/buffed-labs/reactive-dot/commit/ee5d6a305cd1bfe9213ea82d5c81d0e1bcce2dfa)]:
  - @reactive-dot/core@0.26.0

## 0.25.1

### Patch Changes

- Updated dependencies [[`ed4e82d`](https://github.com/buffed-labs/reactive-dot/commit/ed4e82d3eed9499f0c59d3bb1fceb151ce1e305a)]:
  - @reactive-dot/core@0.25.1

## 0.25.0

### Minor Changes

- [#316](https://github.com/buffed-labs/reactive-dot/pull/316) [`c4094a1`](https://github.com/buffed-labs/reactive-dot/commit/c4094a14c4e871a791e5495c3434ec2f3834a40e) Thanks [@tien](https://github.com/tien)! - BREAKING: The query error resetter no longer accepts a specific error input; it now defaults to resetting all errors globally.

## 0.24.1

### Patch Changes

- [#306](https://github.com/buffed-labs/reactive-dot/pull/306) [`bbda9ef`](https://github.com/buffed-labs/reactive-dot/commit/bbda9ef093e87a96d6eb23ba51464ec02ba08bb2) Thanks [@tien](https://github.com/tien)! - Simplified wallet provider interface.

- Updated dependencies [[`bbda9ef`](https://github.com/buffed-labs/reactive-dot/commit/bbda9ef093e87a96d6eb23ba51464ec02ba08bb2), [`0958ce1`](https://github.com/buffed-labs/reactive-dot/commit/0958ce1f6c06f6e163b4ce6e8f012caf4fb34040), [`13c5dae`](https://github.com/buffed-labs/reactive-dot/commit/13c5dae1a0ca5500d798ac31e3a8b81bc9d3f78a)]:
  - @reactive-dot/core@0.24.1

## 0.24.0

### Minor Changes

- [#293](https://github.com/buffed-labs/reactive-dot/pull/293) [`2bdab49`](https://github.com/buffed-labs/reactive-dot/commit/2bdab4925c736a81245936fb4034984dd4211f23) Thanks [@tien](https://github.com/tien)! - BREAKING: renamed "aggregator" to "provider".

### Patch Changes

- Updated dependencies [[`2bdab49`](https://github.com/buffed-labs/reactive-dot/commit/2bdab4925c736a81245936fb4034984dd4211f23)]:
  - @reactive-dot/core@0.24.0

## 0.23.0

### Minor Changes

- [#284](https://github.com/buffed-labs/reactive-dot/pull/284) [`9b831f9`](https://github.com/buffed-labs/reactive-dot/commit/9b831f9982d359ba8be0de845b6ede1f9d170ab1) Thanks [@tien](https://github.com/tien)! - BREAKING: Removed `allowlist` and `denylist` functionality. This feature was too specific, and it’s now recommended for users to implement it as a recipe in their own applications if needed.

### Patch Changes

- [#280](https://github.com/buffed-labs/reactive-dot/pull/280) [`452b79a`](https://github.com/buffed-labs/reactive-dot/commit/452b79aa3ff447b998a2aa40b6e0c62b38089a96) Thanks [@tien](https://github.com/tien)! - Refactored generic type parameters for chain IDs & descriptors.

- Updated dependencies [[`fccd977`](https://github.com/buffed-labs/reactive-dot/commit/fccd9778365d71a6903560513455f033fded0b4c)]:
  - @reactive-dot/core@0.23.0

## 0.22.0

### Minor Changes

- [#279](https://github.com/buffed-labs/reactive-dot/pull/279) [`02b5633`](https://github.com/buffed-labs/reactive-dot/commit/02b56338948e32463b9b3e682340a25920386d91) Thanks [@tien](https://github.com/tien)! - Added target chains option to define default chains for providing type definitions.

### Patch Changes

- Updated dependencies [[`02b5633`](https://github.com/buffed-labs/reactive-dot/commit/02b56338948e32463b9b3e682340a25920386d91)]:
  - @reactive-dot/core@0.22.0

## 0.21.0

### Patch Changes

- Updated dependencies [[`2c30634`](https://github.com/buffed-labs/reactive-dot/commit/2c3063493977b78c95312b507332cced8296e66b)]:
  - @reactive-dot/core@0.21.0

## 0.20.0

### Minor Changes

- [#270](https://github.com/buffed-labs/reactive-dot/pull/270) [`08e5517`](https://github.com/buffed-labs/reactive-dot/commit/08e5517f01bb24285ef4684f6de27753e3a9f2e9) Thanks [@tien](https://github.com/tien)! - BREAKING: simplified chain type registration.

  **Old approach:**

  ```ts
  import type { config } from "./config.js";
  import type { InferChains } from "@reactive-dot/core";

  declare module "@reactive-dot/core" {
    export interface Chains extends InferChains<typeof config> {}
  }
  ```

  **New approach:**

  ```ts
  import type { config } from "./config.js";

  declare module "@reactive-dot/core" {
    export interface Register {
      config: typeof config;
    }
  }
  ```

### Patch Changes

- Updated dependencies [[`08e5517`](https://github.com/buffed-labs/reactive-dot/commit/08e5517f01bb24285ef4684f6de27753e3a9f2e9)]:
  - @reactive-dot/core@0.20.0

## 0.19.0

### Patch Changes

- [#264](https://github.com/buffed-labs/reactive-dot/pull/264) [`42a81e7`](https://github.com/buffed-labs/reactive-dot/commit/42a81e73fe46c5b30ada85c5af481e330bcb4878) Thanks [@tien](https://github.com/tien)! - Improved error resetting to cover all queries.

- Updated dependencies [[`98bb09e`](https://github.com/buffed-labs/reactive-dot/commit/98bb09e623805cf772dd42ce1ed144f569a71bae)]:
  - @reactive-dot/core@0.19.0

## 0.18.0

### Patch Changes

- Updated dependencies [[`42d6d34`](https://github.com/buffed-labs/reactive-dot/commit/42d6d343bb299d56b14a18dd0d7e54c90d20c1b6)]:
  - @reactive-dot/core@0.18.0

## 0.17.1

### Patch Changes

- [#258](https://github.com/buffed-labs/reactive-dot/pull/258) [`febca6e`](https://github.com/buffed-labs/reactive-dot/commit/febca6ef82c68e8f93e58be641606d767f99c926) Thanks [@tien](https://github.com/tien)! - Fixed missing pending & error events.

## 0.17.0

### Minor Changes

- [#251](https://github.com/buffed-labs/reactive-dot/pull/251) [`7f362ce`](https://github.com/buffed-labs/reactive-dot/commit/7f362ce6d87569f335c28de48a722a20d2fe9304) Thanks [@tien](https://github.com/tien)! - BREAKING: removed exports of internally used functions & interfaces.

### Patch Changes

- [#248](https://github.com/buffed-labs/reactive-dot/pull/248) [`9c9c6f3`](https://github.com/buffed-labs/reactive-dot/commit/9c9c6f382be793b4c1b121e0db8252c7729e3d26) Thanks [@tien](https://github.com/tien)! - Fixed an issue where accounts were being fetched from wallets that were not connected.

## 0.16.5

### Patch Changes

- [#234](https://github.com/buffed-labs/reactive-dot/pull/234) [`98d2370`](https://github.com/buffed-labs/reactive-dot/commit/98d23709a1888b94c77495189bba110ce5823b83) Thanks [@tien](https://github.com/tien)! - Fixed missing accepted parameter type for `useNativeTokenAmountFromPlanck`.

- Updated dependencies []:
  - @reactive-dot/core@0.16.5

## 0.16.4

### Patch Changes

- [#231](https://github.com/buffed-labs/reactive-dot/pull/231) [`306666a`](https://github.com/buffed-labs/reactive-dot/commit/306666a37f4db772903b73b933a2f5914d365dea) Thanks [@tien](https://github.com/tien)! - Fixed missing accepted parameter type for `useNativeTokenAmountFromNumber` partial application.

## 0.16.2

### Patch Changes

- [#224](https://github.com/buffed-labs/reactive-dot/pull/224) [`15beee0`](https://github.com/buffed-labs/reactive-dot/commit/15beee09dfcd6e434609a24c327aff3be244651a) Thanks [@tien](https://github.com/tien)! - Fixed TypeScript error with PAPI version 1.4.0.

## 0.16.0

### Patch Changes

- Updated dependencies [[`1c4fdee`](https://github.com/buffed-labs/reactive-dot/commit/1c4fdee520b066254c48ba58562c50d75473da69)]:
  - @reactive-dot/core@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [[`6370689`](https://github.com/buffed-labs/reactive-dot/commit/63706898748890dc4f16a2469deafbd36dedf9b5)]:
  - @reactive-dot/core@0.15.0

## 0.14.0

### Minor Changes

- [#176](https://github.com/buffed-labs/reactive-dot/pull/176) [`5837511`](https://github.com/buffed-labs/reactive-dot/commit/583751173e1dd7546f71c421d7d4b2f98769124a) Thanks [@tien](https://github.com/tien)! - Removed `jotai-scope`, enabling consumer to use their own Jotai's store provider.

- [#186](https://github.com/buffed-labs/reactive-dot/pull/186) [`a215f26`](https://github.com/buffed-labs/reactive-dot/commit/a215f26b3d22feea611ede32ebdbaace4adf7503) Thanks [@tien](https://github.com/tien)! - BREAKING: Updated all variables and types to use the library’s full name.

### Patch Changes

- [#183](https://github.com/buffed-labs/reactive-dot/pull/183) [`c9a922d`](https://github.com/buffed-labs/reactive-dot/commit/c9a922d3ee83b78175922d89c539c0165ff9c40b) Thanks [@tien](https://github.com/tien)! - Refactored query & query-refresher logic.

- Updated dependencies [[`a215f26`](https://github.com/buffed-labs/reactive-dot/commit/a215f26b3d22feea611ede32ebdbaace4adf7503)]:
  - @reactive-dot/core@0.14.0

## 0.13.0

### Minor Changes

- [#165](https://github.com/buffed-labs/reactive-dot/pull/165) [`82aa041`](https://github.com/buffed-labs/reactive-dot/commit/82aa041997eddf56d24ba97da3ba61f38e1cda7f) Thanks [@tien](https://github.com/tien)! - BREAKING: renamed wallets "reconnect" to "initialize".

- [#174](https://github.com/buffed-labs/reactive-dot/pull/174) [`1468d69`](https://github.com/buffed-labs/reactive-dot/commit/1468d69091e4aa96886edbf3272b0b3df21a4a4a) Thanks [@tien](https://github.com/tien)! - BREAKING: switched to camelCase for exported symbols.

- [#172](https://github.com/buffed-labs/reactive-dot/pull/172) [`46abe19`](https://github.com/buffed-labs/reactive-dot/commit/46abe19dd85a54385e480941baae2275603718e9) Thanks [@tien](https://github.com/tien)! - BREAKING: moved internal types to subpath export.

### Patch Changes

- Updated dependencies [[`1468d69`](https://github.com/buffed-labs/reactive-dot/commit/1468d69091e4aa96886edbf3272b0b3df21a4a4a), [`46abe19`](https://github.com/buffed-labs/reactive-dot/commit/46abe19dd85a54385e480941baae2275603718e9)]:
  - @reactive-dot/core@0.13.0

## 0.12.0

### Patch Changes

- Updated dependencies [[`21ec7d1`](https://github.com/buffed-labs/reactive-dot/commit/21ec7d14185ac02c4f48e365db2932eae324aec8)]:
  - @reactive-dot/core@0.12.0

## 0.11.0

### Minor Changes

- [#144](https://github.com/buffed-labs/reactive-dot/pull/144) [`1297296`](https://github.com/buffed-labs/reactive-dot/commit/1297296b1514d628d5c9581f42e8b2326fc34524) Thanks [@tien](https://github.com/tien)! - Updated logic to support retrieving accounts without a defined chain ID.

## 0.10.0

### Minor Changes

- [#132](https://github.com/buffed-labs/reactive-dot/pull/132) [`510dd4b`](https://github.com/buffed-labs/reactive-dot/commit/510dd4b3930695d8936ec749cd6b0358431e29af) Thanks [@tien](https://github.com/tien)! - Added hook for getting the current signer.

### Patch Changes

- Updated dependencies [[`a845ca5`](https://github.com/buffed-labs/reactive-dot/commit/a845ca5646e62f205db0949474376916e93093e9)]:
  - @reactive-dot/core@0.10.0

## 0.9.0

### Minor Changes

- [#127](https://github.com/buffed-labs/reactive-dot/pull/127) [`7965340`](https://github.com/buffed-labs/reactive-dot/commit/7965340a58313596dfdf99d1833ad3d9bac74ee5) Thanks [@tien](https://github.com/tien)! - Added hook for pre-loading queries.

### Patch Changes

- [#124](https://github.com/buffed-labs/reactive-dot/pull/124) [`d122505`](https://github.com/buffed-labs/reactive-dot/commit/d122505fb74e9b45c7e238d3778dbf173a040c48) Thanks [@tien](https://github.com/tien)! - Fixed some global states that were unscoped.

- Updated dependencies [[`255c1c8`](https://github.com/buffed-labs/reactive-dot/commit/255c1c8d3dd7ce39977dbd02535234b38033aa77)]:
  - @reactive-dot/core@0.9.0

## 0.8.0

### Minor Changes

- [#105](https://github.com/buffed-labs/reactive-dot/pull/105) [`336b208`](https://github.com/buffed-labs/reactive-dot/commit/336b208627776e85f9173bcc36e1a86e6d389299) Thanks [@tien](https://github.com/tien)! - Add source and declaration maps for improved debugging and type checking.

### Patch Changes

- Updated dependencies [[`c2c3a61`](https://github.com/buffed-labs/reactive-dot/commit/c2c3a617d54cc1db9ed4bfec276d46044e8100db), [`336b208`](https://github.com/buffed-labs/reactive-dot/commit/336b208627776e85f9173bcc36e1a86e6d389299), [`6ba27d5`](https://github.com/buffed-labs/reactive-dot/commit/6ba27d5641ca82d1f65fba7c4a9b4938627f0911)]:
  - @reactive-dot/core@0.8.0

## 0.7.1

### Patch Changes

- [#102](https://github.com/buffed-labs/reactive-dot/pull/102) [`ff1c4f6`](https://github.com/buffed-labs/reactive-dot/commit/ff1c4f6451853a730a9ed592ec705ed0651d9bae) Thanks [@tien](https://github.com/tien)! - Add missing export for `useChainIds`.

- [#104](https://github.com/buffed-labs/reactive-dot/pull/104) [`2cf5826`](https://github.com/buffed-labs/reactive-dot/commit/2cf582624a32d50fd7e1379548d95c20fe54fad4) Thanks [@tien](https://github.com/tien)! - Use `const` modifier in case consuming applications also perform checks on library types.

## 0.7.0

### Minor Changes

- [#86](https://github.com/buffed-labs/reactive-dot/pull/86) [`ec6ef50`](https://github.com/buffed-labs/reactive-dot/commit/ec6ef50184fbb854026c16b1455dd09da4178272) Thanks [@tien](https://github.com/tien)! - Add hook for getting account's spendable balance.

- [#88](https://github.com/buffed-labs/reactive-dot/pull/88) [`5243b19`](https://github.com/buffed-labs/reactive-dot/commit/5243b1913eec85e469e9d4b0ef23e10b1024a9d7) Thanks [@tien](https://github.com/tien)! - Add hook for getting all configured chain IDs.

### Patch Changes

- Updated dependencies []:
  - @reactive-dot/core@0.7.0

## 0.6.0

### Minor Changes

- [#80](https://github.com/buffed-labs/reactive-dot/pull/80) [`b9bb4c1`](https://github.com/buffed-labs/reactive-dot/commit/b9bb4c19c33e3ce62ec6bea3eee8f517bc6e0f57) Thanks [@tien](https://github.com/tien)! - Add hooks for converting planck or number to native token amount.

- [#87](https://github.com/buffed-labs/reactive-dot/pull/87) [`94505d6`](https://github.com/buffed-labs/reactive-dot/commit/94505d6416934e9ed4c8ac7794beee1142517b0f) Thanks [@tien](https://github.com/tien)! - **BREAKING**: rename action hooks
  - `useResetQueryError` to `useQueryErrorResetter`
  - `useConnectWallet` to `useWalletConnector`
  - `useDisconnectWallet` to `useWalletDisconnector`
  - `useReconnectWallets` to `useWalletsReconnector`

## 0.5.0

### Patch Changes

- Updated dependencies [[`294d7f0`](https://github.com/buffed-labs/reactive-dot/commit/294d7f07b4e622eac94c55c43c400d8eae34ad01)]:
  - @reactive-dot/core@0.5.0

## 0.4.0

### Minor Changes

- [#47](https://github.com/buffed-labs/reactive-dot/pull/47) [`435791b`](https://github.com/buffed-labs/reactive-dot/commit/435791b0a8a715f576b9d30ffba24572a6913bc3) Thanks [@tien](https://github.com/tien)! - Add `useChainId` hook.
  - Get current chain ID from context
  - Optionally assert current chain ID using allowlist and/or denylist

### Patch Changes

- Updated dependencies [[`18cb167`](https://github.com/buffed-labs/reactive-dot/commit/18cb167af54c57aa3d6af999e621618d10bbaac5)]:
  - @reactive-dot/core@0.4.0

## 0.3.1

### Patch Changes

- [#43](https://github.com/buffed-labs/reactive-dot/pull/43) [`be24bc6`](https://github.com/buffed-labs/reactive-dot/commit/be24bc60c87fc4e35c68aa9412cdb225d4c9b895) Thanks [@tien](https://github.com/tien)! - Fix incorrect return type from `useAccounts` hook.

- Updated dependencies [[`be24bc6`](https://github.com/buffed-labs/reactive-dot/commit/be24bc60c87fc4e35c68aa9412cdb225d4c9b895)]:
  - @reactive-dot/core@0.3.1

## 0.3.0

### Patch Changes

- [#36](https://github.com/buffed-labs/reactive-dot/pull/36) [`dfa501f`](https://github.com/buffed-labs/reactive-dot/commit/dfa501f0d6e26fc010f50ca5b67ec8f0675f9c9a) Thanks [@tien](https://github.com/tien)! - Use `^` (compatible) version range.

- [#33](https://github.com/buffed-labs/reactive-dot/pull/33) [`ea12e2a`](https://github.com/buffed-labs/reactive-dot/commit/ea12e2af95cf8e45bbc602587383b1dffb4d6b42) Thanks [@tien](https://github.com/tien)! - Add React to peer dependencies.

- Updated dependencies [[`eea304b`](https://github.com/buffed-labs/reactive-dot/commit/eea304b1fd1ddaa31691f01cbc4e03d998bb4fdf), [`dfa501f`](https://github.com/buffed-labs/reactive-dot/commit/dfa501f0d6e26fc010f50ca5b67ec8f0675f9c9a)]:
  - @reactive-dot/core@0.3.0

## 0.2.0

### Patch Changes

- Updated dependencies [[`11b17b0`](https://github.com/buffed-labs/reactive-dot/commit/11b17b0b7819f44ebca5c08ba2e11d36dde5f8f7)]:
  - @reactive-dot/core@0.2.0

## 0.1.1

### Patch Changes

- [#11](https://github.com/buffed-labs/reactive-dot/pull/11) [`7446493`](https://github.com/buffed-labs/reactive-dot/commit/7446493ddae1e4bc9a216736c0fd5273530f2bce) Thanks [@tien](https://github.com/tien)! - Fix changeset publish does not resolves Yarn workspace dependencies

- Updated dependencies [[`7446493`](https://github.com/buffed-labs/reactive-dot/commit/7446493ddae1e4bc9a216736c0fd5273530f2bce)]:
  - @reactive-dot/core@0.1.1

## 0.1.0

### Minor Changes

- [`490a6e1`](https://github.com/buffed-labs/reactive-dot/commit/490a6e16be5031ddca2d9eecb184aa14f1cbd508) Thanks [@tien](https://github.com/tien)! - Initial release

### Patch Changes

- Updated dependencies [[`490a6e1`](https://github.com/buffed-labs/reactive-dot/commit/490a6e16be5031ddca2d9eecb184aa14f1cbd508)]:
  - @reactive-dot/core@0.1.0
