<script setup lang="ts">
import StorageContract from "./storage-contract.vue";
import { provideChain } from "@reactive-dot/vue";

provideChain("passet_hub");
</script>

<template>
  <section>
    <h2>Solidity contracts</h2>
    <StorageContract address="0xf9643E033D4210b477C6b47A8c5d21a275eE42C8" />
  </section>
</template>
