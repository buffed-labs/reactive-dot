<script setup lang="ts">
import FlipperContract from "./flipper-contract.vue";
import Psp22Token from "./psp22-token.vue";
import { provideChain } from "@reactive-dot/vue";

provideChain("pop_testnet");
</script>

<template>
  <section>
    <h2>Ink contracts</h2>
    <Psp22Token address="0xE7Fc69D1cE67F2902845F5Ffd2b454597ded5547" />
    <FlipperContract address="0xdeb2d925a5848fce3f296d329ac09a403c24fa4a" />
  </section>
</template>
