<script setup lang="ts">
import {computed} from "vue";
import {AttributeInterpreter, ConfigurationInterpreter} from "@viamedici-spc/configurator-ts";
import {useActiveAttribute, useConfiguration} from "../../../utils/Contexts";

const activeAttribute = useActiveAttribute();
const configuration = useConfiguration();

const model = computed(() => {
  const attributeId = activeAttribute.value;
  const attribute = ConfigurationInterpreter.getChoiceAttribute(configuration.value, attributeId);
  if (attribute == undefined) {
    console.error("Choice attribute not found with id", attributeId)
    throw new Error("Choice attribute not found");
  }

  return {
    isMandatory: AttributeInterpreter.isMandatory(attribute),
    isMultiSelect: AttributeInterpreter.isChoiceAttributeMultiSelect(attribute),
    allowedValues: AttributeInterpreter.getAllowedChoiceValues(attribute)
  }
});

</script>

<template>
  <span :style="{ color: model.isMandatory ? 'var(--color-mandatory)': 'var(--color-optional)' }">
    {{ model.isMandatory ? 'mandatory' : 'optional' }}
  </span>
  <span> · </span>
  <span :style="{ color: 'var(--color-selection-mode)' }">
    {{ model.isMultiSelect ? 'multi-select' : 'single-select' }}
  </span>
  <span> · </span>
  <span :style="{ color: 'var(--color-allowed-values)' }">
    {{ `${model.allowedValues.length} allowed values` }}
  </span>
</template>
