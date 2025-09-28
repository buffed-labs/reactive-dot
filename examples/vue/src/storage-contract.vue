<script setup lang="ts">
import AccountGuard from "./account-guard.vue";
import { solidityStorage } from "./config.js";
import StorageContractMutation from "./storage-contract-mutation.vue";
import { useQuery } from "@reactive-dot/vue";

const { address } = defineProps<{
  address: string;
}>();

const { data: value, refresh } = await useQuery((builder) =>
  builder.contract(solidityStorage, address, (builder) =>
    builder.func("retrieve"),
  ),
);
</script>

<template>
  <article>
    <h3>Storage</h3>
    <p>Value: {{ value }}</p>
    <AccountGuard
      ><StorageContractMutation :address="address" @set-storage="refresh()"
    /></AccountGuard>
  </article>
</template>
