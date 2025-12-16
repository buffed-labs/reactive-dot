<script setup lang="ts">
import { solidityStorage } from "./config.js";
import { useContractMutation } from "@reactive-dot/vue";
import { watchEffect } from "vue";

const { address } = defineProps<{
  address: string;
}>();

const emit = defineEmits<{ (e: "set-storage"): void }>();

const value = defineModel<string>({ default: "" });

const { execute, status, data } = useContractMutation((mutate, value: bigint) =>
  mutate(solidityStorage, address, "store", { args: [value] }),
);

watchEffect(() => {
  if (status.value === "success" && data.value?.type === "finalized") {
    emit("set-storage");
  }
});
</script>

<template>
  <label>
    New Number:
    <input v-model="value" type="number" />
    <button type="button" @click="execute({ input: BigInt(value) })">
      Submit
    </button>
  </label>
</template>
