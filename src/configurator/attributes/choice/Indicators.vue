<template>
    <div>
      <span v-if="isMandatory" :style="{ color: mandatoryColor }">
        {{ mandatoryText }}
      </span>
      <span v-if="isMultiSelect" :style="{ color: selectionModeColor }">
        {{ selectionModeText }}
      </span>
      <span v-if="allowedValues" :style="{ color: allowedValuesColor }">
        {{ allowedValuesText }}
      </span>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useActiveAttribute } from '../AttributeItem.vue';
  import { AttributeInterpreter } from '@viamedici-spc/configurator-ts';
  import { useChoiceAttribute } from '../../../utils/useAttributes';
  
  export default defineComponent({
    name: 'Indicators',
    setup() {
      const activeAttribute = useActiveAttribute();
      const choiceAttribute = useChoiceAttribute(activeAttribute!);
  
      const attribute = computed(() => choiceAttribute?.attribute);
  
      // Mandatory Indicator
      const isMandatory = computed(() => AttributeInterpreter.isMandatory(attribute.value!));
      const mandatoryColor = 'var(--color-mandatory)';
      const optionalColor = 'var(--color-optional)';
      const mandatoryText = computed(() => (isMandatory.value ? 'mandatory' : 'optional'));
      const mandatoryColorStyle = computed(() => (isMandatory.value ? mandatoryColor : optionalColor));
  
      // Selection Mode Indicator
      const isMultiSelect = computed(() => AttributeInterpreter.isMultiSelect(attribute.value!));
      const selectionModeText = computed(() => (isMultiSelect.value ? 'multi-select' : 'single-select'));
      const selectionModeColor = 'var(--color-selection-mode)';
  
      // Available Values Indicator
      const allowedValues = computed(() => AttributeInterpreter.getAllowedChoiceValues(attribute.value!));
      const allowedValuesText = computed(() => `${allowedValues.value.length} allowed values`);
      const allowedValuesColor = 'var(--color-allowed-values)';
  
      return {
        isMandatory,
        mandatoryText,
        mandatoryColorStyle,
        isMultiSelect,
        selectionModeText,
        selectionModeColor,
        allowedValues,
        allowedValuesText,
        allowedValuesColor,
        mandatoryColor
      };
    },
  });
  </script>
  
  <style scoped>
  </style>
  