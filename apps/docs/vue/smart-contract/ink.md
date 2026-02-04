---
sidebar_position: 2
---

# Ink!

ReactiveDOT works with [Ink! contracts](https://use.ink) on chains with PolkaVM support, such as [Polkadot Asset Hub](https://polkadot.com/platform/hub).

:::warning

Ink! contract support is deprecated. See [this post](https://forum.polkadot.network/t/discontinuation-of-ink-rust-smart-contract-language/16849) for more information.

:::

:::tip

If you're new to ReactiveDOT, we strongly recommend starting with the [“Getting started guide”](/vue/category/getting-started). This guide covers essential topics such as connecting to a blockchain, setting up wallets, querying data, and handling errors effectively.

:::

## Defining contract

ReactiveDOT utilizes Ink! [metadata](https://use.ink/docs/v6/basics/metadata/ink) to interact with and provide types for contracts. Metadata files typically end with `.json` or `.contract` and can be obtained by [compiling](https://use.ink/docs/v6/getting-started/building-your-contract) the contract yourself or from the contract developers.

Once you've obtained the metadata file(s), run the following command to convert it to TypeScript-friendly metadata:

```sh
npx papi ink add "/path/to/metadata.(json|contract)" --key "myContract"
```

:::info

For more information on contract metadata type generation, refer to this [documentation](https://papi.how/ink#codegen) provided by [Polkadot-API](https://papi.how).

:::

The contract metadata can now be imported and configured as follows:

```ts title="contracts.ts"
import { contracts } from "@polkadot-api/descriptor";
import { defineContract } from "@reactive-dot/core";

export const myContract = defineContract({
  type: "ink",
  descriptor: contracts.myContract,
});
```

## Reading contract data

The [`useQuery`](/vue/api/vue/functions/useQuery) composable with [`Query.contract`](/vue/api/core/index/classes/Query#contract) instruction allows you to read data on a smart contract, from [storage](https://use.ink/docs/v6/basics/storing-values) or a [view (read-only) message](https://use.ink/docs/v6/basics/reading-values#contract-functions). They can only read the state of the contract, and cannot make any changes to it.

```vue title="Component.vue"
<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { useQuery } from "@reactive-dot/vue";
import { toRefs, toValue } from "vue";

const { data } = await useQuery((builder) =>
  builder.contract(myContract, CONTRACT_ADDRESS, (builder) =>
    builder
      // Root storage
      .rootStorage()
      // Nested storage
      .storage("balance", ACCOUNT_ADDRESS)
      // Readonly message
      .message("free_balance", ACCOUNT_ADDRESS),
  ),
);

const [metadata, balance, freeBalance] = toRefs(data);
</script>

<template>
  <div>
    <p>Metadata: {{ JSON.stringify(metadata) }}</p>
    <p>Balance: {{ balance }}</p>
    <p>Free Balance: {{ freeBalance }}</p>
  </div>
</template>
```

### Multi query

Similar to chain [multi-query](/vue/getting-started/query#fetching-multiple-data), the `contracts`, `storages`, and `messages` instructions enable reading multiple pieces of data in parallel.

```vue title="MultiQueryComponent.vue"
<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { useQuery } from "@reactive-dot/vue";

const { data } = useQuery((builder) =>
  builder.contracts(
    myContract,
    [CONTRACT_ADDRESS_1, CONTRACT_ADDRESS_2],
    (builder) =>
      builder
        .storage("symbol")
        .storages("balance", [ACCOUNT_1_ADDRESS, ACCOUNT_2_ADDRESS])
        .messages("free_balance", [ACCOUNT_1_ADDRESS, ACCOUNT_2_ADDRESS]),
  ),
);
</script>

<template>
  <div>
    <div v-for="([symbol, balances, freeBalances], index) in data" :key="index">
      <p>Symbol: {{ symbol }}</p>
      <p>Balances: {{ balances.join(", ") }}</p>
      <p>Free Balances: {{ freeBalances.join(", ") }}</p>
    </div>
  </div>
</template>
```

## Writing to contract

The [`useContractMutation`](/vue/api/vue/functions/useContractMutation) composable allows you to mutate data on a smart contract, from a payable or nonpayable (write) message.

```vue title="WriteComponent.vue"
<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { idle, MutationError, pending } from "@reactive-dot/core";
import { useContractMutation } from "@reactive-dot/vue";

const { status, execute } = useContractMutation((mutate) =>
  mutate(myContract, CONTRACT_ADDRESS, "mint", {
    data: { id: 1 },
    value: 10_000n,
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
<script setup lang="ts">
import { myContract } from "./contracts.ts";
import { watchContractEvent } from "@reactive-dot/vue";

watchContractEvent(myContract, CONTRACT_ADDRESS, "Transfer", (event) => {
  console.log("block", event.block.number);
  console.log("from", event.data.from);
  console.log("to", event.data.to);
  console.log("value", event.data.value);
});
</script>
```
