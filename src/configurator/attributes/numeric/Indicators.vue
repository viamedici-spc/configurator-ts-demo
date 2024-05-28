<template>
  <span>.</span>
  <span>
    {{ `range [${attribute.range.min}; ${attribute.range.max}]` }}</span
  >
  <span>.</span>
  <span class="span-decimal">
    {{ attribute.decimalPlaces }} decimal places.
  </span>
</template>

<script setup lang="ts">
import { useActiveAttribute } from "../AttributeItem.vue";
import { useNumericAttribute } from "../../../utils/useAttributes";

const activeAttribute = useActiveAttribute();
const { attribute } = useNumericAttribute(activeAttribute!);
</script>

<style scoped>
.span-decimal {
  color: var(--color-selection-mode);
}
</style>
