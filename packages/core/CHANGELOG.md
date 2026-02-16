# @reactive-dot/core

## 0.70.0

### Minor Changes

- [#1164](https://github.com/buffed-labs/reactive-dot/pull/1164) [`b591f46`](https://github.com/buffed-labs/reactive-dot/commit/b591f46284a6fe52377bb1e15a54b23eff9fd49d) Thanks [@tien](https://github.com/tien)! - Added top-level `whenClientChanged` API.

### Patch Changes

- [#1166](https://github.com/buffed-labs/reactive-dot/pull/1166) [`9432d56`](https://github.com/buffed-labs/reactive-dot/commit/9432d56e9e5608d73da4195b99e073b055a96a15) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.69.0

### Patch Changes

- [#1147](https://github.com/buffed-labs/reactive-dot/pull/1147) [`67bf497`](https://github.com/buffed-labs/reactive-dot/commit/67bf497a61696b273f61e41f24df087f9e32a94f) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.68.2

### Patch Changes

- [#1117](https://github.com/buffed-labs/reactive-dot/pull/1117) [`37120bd`](https://github.com/buffed-labs/reactive-dot/commit/37120bdbb4d79e4e3786eea9ed125920eedf20f4) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

- [#1119](https://github.com/buffed-labs/reactive-dot/pull/1119) [`92d0219`](https://github.com/buffed-labs/reactive-dot/commit/92d0219284306c59870c5e7690ef180dbe7080f4) Thanks [@tien](https://github.com/tien)! - Removed ink client cache as caching is now handled internally by `getInkClient`.

## 0.68.1

### Patch Changes

- [#1108](https://github.com/buffed-labs/reactive-dot/pull/1108) [`34128aa`](https://github.com/buffed-labs/reactive-dot/commit/34128aa126d878aeeebd68687093452f383c8ef8) Thanks [@tien](https://github.com/tien)! - Simplified `LightClientProvider` type definition. This change addresses potential issues when `tsconfig.json` has `noEmit` set to `false`.

## 0.68.0

### Minor Changes

- [#1105](https://github.com/buffed-labs/reactive-dot/pull/1105) [`aca6518`](https://github.com/buffed-labs/reactive-dot/commit/aca6518a5dfc53b4dd0dd920479c526f698d03ef) Thanks [@tien](https://github.com/tien)! - Added top-level `whenWalletsChanged` & `whenConnectedWalletsChanged` APIs.

## 0.67.3

### Patch Changes

- [#1100](https://github.com/buffed-labs/reactive-dot/pull/1100) [`8854e9a`](https://github.com/buffed-labs/reactive-dot/commit/8854e9a1f42f6f62914ab1ef534f1a128311df96) Thanks [@tien](https://github.com/tien)! - Fixed one event listener not being removed after document load.

- [#1102](https://github.com/buffed-labs/reactive-dot/pull/1102) [`f197c1f`](https://github.com/buffed-labs/reactive-dot/commit/f197c1f2e3238d43db55a5b83d009bdc30f89908) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.67.2

### Patch Changes

- [#1094](https://github.com/buffed-labs/reactive-dot/pull/1094) [`59bfaf5`](https://github.com/buffed-labs/reactive-dot/commit/59bfaf592b185407d5ce1a0cf18f2d0494081011) Thanks [@tien](https://github.com/tien)! - Cache created Revive APIs.

## 0.67.1

### Patch Changes

- [#1091](https://github.com/buffed-labs/reactive-dot/pull/1091) [`9c922df`](https://github.com/buffed-labs/reactive-dot/commit/9c922dfdc897249a6fece8c16ac61a3b6ca9d020) Thanks [@tien](https://github.com/tien)! - Fixed breaking Revive runtime change on PassetHub.

## 0.67.0

### Patch Changes

- [#1075](https://github.com/buffed-labs/reactive-dot/pull/1075) [`e3275f5`](https://github.com/buffed-labs/reactive-dot/commit/e3275f5b3a936342b9e49b2480856375d50d5259) Thanks [@tien](https://github.com/tien)! - Preferred importing operators from `rxjs` instead of `rxjs/operators`.

## 0.66.0

### Minor Changes

- [#1066](https://github.com/buffed-labs/reactive-dot/pull/1066) [`ba806d6`](https://github.com/buffed-labs/reactive-dot/commit/ba806d64fa895a1fa5ae3d18c7d4224d8d2a824f) Thanks [@tien](https://github.com/tien)! - Added top-level `whenAccountsChanged` API.

## 0.65.1

### Patch Changes

- [#1061](https://github.com/buffed-labs/reactive-dot/pull/1061) [`b6794d0`](https://github.com/buffed-labs/reactive-dot/commit/b6794d0adfd957943fe5dbd607c8e06242ebe94b) Thanks [@tien](https://github.com/tien)! - Reduced unnecessary subscription updates in `watch-entries` queries when entries remain unchanged.

## 0.65.0

### Minor Changes

- [#1058](https://github.com/buffed-labs/reactive-dot/pull/1058) [`c293e85`](https://github.com/buffed-labs/reactive-dot/commit/c293e85b54d902c5ec8235a3aaafd05c4366fa93) Thanks [@tien](https://github.com/tien)! - BREAKING: removed deprecated top-level action exports in preparation for stable top-level APIs.

## 0.64.4

### Patch Changes

- [#1050](https://github.com/buffed-labs/reactive-dot/pull/1050) [`17257f5`](https://github.com/buffed-labs/reactive-dot/commit/17257f5cfaf47c2e17c7737afc0963bb7d32a6d6) Thanks [@tien](https://github.com/tien)! - Moved `abitype` to dev-dependencies.

- [#1050](https://github.com/buffed-labs/reactive-dot/pull/1050) [`a9d05d8`](https://github.com/buffed-labs/reactive-dot/commit/a9d05d84177c36fe1aa88fb936b765b639a8fd55) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.64.3

### Patch Changes

- [#1048](https://github.com/buffed-labs/reactive-dot/pull/1048) [`d99ed90`](https://github.com/buffed-labs/reactive-dot/commit/d99ed907f0343d5f1524a536d497e611b7f781f0) Thanks [@tien](https://github.com/tien)! - Fixed compatibility with latest Polkadot-API version.

## 0.64.2

### Patch Changes

- [#1043](https://github.com/buffed-labs/reactive-dot/pull/1043) [`ac2ca03`](https://github.com/buffed-labs/reactive-dot/commit/ac2ca032ee9251199b4b0bb8cc42483168991157) Thanks [@tien](https://github.com/tien)! - Refactored account ID logic for local wallets.

## 0.64.1

### Patch Changes

- [#1040](https://github.com/buffed-labs/reactive-dot/pull/1040) [`70a76b9`](https://github.com/buffed-labs/reactive-dot/commit/70a76b93332b5333a1e8c83b04cba8c80086a355) Thanks [@tien](https://github.com/tien)! - Revert breaking wallets changes.

## 0.64.0

### Minor Changes

- [#1038](https://github.com/buffed-labs/reactive-dot/pull/1038) [`013c431`](https://github.com/buffed-labs/reactive-dot/commit/013c431f820152e681334aa43bd2618d51e9d2eb) Thanks [@tien](https://github.com/tien)! - Removed local ID from wallet accounts.

## 0.63.3

### Patch Changes

- [#1034](https://github.com/buffed-labs/reactive-dot/pull/1034) [`1ac5653`](https://github.com/buffed-labs/reactive-dot/commit/1ac565336ea7e036255193295d649e5ebc411075) Thanks [@tien](https://github.com/tien)! - Fixed account not using fallback chainspec for SS58 format.

## 0.63.1

### Patch Changes

- [#1026](https://github.com/buffed-labs/reactive-dot/pull/1026) [`60c8386`](https://github.com/buffed-labs/reactive-dot/commit/60c838606970d1ffa498254601f2f97bd91932bc) Thanks [@tien](https://github.com/tien)! - Fixed missing account public key.

## 0.63.0

### Minor Changes

- [#1022](https://github.com/buffed-labs/reactive-dot/pull/1022) [`21f73d8`](https://github.com/buffed-labs/reactive-dot/commit/21f73d8e1ea57130837cea070538ee5595208585) Thanks [@tien](https://github.com/tien)! - Added Readonly Wallet.

## 0.62.0

### Minor Changes

- [#1014](https://github.com/buffed-labs/reactive-dot/pull/1014) [`b59c0d1`](https://github.com/buffed-labs/reactive-dot/commit/b59c0d1b873cf44aff6f7796ca5e640ad6d96796) Thanks [@tien](https://github.com/tien)! - Added Polkadot Vault wallet.

## 0.61.0

### Minor Changes

- [#996](https://github.com/buffed-labs/reactive-dot/pull/996) [`4fc6abc`](https://github.com/buffed-labs/reactive-dot/commit/4fc6abc70d49b69cc838a73187f2885f76ce7d1e) Thanks [@tien](https://github.com/tien)! - Added hook and composable for watching contract events.

### Patch Changes

- [#992](https://github.com/buffed-labs/reactive-dot/pull/992) [`05dd278`](https://github.com/buffed-labs/reactive-dot/commit/05dd278f8af49a52b586d2361e8e8ca135cefc04) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.58.2

### Patch Changes

- [#964](https://github.com/buffed-labs/reactive-dot/pull/964) [`f094fb3`](https://github.com/buffed-labs/reactive-dot/commit/f094fb3efc66df9e822ef096ab42113bc5a219e9) Thanks [@tien](https://github.com/tien)! - Fixed bug where contract addresses could no longer be used as fallback origins ([polkadot-sdk#8619](https://github.com/paritytech/polkadot-sdk/issues/8619#issuecomment-3430582831))

## 0.58.1

### Patch Changes

- [#960](https://github.com/buffed-labs/reactive-dot/pull/960) [`46cffdb`](https://github.com/buffed-labs/reactive-dot/commit/46cffdb2824e9111af38d3c3e56d7a74bedea6bf) Thanks [@tien](https://github.com/tien)! - Fixed VSCode type inference bug.

## 0.58.0

### Minor Changes

- [#955](https://github.com/buffed-labs/reactive-dot/pull/955) [`bacfd76`](https://github.com/buffed-labs/reactive-dot/commit/bacfd761aff9aba3d97ec6bf31957531e7bfcfa0) Thanks [@tien](https://github.com/tien)! - Added option to skip runtime check using `unsafeDescriptor`.

## 0.57.0

### Minor Changes

- [#949](https://github.com/buffed-labs/reactive-dot/pull/949) [`ffdcf32`](https://github.com/buffed-labs/reactive-dot/commit/ffdcf32dbaea850e8dc9aad7413ee4a259dfbc4f) Thanks [@tien](https://github.com/tien)! - Added the `includeEvmAccounts` option to the configuration, defaulting to `false`. This filters out EVM accounts from wallets by default, mitigating potential errors caused by unexpected EVM accounts.

### Patch Changes

- [#945](https://github.com/buffed-labs/reactive-dot/pull/945) [`7aa74c3`](https://github.com/buffed-labs/reactive-dot/commit/7aa74c3fcc64d0321848289cb0f26ba0f554ecaa) Thanks [@tien](https://github.com/tien)! - Use `BaseError` for errors originating from these libraries whenever possible.

## 0.56.0

### Minor Changes

- [#940](https://github.com/buffed-labs/reactive-dot/pull/940) [`170291d`](https://github.com/buffed-labs/reactive-dot/commit/170291d230bfc1c31058fd7ca71118aea9193fe3) Thanks [@tien](https://github.com/tien)! - Added `invalidateChainQueries` and `invalidateContractQueries` methods to enable bulk invalidation of queries matching a predicate.

## 0.55.2

### Patch Changes

- [#938](https://github.com/buffed-labs/reactive-dot/pull/938) [`3de443c`](https://github.com/buffed-labs/reactive-dot/commit/3de443c2ed91f05e6e59f28891a740fad86f78d8) Thanks [@tien](https://github.com/tien)! - Fixed an issue where concurrent wallet initialization could run more than once.

## 0.55.1

### Patch Changes

- [#922](https://github.com/buffed-labs/reactive-dot/pull/922) [`3202ab8`](https://github.com/buffed-labs/reactive-dot/commit/3202ab8852ffb6a9757541d74a9a8dedad815ebb) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

- Updated dependencies [[`3202ab8`](https://github.com/buffed-labs/reactive-dot/commit/3202ab8852ffb6a9757541d74a9a8dedad815ebb)]:
  - @reactive-dot/utils@0.10.3

## 0.55.0

### Minor Changes

- [#920](https://github.com/buffed-labs/reactive-dot/pull/920) [`058878a`](https://github.com/buffed-labs/reactive-dot/commit/058878af6302d01f2ad052246ba204a43196a5bf) Thanks [@tien](https://github.com/tien)! - Add `useStore` hook & composable for cache management. This enhancement lays the groundwork for more sophisticated cache management features in future releases.

### Patch Changes

- [#919](https://github.com/buffed-labs/reactive-dot/pull/919) [`fbd10ed`](https://github.com/buffed-labs/reactive-dot/commit/fbd10ede089f9ab3fff848b296471136b9107f48) Thanks [@tien](https://github.com/tien)! - Skip address processing when no changes are needed.

## 0.54.0

### Minor Changes

- [#916](https://github.com/buffed-labs/reactive-dot/pull/916) [`6286277`](https://github.com/buffed-labs/reactive-dot/commit/6286277940fd4a77257dffc86f6644bc8dbc9b89) Thanks [@tien](https://github.com/tien)! - Added support for getting spendable balance of H160 (EVM) addresses via `useSpendableBalance(s)` hook/composable.

## 0.53.0

### Minor Changes

- [#909](https://github.com/buffed-labs/reactive-dot/pull/909) [`4c34540`](https://github.com/buffed-labs/reactive-dot/commit/4c34540c1dab6b3329d2564325bc3445d896ddb0) Thanks [@tien](https://github.com/tien)! - Accept EVM accounts returned by Polkadot wallets.

## 0.51.1

### Patch Changes

- [#899](https://github.com/buffed-labs/reactive-dot/pull/899) [`82408fe`](https://github.com/buffed-labs/reactive-dot/commit/82408feda112327f3dad1b591f4c64a4b1f4324e) Thanks [@tien](https://github.com/tien)! - Cache `PolkadotChain` client per `ChainConfig`.

## 0.50.0

### Minor Changes

- [#853](https://github.com/buffed-labs/reactive-dot/pull/853) [`b981d30`](https://github.com/buffed-labs/reactive-dot/commit/b981d307cf6fa86d03d36a55de268bea705a4ae4) Thanks [@tien](https://github.com/tien)! - Added support for Solidity contracts running on PolkaVM

## 0.49.1

### Patch Changes

- [#883](https://github.com/buffed-labs/reactive-dot/pull/883) [`d05c0a3`](https://github.com/buffed-labs/reactive-dot/commit/d05c0a369f29b068c3eee5f4dd0d1a666625eefd) Thanks [@tien](https://github.com/tien)! - Fixed compatibility with Polkadot-API `^1.19.0`.

- [#882](https://github.com/buffed-labs/reactive-dot/pull/882) [`30e3179`](https://github.com/buffed-labs/reactive-dot/commit/30e31794c3462d3edad2c53ebe58a021e6537941) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.48.0

### Minor Changes

- [#864](https://github.com/buffed-labs/reactive-dot/pull/864) [`6def43b`](https://github.com/buffed-labs/reactive-dot/commit/6def43b8942dff05a14a9bc73e99da12c05d212e) Thanks [@tien](https://github.com/tien)! - Introduced the `defer` directive to enable incremental loading for single queries, improving performance and user experience by allowing partial data to be rendered as it becomes available.

## 0.47.4

### Patch Changes

- [#860](https://github.com/buffed-labs/reactive-dot/pull/860) [`76f8e8e`](https://github.com/buffed-labs/reactive-dot/commit/76f8e8e864c5e0cdb55ca58e28c17dbd5c5c24d4) Thanks [@tien](https://github.com/tien)! - Fixed `defineConfig` returns type.

## 0.47.3

### Patch Changes

- [#857](https://github.com/buffed-labs/reactive-dot/pull/857) [`db1931a`](https://github.com/buffed-labs/reactive-dot/commit/db1931a9da858dcac527f1a0e492b9d5207df9c8) Thanks [@tien](https://github.com/tien)! - Fixed mismatched dependencies range.

- Updated dependencies [[`db1931a`](https://github.com/buffed-labs/reactive-dot/commit/db1931a9da858dcac527f1a0e492b9d5207df9c8)]:
  - @reactive-dot/utils@0.10.1

## 0.47.2

### Patch Changes

- [#855](https://github.com/buffed-labs/reactive-dot/pull/855) [`4e96786`](https://github.com/buffed-labs/reactive-dot/commit/4e967862223edd5a320513d519c1df2f9a369c25) Thanks [@tien](https://github.com/tien)! - `defineConfig` will now returns the entire immutable config object.

## 0.46.3

### Patch Changes

- [#833](https://github.com/buffed-labs/reactive-dot/pull/833) [`b697b7f`](https://github.com/buffed-labs/reactive-dot/commit/b697b7f54682463c9e9ca0acbac7bc38caf9c991) Thanks [@tien](https://github.com/tien)! - Bumped dependencies.

## 0.46.1

### Patch Changes

- [#802](https://github.com/buffed-labs/reactive-dot/pull/802) [`09da71c`](https://github.com/buffed-labs/reactive-dot/commit/09da71c7d72a276e70c001b16e33d90298c9ae86) Thanks [@tien](https://github.com/tien)! - Fixed incorrect type optionality in Ink! TX body.

## 0.46.0

### Minor Changes

- [#798](https://github.com/buffed-labs/reactive-dot/pull/798) [`2d7be44`](https://github.com/buffed-labs/reactive-dot/commit/2d7be4468ab0e66b6c26e9bfa9c92be0054c3c16) Thanks [@tien](https://github.com/tien)! - Added a fallback mechanism for chainspec when fetching accounts. This improves compatibility with wallets that require a chainspec, such as Ledger devices.

## 0.44.1

### Patch Changes

- [#790](https://github.com/buffed-labs/reactive-dot/pull/790) [`5c85a5c`](https://github.com/buffed-labs/reactive-dot/commit/5c85a5ceee29bbfbc6f73f3e4db56284ffcee3b4) Thanks [@tien](https://github.com/tien)! - Resolved an issue where unexpected EVM accounts were being returned from injected wallets.

## 0.44.0

### Minor Changes

- [#781](https://github.com/buffed-labs/reactive-dot/pull/781) [`cfe99f2`](https://github.com/buffed-labs/reactive-dot/commit/cfe99f263ad2306a4a7e413ee54b0a27c189e657) Thanks [@tien](https://github.com/tien)! - Added support for specifying an `origin` (caller) when invoking a read-message on an Ink! contract.

## 0.43.2

### Patch Changes

- [#767](https://github.com/buffed-labs/reactive-dot/pull/767) [`68c6328`](https://github.com/buffed-labs/reactive-dot/commit/68c6328039038a80f7f03d1fa27d454d9f8f8626) Thanks [@tien](https://github.com/tien)! - Fixed repeated reconnection attempts after failure. The injected wallet will no longer continue trying to reconnect after the first failed attempt.

## 0.43.1

### Patch Changes

- [#743](https://github.com/buffed-labs/reactive-dot/pull/743) [`16020b2`](https://github.com/buffed-labs/reactive-dot/commit/16020b2d00675ddb96d73a10d57b425c52180474) Thanks [@tien](https://github.com/tien)! - Fixed an issue where wallets could be detected prematurely before the document finished loading.

## 0.43.0

### Minor Changes

- [#727](https://github.com/buffed-labs/reactive-dot/pull/727) [`b847f5b`](https://github.com/buffed-labs/reactive-dot/commit/b847f5b8c85cfc9802b9eb041c5025487a8b884f) Thanks [@tien](https://github.com/tien)! - Added support for streaming multi-query responses, allowing results to be processed incrementally instead of waiting for all queries to complete.

## 0.42.0

### Minor Changes

- [#632](https://github.com/buffed-labs/reactive-dot/pull/632) [`f102c65`](https://github.com/buffed-labs/reactive-dot/commit/f102c65a65548fe7c77dd75caa2a83f1a22ea080) Thanks [@tien](https://github.com/tien)! - Added experimental support for Ink! contracts.

## 0.41.0

### Minor Changes

- [#675](https://github.com/buffed-labs/reactive-dot/pull/675) [`bf36c59`](https://github.com/buffed-labs/reactive-dot/commit/bf36c594da0cf996cde4adb6d706d759f2f73ad3) Thanks [@tien](https://github.com/tien)! - Introduced an option to enable experimental Server-Side Rendering (SSR) optimizations.

## 0.40.4

### Patch Changes

- [#666](https://github.com/buffed-labs/reactive-dot/pull/666) [`2b632ff`](https://github.com/buffed-labs/reactive-dot/commit/2b632ff111610ca0505a4a1fbf59d03386c5a9b6) Thanks [@tien](https://github.com/tien)! - Removed artificial delay previously implemented as a workaround for a [Polkadot.js extension bug](https://github.com/polkadot-js/extension/issues/1475).

- [#664](https://github.com/buffed-labs/reactive-dot/pull/664) [`1a96cbe`](https://github.com/buffed-labs/reactive-dot/commit/1a96cbe51e4891733bb4497f18ea2341e68bf3ba) Thanks [@tien](https://github.com/tien)! - Improved performance by loading injected extension functionalities only when necessary.

## 0.40.2

### Patch Changes

- [#656](https://github.com/buffed-labs/reactive-dot/pull/656) [`c3e90bf`](https://github.com/buffed-labs/reactive-dot/commit/c3e90bf99df5ff42a5b4942d246d30c158e8f1f9) Thanks [@tien](https://github.com/tien)! - Fixed compatibility with the latest version of Polkadot-API.

## 0.40.0

### Patch Changes

- [#610](https://github.com/buffed-labs/reactive-dot/pull/610) [`98d1ded`](https://github.com/buffed-labs/reactive-dot/commit/98d1ded71b14a3faefe009412083775e91599a86) Thanks [@tien](https://github.com/tien)! - Renamed `ReactiveDotError` to `BaseError`.

- [#610](https://github.com/buffed-labs/reactive-dot/pull/610) [`d83ad3e`](https://github.com/buffed-labs/reactive-dot/commit/d83ad3e7b588b0bacdf6e4eed64f061d2af00fa0) Thanks [@tien](https://github.com/tien)! - For wrapper errors, use the original error message unless an overriding message is explicitly specified.

## 0.39.2

### Patch Changes

- [#599](https://github.com/buffed-labs/reactive-dot/pull/599) [`82177f4`](https://github.com/buffed-labs/reactive-dot/commit/82177f4b31f3fc3874f2538f346409d464e61769) Thanks [@tien](https://github.com/tien)! - Patched query builder type definitions.

## 0.38.1

### Patch Changes

- [#564](https://github.com/buffed-labs/reactive-dot/pull/564) [`35c0f4d`](https://github.com/buffed-labs/reactive-dot/commit/35c0f4daf554ab4845aaca88beaf3364e49d7936) Thanks [@tien](https://github.com/tien)! - Fixed optional storage entries arguments.

## 0.38.0

### Minor Changes

- [#562](https://github.com/buffed-labs/reactive-dot/pull/562) [`c741a7d`](https://github.com/buffed-labs/reactive-dot/commit/c741a7db3390984157c84e6bc6e127cdacddd9fa) Thanks [@tien](https://github.com/tien)! - Made the arguments array optional for queries with zero arguments.

## 0.37.0

### Minor Changes

- [#556](https://github.com/buffed-labs/reactive-dot/pull/556) [`d753bba`](https://github.com/buffed-labs/reactive-dot/commit/d753bbaf96a44965a93eccd6eb90fb0add416b70) Thanks [@tien](https://github.com/tien)! - Renamed query builder methods.

## 0.36.3

### Patch Changes

- [#547](https://github.com/buffed-labs/reactive-dot/pull/547) [`3958fe9`](https://github.com/buffed-labs/reactive-dot/commit/3958fe9ab2e8281632685eb72227c4052cc93a30) Thanks [@tien](https://github.com/tien)! - Fixed incorrect native token info when dealing with non-common chain's spec (array for `tokenSymbol` & `tokenDecimals`).

## 0.36.0

### Minor Changes

- [#538](https://github.com/buffed-labs/reactive-dot/pull/538) [`9304e56`](https://github.com/buffed-labs/reactive-dot/commit/9304e5624f4e3ba5d72a15258cad262ab315cf5f) Thanks [@tien](https://github.com/tien)! - Added option to enable Substrate Connect support.

### Patch Changes

- [#534](https://github.com/buffed-labs/reactive-dot/pull/534) [`2071712`](https://github.com/buffed-labs/reactive-dot/commit/207171252d45ce686d747b1709d76831e5a06198) Thanks [@tien](https://github.com/tien)! - Ensured each wallet is initialized only once.

## 0.34.0

### Patch Changes

- [#509](https://github.com/buffed-labs/reactive-dot/pull/509) [`dfd214b`](https://github.com/buffed-labs/reactive-dot/commit/dfd214b405355994fb37afb9a7d223fdaf21295f) Thanks [@tien](https://github.com/tien)! - Made `instructions` parameter optional in `Query` constructor.

- [#516](https://github.com/buffed-labs/reactive-dot/pull/516) [`91d8a77`](https://github.com/buffed-labs/reactive-dot/commit/91d8a771d557c25f18a1bd972eb16300e3705b3d) Thanks [@tien](https://github.com/tien)! - Added descriptive names to Symbols for better clarity.

## 0.33.0

### Minor Changes

- [#506](https://github.com/buffed-labs/reactive-dot/pull/506) [`b6c5cc7`](https://github.com/buffed-labs/reactive-dot/commit/b6c5cc7a9d4ba82b2d8c890cfcc569fe6703951f) Thanks [@tien](https://github.com/tien)! - Added `Query.concat` method for merging queries.

## 0.32.0

### Patch Changes

- Updated dependencies [[`7b6c493`](https://github.com/buffed-labs/reactive-dot/commit/7b6c493fabb3e81df0dccc3025ad7dd64ba4a9cc)]:
  - @reactive-dot/utils@0.10.0

## 0.31.0

### Minor Changes

- [#479](https://github.com/buffed-labs/reactive-dot/pull/479) [`776d1ef`](https://github.com/buffed-labs/reactive-dot/commit/776d1ef29777550fdcec83b11713e53a68624d14) Thanks [@tien](https://github.com/tien)! - Added "Polkadot Coretime" to wellknown chains.

## 0.30.0

### Minor Changes

- [#453](https://github.com/buffed-labs/reactive-dot/pull/453) [`821f21b`](https://github.com/buffed-labs/reactive-dot/commit/821f21b511b4c7ef8b0eff2e3f9eb0a3addb36ac) Thanks [@tien](https://github.com/tien)! - Added `watchEntries` support; `readStorageEntries` now creates a subscription and no longer requires manual refresh.

### Patch Changes

- [#365](https://github.com/buffed-labs/reactive-dot/pull/365) [`dcc8c24`](https://github.com/buffed-labs/reactive-dot/commit/dcc8c241c7543bebecdc73438f627d6f7fd0610e) Thanks [@tien](https://github.com/tien)! - Moved core actions to internal exports.

## 0.29.0

### Minor Changes

- [#411](https://github.com/buffed-labs/reactive-dot/pull/411) [`6e1ded0`](https://github.com/buffed-labs/reactive-dot/commit/6e1ded07876d9ee6471830038e8910c369f14a4b) Thanks [@71walceli](https://github.com/71walceli)! - Added "Paseo People" to light client well-known parachains.

## 0.27.1

### Patch Changes

- [#382](https://github.com/buffed-labs/reactive-dot/pull/382) [`aeef030`](https://github.com/buffed-labs/reactive-dot/commit/aeef0303347668d7c53de3373f581b95a723fb17) Thanks [@tien](https://github.com/tien)! - Fixed PJS wallet detection, this is a workaround for the following [issue](https://github.com/polkadot-js/extension/issues/1475).

## 0.27.0

### Minor Changes

- [#368](https://github.com/buffed-labs/reactive-dot/pull/368) [`f1d984f`](https://github.com/buffed-labs/reactive-dot/commit/f1d984f0347de0928e09ab9b99a9989586031d52) Thanks [@tien](https://github.com/tien)! - Added SubstrateConnect integration.

## 0.26.2

### Patch Changes

- [#346](https://github.com/buffed-labs/reactive-dot/pull/346) [`a3da0de`](https://github.com/buffed-labs/reactive-dot/commit/a3da0de4207499ff6e766f7affd08d086803a897) Thanks [@tien](https://github.com/tien)! - Fixed wallet aggregation bug when aggregation happens asynchronously.

## 0.26.1

### Patch Changes

- [#339](https://github.com/buffed-labs/reactive-dot/pull/339) [`a638b48`](https://github.com/buffed-labs/reactive-dot/commit/a638b48e595f5dd6d87141f12f62616b507f3ed8) Thanks [@tien](https://github.com/tien)! - Refactored wallet aggregation logic.

- [#337](https://github.com/buffed-labs/reactive-dot/pull/337) [`e5c37d0`](https://github.com/buffed-labs/reactive-dot/commit/e5c37d04fbdf5515c09f65875c4f8f6c6c1c5f01) Thanks [@tien](https://github.com/tien)! - Moved `initializeWallets` function to top-level exports.

## 0.26.0

### Minor Changes

- [#334](https://github.com/buffed-labs/reactive-dot/pull/334) [`ee5d6a3`](https://github.com/buffed-labs/reactive-dot/commit/ee5d6a305cd1bfe9213ea82d5c81d0e1bcce2dfa) Thanks [@tien](https://github.com/tien)! - Added `useNativeToken` and `useSpendableBalance` composables.

## 0.25.1

### Patch Changes

- [#318](https://github.com/buffed-labs/reactive-dot/pull/318) [`ed4e82d`](https://github.com/buffed-labs/reactive-dot/commit/ed4e82d3eed9499f0c59d3bb1fceb151ce1e305a) Thanks [@tien](https://github.com/tien)! - Ensure stable reference of wallets coming from wallet provider.

## 0.24.1

### Patch Changes

- [#306](https://github.com/buffed-labs/reactive-dot/pull/306) [`bbda9ef`](https://github.com/buffed-labs/reactive-dot/commit/bbda9ef093e87a96d6eb23ba51464ec02ba08bb2) Thanks [@tien](https://github.com/tien)! - Simplified wallet provider interface.

- [#304](https://github.com/buffed-labs/reactive-dot/pull/304) [`0958ce1`](https://github.com/buffed-labs/reactive-dot/commit/0958ce1f6c06f6e163b4ce6e8f012caf4fb34040) Thanks [@tien](https://github.com/tien)! - Added default implementation for `Wallet.getAccounts`.

- [#307](https://github.com/buffed-labs/reactive-dot/pull/307) [`13c5dae`](https://github.com/buffed-labs/reactive-dot/commit/13c5dae1a0ca5500d798ac31e3a8b81bc9d3f78a) Thanks [@tien](https://github.com/tien)! - Renamed `PrefixedStorage` to `Storage`.

## 0.24.0

### Minor Changes

- [#293](https://github.com/buffed-labs/reactive-dot/pull/293) [`2bdab49`](https://github.com/buffed-labs/reactive-dot/commit/2bdab4925c736a81245936fb4034984dd4211f23) Thanks [@tien](https://github.com/tien)! - BREAKING: renamed "aggregator" to "provider".

## 0.23.0

### Patch Changes

- [#286](https://github.com/buffed-labs/reactive-dot/pull/286) [`fccd977`](https://github.com/buffed-labs/reactive-dot/commit/fccd9778365d71a6903560513455f033fded0b4c) Thanks [@tien](https://github.com/tien)! - Fixed string key generation of binary data.

## 0.22.0

### Minor Changes

- [#279](https://github.com/buffed-labs/reactive-dot/pull/279) [`02b5633`](https://github.com/buffed-labs/reactive-dot/commit/02b56338948e32463b9b3e682340a25920386d91) Thanks [@tien](https://github.com/tien)! - Added target chains option to define default chains for providing type definitions.

## 0.21.0

### Minor Changes

- [#273](https://github.com/buffed-labs/reactive-dot/pull/273) [`2c30634`](https://github.com/buffed-labs/reactive-dot/commit/2c3063493977b78c95312b507332cced8296e66b) Thanks [@tien](https://github.com/tien)! - Added a helper function to easily define config.

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

## 0.19.0

### Minor Changes

- [#245](https://github.com/buffed-labs/reactive-dot/pull/245) [`98bb09e`](https://github.com/buffed-labs/reactive-dot/commit/98bb09e623805cf772dd42ce1ed144f569a71bae) Thanks [@tien](https://github.com/tien)! - Added Vue integration.

### Patch Changes

- Updated dependencies [[`98bb09e`](https://github.com/buffed-labs/reactive-dot/commit/98bb09e623805cf772dd42ce1ed144f569a71bae)]:
  - @reactive-dot/utils@0.9.0

## 0.18.0

### Minor Changes

- [#260](https://github.com/buffed-labs/reactive-dot/pull/260) [`42d6d34`](https://github.com/buffed-labs/reactive-dot/commit/42d6d343bb299d56b14a18dd0d7e54c90d20c1b6) Thanks [@tien](https://github.com/tien)! - Added support for specifying DApp name used by injected wallets.

## 0.16.5

### Patch Changes

- Updated dependencies [[`cfcf0e6`](https://github.com/buffed-labs/reactive-dot/commit/cfcf0e6a60862565987b9763ca6f96c1b159c839)]:
  - @reactive-dot/utils@0.8.1

## 0.16.0

### Minor Changes

- [#168](https://github.com/buffed-labs/reactive-dot/pull/168) [`1c4fdee`](https://github.com/buffed-labs/reactive-dot/commit/1c4fdee520b066254c48ba58562c50d75473da69) Thanks [@tien](https://github.com/tien)! - Added Ledger wallet integration.

## 0.15.0

### Minor Changes

- [#199](https://github.com/buffed-labs/reactive-dot/pull/199) [`6370689`](https://github.com/buffed-labs/reactive-dot/commit/63706898748890dc4f16a2469deafbd36dedf9b5) Thanks [@tien](https://github.com/tien)! - Added support for formatting addresses based on their chain's SS58 format.

## 0.14.0

### Minor Changes

- [#186](https://github.com/buffed-labs/reactive-dot/pull/186) [`a215f26`](https://github.com/buffed-labs/reactive-dot/commit/a215f26b3d22feea611ede32ebdbaace4adf7503) Thanks [@tien](https://github.com/tien)! - BREAKING: Updated all variables and types to use the library’s full name.

## 0.13.0

### Minor Changes

- [#174](https://github.com/buffed-labs/reactive-dot/pull/174) [`1468d69`](https://github.com/buffed-labs/reactive-dot/commit/1468d69091e4aa96886edbf3272b0b3df21a4a4a) Thanks [@tien](https://github.com/tien)! - BREAKING: switched to camelCase for exported symbols.

- [#172](https://github.com/buffed-labs/reactive-dot/pull/172) [`46abe19`](https://github.com/buffed-labs/reactive-dot/commit/46abe19dd85a54385e480941baae2275603718e9) Thanks [@tien](https://github.com/tien)! - BREAKING: moved internal types to subpath export.

## 0.12.0

### Minor Changes

- [#149](https://github.com/buffed-labs/reactive-dot/pull/149) [`21ec7d1`](https://github.com/buffed-labs/reactive-dot/commit/21ec7d14185ac02c4f48e365db2932eae324aec8) Thanks [@tien](https://github.com/tien)! - BREAKING: Moved WalletConnect adapter to a standalone package.

## 0.10.0

### Patch Changes

- [#143](https://github.com/buffed-labs/reactive-dot/pull/143) [`a845ca5`](https://github.com/buffed-labs/reactive-dot/commit/a845ca5646e62f205db0949474376916e93093e9) Thanks [@tien](https://github.com/tien)! - Fixed permanent suspense when no wallets are available.

## 0.9.0

### Patch Changes

- [#129](https://github.com/buffed-labs/reactive-dot/pull/129) [`255c1c8`](https://github.com/buffed-labs/reactive-dot/commit/255c1c8d3dd7ce39977dbd02535234b38033aa77) Thanks [@tien](https://github.com/tien)! - Fixed incorrect atom type when querying with block hash.

## 0.8.0

### Minor Changes

- [#116](https://github.com/buffed-labs/reactive-dot/pull/116) [`c2c3a61`](https://github.com/buffed-labs/reactive-dot/commit/c2c3a617d54cc1db9ed4bfec276d46044e8100db) Thanks [@tien](https://github.com/tien)! - Added a function to retrieve the best or finalized block and introduced an experimental feature for extracting extrinsics from a block.

- [#105](https://github.com/buffed-labs/reactive-dot/pull/105) [`336b208`](https://github.com/buffed-labs/reactive-dot/commit/336b208627776e85f9173bcc36e1a86e6d389299) Thanks [@tien](https://github.com/tien)! - Add source and declaration maps for improved debugging and type checking.

- [#120](https://github.com/buffed-labs/reactive-dot/pull/120) [`6ba27d5`](https://github.com/buffed-labs/reactive-dot/commit/6ba27d5641ca82d1f65fba7c4a9b4938627f0911) Thanks [@dependabot](https://github.com/apps/dependabot)! - Increased required PAPI version to `^1.0.0`.

### Patch Changes

- Updated dependencies [[`336b208`](https://github.com/buffed-labs/reactive-dot/commit/336b208627776e85f9173bcc36e1a86e6d389299)]:
  - @reactive-dot/utils@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [[`ec6ef50`](https://github.com/buffed-labs/reactive-dot/commit/ec6ef50184fbb854026c16b1455dd09da4178272)]:
  - @reactive-dot/utils@0.7.0

## 0.5.0

### Minor Changes

- [#74](https://github.com/buffed-labs/reactive-dot/pull/74) [`294d7f0`](https://github.com/buffed-labs/reactive-dot/commit/294d7f07b4e622eac94c55c43c400d8eae34ad01) Thanks [@tien](https://github.com/tien)! - **BREAKING**: move `WalletConnect` logic to dedicated subpath export.

## 0.4.0

### Patch Changes

- [#56](https://github.com/buffed-labs/reactive-dot/pull/56) [`18cb167`](https://github.com/buffed-labs/reactive-dot/commit/18cb167af54c57aa3d6af999e621618d10bbaac5) Thanks [@tien](https://github.com/tien)! - Fix query crashing when specifying the `at` option.

- Updated dependencies []:
  - @reactive-dot/utils@0.4.0

## 0.3.1

### Patch Changes

- [#43](https://github.com/buffed-labs/reactive-dot/pull/43) [`be24bc6`](https://github.com/buffed-labs/reactive-dot/commit/be24bc60c87fc4e35c68aa9412cdb225d4c9b895) Thanks [@tien](https://github.com/tien)! - Fix incorrect return type from `useAccounts` hook.

- Updated dependencies []:
  - @reactive-dot/utils@0.3.1

## 0.3.0

### Minor Changes

- [#22](https://github.com/buffed-labs/reactive-dot/pull/22) [`eea304b`](https://github.com/buffed-labs/reactive-dot/commit/eea304b1fd1ddaa31691f01cbc4e03d998bb4fdf) Thanks [@tien](https://github.com/tien)! - Add source wallet to account.

### Patch Changes

- [#36](https://github.com/buffed-labs/reactive-dot/pull/36) [`dfa501f`](https://github.com/buffed-labs/reactive-dot/commit/dfa501f0d6e26fc010f50ca5b67ec8f0675f9c9a) Thanks [@tien](https://github.com/tien)! - Use `^` (compatible) version range.

- Updated dependencies [[`dfa501f`](https://github.com/buffed-labs/reactive-dot/commit/dfa501f0d6e26fc010f50ca5b67ec8f0675f9c9a)]:
  - @reactive-dot/utils@0.3.0

## 0.2.0

### Minor Changes

- [#14](https://github.com/buffed-labs/reactive-dot/pull/14) [`11b17b0`](https://github.com/buffed-labs/reactive-dot/commit/11b17b0b7819f44ebca5c08ba2e11d36dde5f8f7) Thanks [@tien](https://github.com/tien)! - Support for Polkadot-API version 0.11.2

### Patch Changes

- Updated dependencies []:
  - @reactive-dot/utils@0.2.0

## 0.1.1

### Patch Changes

- [#11](https://github.com/buffed-labs/reactive-dot/pull/11) [`7446493`](https://github.com/buffed-labs/reactive-dot/commit/7446493ddae1e4bc9a216736c0fd5273530f2bce) Thanks [@tien](https://github.com/tien)! - Fix changeset publish does not resolves Yarn workspace dependencies

- Updated dependencies [[`7446493`](https://github.com/buffed-labs/reactive-dot/commit/7446493ddae1e4bc9a216736c0fd5273530f2bce)]:
  - @reactive-dot/utils@0.1.1

## 0.1.0

### Minor Changes

- [`490a6e1`](https://github.com/buffed-labs/reactive-dot/commit/490a6e16be5031ddca2d9eecb184aa14f1cbd508) Thanks [@tien](https://github.com/tien)! - Initial release

### Patch Changes

- Updated dependencies [[`490a6e1`](https://github.com/buffed-labs/reactive-dot/commit/490a6e16be5031ddca2d9eecb184aa14f1cbd508)]:
  - @reactive-dot/utils@0.1.0
