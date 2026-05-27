<script setup lang="ts">

import { Value, AllowedValue } from "./CommonValueSelection.vue";

interface Props {
  value: Value | AllowedValue;
}

defineProps<Props>();

</script>

<template>
  <option :value="value.id">
    {{
      "isImplicit" in value && value.isImplicit ? ("isImmutable" in value && value.isImmutable ? "Fixed: " : "Implicit: ") : ""
    }}
    {{ value.name ?? value.id }}
  </option>
</template>
