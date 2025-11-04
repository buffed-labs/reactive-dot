<script setup lang="ts">
import StorageContract from "./storage-contract.vue";
import { provideChain } from "@reactive-dot/vue";

provideChain("passet_hub");
</script>

<template>
  <section>
    <h2>Solidity contracts</h2>
    <StorageContract address="0xF919bfbEa8f4Aad2126C7e2a4a91ba06c0cb1462" />
  </section>
</template>
