<script setup lang="ts">

import {Value} from "./CommonValueSelection.vue";

interface Props {
  value: Value;
}

defineProps<Props>();

</script>

<template>
  <option :value="value.id">
    {{ value.isImplicit ? "Implicit: " : "" }}
    {{ value.name ?? value.id }}
  </option>
</template>
