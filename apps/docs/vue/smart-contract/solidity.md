---
sidebar_position: 2
---

# Solidity

ReactiveDOT works with [Solidity contracts](https://soliditylang.org/) on chains with PolkaVM support, such as [Polkadot Asset Hub](https://polkadot.com/platform/hub).

:::warning

Contract support via PolkaVM on Polkadot is still in development.

:::

:::tip

If you're new to ReactiveDOT, we strongly recommend starting with the [“Getting started guide”](/vue/category/getting-started). This guide covers essential topics such as connecting to a blockchain, setting up wallets, querying data, and handling errors effectively.

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

The [`useQuery`](/vue/api/vue/functions/useQuery) composable with [`Query.contract`](/vue/api/core/index/classes/Query#contract) instruction allows you to read data on a smart contract, from a `view` or `pure` (read-only) function. They can only read the state of the contract, and cannot make any changes to it.

```vue title="Component.vue"
<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { useQuery } from "@reactive-dot/vue";
import { toRefs, toValue } from "vue";

const { data } = await useQuery((builder) =>
  builder.contract(myContract, CONTRACT_ADDRESS, (builder) =>
    builder.func("totalSupply").func("balanceOf", [SOME_ADDRESS]),
  ),
);

const [totalSupply, balanceOf] = toRefs(data);
</script>

<template>
  <div>
    <p>Total supply: {{ totalSupply.toLocaleString() }}</p>
    <p>Balance: {{ balance.toLocaleString() }}</p>
  </div>
</template>
```

### Multi query

Similar to chain [multi-query](/vue/getting-started/query#fetching-multiple-data), the `contracts` & `funcs` instructions enable reading multiple pieces of data in parallel.

```vue title="MultiQueryComponent.vue"
<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { useQuery } from "@reactive-dot/vue";

const { data } = useQuery((builder) =>
  builder.contracts(myContract, contracts, (builder) =>
    builder
      .func("totalSupply")
      .funcs("balanceOf", [[ACCOUNT_1_ADDRESS], [ACCOUNT_2_ADDRESS]]),
  ),
);
</script>

<template>
  <div>
    <div v-for="([totalSupply, balances], index) in data" :key="index">
      <p>Contract address: {contracts[index]}</p>
      <p>Total supply: {totalSupply}</p>
      <p>Balances: {balances.join(", ")}</p>
    </div>
  </div>
</template>
```

## Writing to contract

The [`useContractMutation`](/vue/api/vue/functions/useContractMutation) composable allows you to mutate data on a smart contract, from a payable or nonpayable (write) message.

```vue title="WriteComponent.vue"
<script lang="ts">
import { defineContract } from "@reactive-dot/core";

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
</script>

<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { idle, MutationError, pending } from "@reactive-dot/core";
import { useContractMutation } from "@reactive-dot/vue";

const { status, execute } = useContractMutation((mutate) =>
  mutate(myContract, CONTRACT_ADDRESS, "mint", {
    args: [1n],
  }),
);
</script>

<template>
  <button @click="execute()">Mint</button>
  <div v-if="status === 'idle'">No transaction submitted yet</div>
  <div v-else-if="status === 'pending'">Submitting transaction...</div>
  <div v-else-if="status === 'error'">Error submitting transaction!</div>
  <div v-else>
    Submitted tx with hash: {{ status.txHash }}, with the current state of:
    {{ remarkState.type }}
  </div>
</template>
```

## Listening to contract events

The [`watchContractEvent`](/vue/api/vue/functions/watchContractEvent) composable allows you to subscribe to and handle events emitted by a smart contract in real time. This is especially useful for monitoring state changes or user interactions on the blockchain. By listening to specific events, you can trigger actions or update your application's state dynamically based on the event data.

```vue title="EventListenerComponent.vue"
<script lang="ts">
import { defineContract } from "@reactive-dot/core";

const myContract = defineContract({
  type: "solidity",
  abi: [
    // ...
    {
      name: "Transfer",
      type: "event",
      inputs: [
        { name: "from", type: "address", indexed: true },
        { name: "to", type: "address", indexed: true },
        { name: "value", type: "uint256" },
      ],
    },
  ],
});
</script>

<script setup lang="ts">
import { watchContractEvent } from "@reactive-dot/vue";

watchContractEvent(myContract, CONTRACT_ADDRESS, "Transfer", (event) => {
  console.log("block", event.block.number);
  console.log("from", event.data.from);
  console.log("to", event.data.to);
  console.log("value", event.data.value);
});
</script>
```
