<script setup lang="ts">
import { solidityStorage } from "./config.js";
import { useQuery } from "@reactive-dot/vue";

const { address } = defineProps<{
  address: string;
}>();

const { data: value } = await useQuery((builder) =>
  builder.contract(solidityStorage, address, (builder) =>
    builder.func("retrieve"),
  ),
);
</script>

<template>
  <article>
    <h3>Storage</h3>
    <p>Value: {{ value }}</p>
  </article>
</template>
