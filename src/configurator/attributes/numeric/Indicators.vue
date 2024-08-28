<script setup lang="ts">
import {useActiveAttribute, useConfiguration} from "../../../utils/Contexts";
import {computed} from "vue";
import {ConfigurationInterpreter} from "@viamedici-spc/configurator-ts";

const activeAttribute = useActiveAttribute();
const configuration = useConfiguration();

const attribute = computed(() => {
  const attributeId = activeAttribute.value;
  const attribute = ConfigurationInterpreter.getNumericAttribute(configuration.value, attributeId);
  if (attribute == undefined) {
    console.error("Numeric attribute not found with id", attributeId)
    throw new Error("Numeric attribute not found");
  }

  return attribute;
});

</script>

<template>
  <span :style="{color: 'var(--color-allowed-values)'}">{{ `range [${attribute.range.min}; ${attribute.range.max}]` }}</span>
  <span> · </span>
  <span :style="{color: 'var(--color-selection-mode)'}">{{ attribute.decimalPlaces }} decimal places</span>
</template>
