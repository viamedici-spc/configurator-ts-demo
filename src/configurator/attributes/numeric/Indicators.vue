<template>
  <span>.</span>
  <span>
    {{ `range [${result.attribute.range.min}; ${result.attribute.range.max}]` }}</span
  >
  <span>.</span>
  <span class="span-decimal">
    {{ result.attribute.decimalPlaces }} decimal places.
  </span>
</template>

<script setup lang="ts">

import { useActiveAttribute } from "../AttributeItem.vue";
import { useNumericAttributeRef } from "../../../utils/useAttributes";

const activeAttribute = useActiveAttribute();
if(!activeAttribute) throw new Error("Active Attribute is undefined in Numeric Component");


const result = useNumericAttributeRef(activeAttribute.value)
</script>

<style scoped>
.span-decimal {
  color: var(--color-selection-mode);
}
</style>
