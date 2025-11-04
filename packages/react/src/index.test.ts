import * as exports from "./index.js";
import { expect, it } from "vitest";

it("should match inline snapshot", () =>
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "Await",
      "QueryRenderer",
      "ChainProvider",
      "ReactiveDotProvider",
      "QueryOptionsProvider",
      "SignerProvider",
      "useAccounts",
      "useSpendableBalance",
      "useSpendableBalances",
      "useBlock",
      "useChainId",
      "useChainIds",
      "useChainSpecData",
      "useClient",
      "useConfig",
      "useContractEventListener",
      "useContractMutation",
      "useMutationEffect",
      "useMutation",
      "useNativeTokenAmountFromNumber",
      "useNativeTokenAmountFromPlanck",
      "usePromiseState",
      "usePromises",
      "useQueryErrorResetter",
      "useQueryLoader",
      "useQueryRefresher",
      "useLazyLoadQuery",
      "useLazyLoadQueryWithRefresh",
      "useSigner",
      "useStore",
      "useTypedApi",
      "useWalletConnector",
      "useWalletDisconnector",
      "useConnectedWallets",
      "useWallets",
    ]
  `));
