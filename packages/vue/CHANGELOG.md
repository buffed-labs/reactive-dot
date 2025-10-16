# @reactive-dot/vue

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

## 0.51.2

### Patch Changes

- [#901](https://github.com/buffed-labs/reactive-dot/pull/901) [`d6c59dd`](https://github.com/buffed-labs/reactive-dot/commit/d6c59dd18d1c53d13624986aa0ece0830a2ca211) Thanks [@tien](https://github.com/tien)! - Fixed dependencies range.

## 0.50.0

### Minor Changes

- [#853](https://github.com/buffed-labs/reactive-dot/pull/853) [`b981d30`](https://github.com/buffed-labs/reactive-dot/commit/b981d307cf6fa86d03d36a55de268bea705a4ae4) Thanks [@tien](https://github.com/tien)! - Added support for Solidity contracts running on PolkaVM

### Patch Changes

- Updated dependencies [[`b981d30`](https://github.com/buffed-labs/reactive-dot/commit/b981d307cf6fa86d03d36a55de268bea705a4ae4)]:
  - @reactive-dot/core@0.50.0

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

## 0.47.0

### Minor Changes

- [#845](https://github.com/buffed-labs/reactive-dot/pull/845) [`dd2c26e`](https://github.com/buffed-labs/reactive-dot/commit/dd2c26e2df9bf05429fa3ae046bae11d0b92c61c) Thanks [@tien](https://github.com/tien)! - Added support for passing variables directly to mutation hooks and composables.

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

## 0.42.0

### Minor Changes

- [#632](https://github.com/buffed-labs/reactive-dot/pull/632) [`f102c65`](https://github.com/buffed-labs/reactive-dot/commit/f102c65a65548fe7c77dd75caa2a83f1a22ea080) Thanks [@tien](https://github.com/tien)! - Added experimental support for Ink! contracts.

### Patch Changes

- Updated dependencies [[`f102c65`](https://github.com/buffed-labs/reactive-dot/commit/f102c65a65548fe7c77dd75caa2a83f1a22ea080)]:
  - @reactive-dot/core@0.42.0

## 0.41.0

### Patch Changes

- Updated dependencies [[`bf36c59`](https://github.com/buffed-labs/reactive-dot/commit/bf36c594da0cf996cde4adb6d706d759f2f73ad3)]:
  - @reactive-dot/core@0.41.0

## 0.40.4

### Patch Changes

- Updated dependencies [[`2b632ff`](https://github.com/buffed-labs/reactive-dot/commit/2b632ff111610ca0505a4a1fbf59d03386c5a9b6), [`1a96cbe`](https://github.com/buffed-labs/reactive-dot/commit/1a96cbe51e4891733bb4497f18ea2341e68bf3ba)]:
  - @reactive-dot/core@0.40.4

## 0.40.2

### Patch Changes

- Updated dependencies [[`c3e90bf`](https://github.com/buffed-labs/reactive-dot/commit/c3e90bf99df5ff42a5b4942d246d30c158e8f1f9)]:
  - @reactive-dot/core@0.40.2

## 0.40.1

### Patch Changes

- [#640](https://github.com/buffed-labs/reactive-dot/pull/640) [`1d8b7cb`](https://github.com/buffed-labs/reactive-dot/commit/1d8b7cb53477270bb6d138375a43d27b45803730) Thanks [@tien](https://github.com/tien)! - Fixed incorrect `useBalance` on array of one address.

## 0.40.0

### Patch Changes

- Updated dependencies [[`98d1ded`](https://github.com/buffed-labs/reactive-dot/commit/98d1ded71b14a3faefe009412083775e91599a86), [`d83ad3e`](https://github.com/buffed-labs/reactive-dot/commit/d83ad3e7b588b0bacdf6e4eed64f061d2af00fa0)]:
  - @reactive-dot/core@0.40.0

## 0.39.2

### Patch Changes

- [#607](https://github.com/buffed-labs/reactive-dot/pull/607) [`a432a67`](https://github.com/buffed-labs/reactive-dot/commit/a432a6740140bbe1f7f17deb91b9e5cb5560ad56) Thanks [@tien](https://github.com/tien)! - Fixed a bug in queries with single multi-instructions.

- Updated dependencies [[`82177f4`](https://github.com/buffed-labs/reactive-dot/commit/82177f4b31f3fc3874f2538f346409d464e61769)]:
  - @reactive-dot/core@0.39.2

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

## 0.36.3

### Patch Changes

- [#547](https://github.com/buffed-labs/reactive-dot/pull/547) [`3958fe9`](https://github.com/buffed-labs/reactive-dot/commit/3958fe9ab2e8281632685eb72227c4052cc93a30) Thanks [@tien](https://github.com/tien)! - Fixed incorrect native token info when dealing with non-common chain's spec (array for `tokenSymbol` & `tokenDecimals`).

- Updated dependencies [[`3958fe9`](https://github.com/buffed-labs/reactive-dot/commit/3958fe9ab2e8281632685eb72227c4052cc93a30)]:
  - @reactive-dot/core@0.36.3

## 0.36.0

### Patch Changes

- Updated dependencies [[`9304e56`](https://github.com/buffed-labs/reactive-dot/commit/9304e5624f4e3ba5d72a15258cad262ab315cf5f), [`2071712`](https://github.com/buffed-labs/reactive-dot/commit/207171252d45ce686d747b1709d76831e5a06198)]:
  - @reactive-dot/core@0.36.0

## 0.34.0

### Patch Changes

- [#509](https://github.com/buffed-labs/reactive-dot/pull/509) [`dfd214b`](https://github.com/buffed-labs/reactive-dot/commit/dfd214b405355994fb37afb9a7d223fdaf21295f) Thanks [@tien](https://github.com/tien)! - Made `instructions` parameter optional in `Query` constructor.

- [#516](https://github.com/buffed-labs/reactive-dot/pull/516) [`91d8a77`](https://github.com/buffed-labs/reactive-dot/commit/91d8a771d557c25f18a1bd972eb16300e3705b3d) Thanks [@tien](https://github.com/tien)! - Added descriptive names to Symbols for better clarity.

- Updated dependencies [[`dfd214b`](https://github.com/buffed-labs/reactive-dot/commit/dfd214b405355994fb37afb9a7d223fdaf21295f), [`91d8a77`](https://github.com/buffed-labs/reactive-dot/commit/91d8a771d557c25f18a1bd972eb16300e3705b3d)]:
  - @reactive-dot/core@0.34.0

## 0.33.0

### Minor Changes

- [#504](https://github.com/buffed-labs/reactive-dot/pull/504) [`b8486a9`](https://github.com/buffed-labs/reactive-dot/commit/b8486a9f2d19049306e77f41199c8393c300e3b0) Thanks [@tien](https://github.com/tien)! - Added support for using pre-built queries. A pre-built query can now be passed directly to hooks & composables.

### Patch Changes

- Updated dependencies [[`b6c5cc7`](https://github.com/buffed-labs/reactive-dot/commit/b6c5cc7a9d4ba82b2d8c890cfcc569fe6703951f)]:
  - @reactive-dot/core@0.33.0

## 0.32.0

### Patch Changes

- [#495](https://github.com/buffed-labs/reactive-dot/pull/495) [`3372262`](https://github.com/buffed-labs/reactive-dot/commit/33722622b1a8104e71ae3ce0776f7ef9609da922) Thanks [@tien](https://github.com/tien)! - Excluded tests from bundle.

- Updated dependencies []:
  - @reactive-dot/core@0.32.0

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

- [#390](https://github.com/buffed-labs/reactive-dot/pull/390) [`a723319`](https://github.com/buffed-labs/reactive-dot/commit/a7233193c59fab35c8682895d18c7e47fb3bd4f9) Thanks [@tien](https://github.com/tien)! - BREAKING: nested tx options to avoid possible property clash.

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

### Minor Changes

- [#334](https://github.com/buffed-labs/reactive-dot/pull/334) [`ee5d6a3`](https://github.com/buffed-labs/reactive-dot/commit/ee5d6a305cd1bfe9213ea82d5c81d0e1bcce2dfa) Thanks [@tien](https://github.com/tien)! - Added `useNativeToken` and `useSpendableBalance` composables.

### Patch Changes

- Updated dependencies [[`ee5d6a3`](https://github.com/buffed-labs/reactive-dot/commit/ee5d6a305cd1bfe9213ea82d5c81d0e1bcce2dfa)]:
  - @reactive-dot/core@0.26.0

## 0.25.1

### Patch Changes

- Updated dependencies [[`ed4e82d`](https://github.com/buffed-labs/reactive-dot/commit/ed4e82d3eed9499f0c59d3bb1fceb151ce1e305a)]:
  - @reactive-dot/core@0.25.1

## 0.24.1

### Patch Changes

- [#309](https://github.com/buffed-labs/reactive-dot/pull/309) [`f13af19`](https://github.com/buffed-labs/reactive-dot/commit/f13af19c754762ca008cf70ac250fecc7114f3e4) Thanks [@tien](https://github.com/tien)! - Fixed issue where provided value for debugging was not removed.

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

- [#277](https://github.com/buffed-labs/reactive-dot/pull/277) [`127620f`](https://github.com/buffed-labs/reactive-dot/commit/127620fef93031a9dbfc4d40c08a0b785ea1dda5) Thanks [@tien](https://github.com/tien)! - Fixed a bug that caused an error when retrieving accounts without specifying a chain ID.

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

### Minor Changes

- [#245](https://github.com/buffed-labs/reactive-dot/pull/245) [`98bb09e`](https://github.com/buffed-labs/reactive-dot/commit/98bb09e623805cf772dd42ce1ed144f569a71bae) Thanks [@tien](https://github.com/tien)! - Added Vue integration.

### Patch Changes

- Updated dependencies [[`98bb09e`](https://github.com/buffed-labs/reactive-dot/commit/98bb09e623805cf772dd42ce1ed144f569a71bae)]:
  - @reactive-dot/core@0.19.0
