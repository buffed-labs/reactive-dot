---
sidebar_position: 2
---

# Solidity

ReactiveDOT works with [Solidity contracts](https://soliditylang.org/) on chains with PolkaVM support, such as [Polkadot Asset Hub](https://polkadot.com/platform/hub).

:::warning

Contract support via PolkaVM on Polkadot is still in development.

:::

:::tip

If you're new to ReactiveDOT, we strongly recommend starting with the [“Getting started guide”](/react/category/getting-started). This guide covers essential topics such as connecting to a blockchain, setting up wallets, querying data, and handling errors effectively.

:::

## Defining contract

ReactiveDOT can infer types based on [ABI](https://docs.soliditylang.org/en/v0.8.24/abi-spec.html#json) and [EIP-712](https://eips.ethereum.org/EIPS/eip-712) Typed Data definitions (powered by [ABIType](https://abitype.dev/)), giving you full end-to-end type-safety from your contracts to your frontend and incredible developer experience (e.g. autocomplete ABI function names and catch misspellings, strongly-typed ABI function arguments, etc.).

For this to work, define your contract using its ABI, as shown below:

```ts title="contracts.ts"
import { contracts } from "@polkadot-api/descriptor";
import { defineContract } from "@reactive-dot/core";

export const myContract = defineContract({
  type: "solidity",
  abi: [
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
    {
      type: "function",
      name: "totalSupply",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "supply", type: "uint256" }],
    },
  ],
});
```

## Reading contract data

The [`useLazyLoadQuery`](/react/api/react/functions/useLazyLoadQuery) hook with [`Query.contract`](/react/api/core/index/classes/Query#contract) instruction allows you to read data on a smart contract, from a `view` or `pure` (read-only) function. They can only read the state of the contract, and cannot make any changes to it.

```tsx title="Component.tsx"
import { myContract } from "./contracts.ts";
import { useLazyLoadQuery } from "@reactive-dot/react";

function Component() {
  const [totalSupply, balance] = useLazyLoadQuery((builder) =>
    builder.contract(myContract, CONTRACT_ADDRESS, (builder) =>
      builder.func("totalSupply").func("balanceOf", [SOME_ADDRESS]),
    ),
  );

  return (
    <div>
      <p>Total supply: {totalSupply.toLocaleString()}</p>
      <p>Balance: {balance.toLocaleString()}</p>
    </div>
  );
}
```

### Multi query

Similar to chain [multi-query](/react/getting-started/query#fetching-multiple-data), the `contracts` & `funcs` instructions enable reading multiple pieces of data in parallel.

```tsx title="MultiQueryComponent.tsx"
import { myContract } from "./contracts.ts";
import { useLazyLoadQuery } from "@reactive-dot/react";

function Component() {
  const contracts = [CONTRACT_ADDRESS_1, CONTRACT_ADDRESS_2] as const;

  const results = useLazyLoadQuery((builder) =>
    builder.contracts(myContract, contracts, (builder) =>
      builder
        .func("totalSupply")
        .funcs("balanceOf", [[ACCOUNT_1_ADDRESS], [ACCOUNT_2_ADDRESS]]),
    ),
  );

  return (
    <div>
      {results.map(([totalSupply, balances], index) => (
        <div key={index}>
          <p>Contract address: {contracts[index]}</p>
          <p>Total supply: {totalSupply}</p>
          <p>Balances: {balances.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
```

## Writing to contract

The [`useContractMutation`](/react/api/react/functions/useContractMutation) hook allows you to mutate data on a smart contract, from a payable or nonpayable (write) message.

```tsx title="WriteComponent.tsx"
import {
  idle,
  MutationError,
  pending,
  defineContract,
} from "@reactive-dot/core";
import { useContractMutation } from "@reactive-dot/react";

const myContract = defineContract({
  type: "solidity",
  abi: [
    {
      name: "mint",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [{ internalType: "uint32", name: "tokenId", type: "uint32" }],
      outputs: [],
    },
  ],
});

function Component() {
  const [status, mint] = useContractMutation((mutate) =>
    mutate(myContract, CONTRACT_ADDRESS, "mint", {
      args: [1n],
    }),
  );

  return (
    <div>
      <button onClick={() => mint()}>Mint</button>
      {(() => {
        switch (status) {
          case idle:
            return <p>No transaction submitted yet.</p>;
          case pending:
            return <p>Submitting transaction...</p>;
          default:
            if (status instanceof MutationError) {
              return <p>Error submitting transaction!</p>;
            }

            return (
              <p>
                Submitted tx with hash: {status.txHash}, current state:{" "}
                {status.type}
              </p>
            );
        }
      })()}
    </div>
  );
}
```
