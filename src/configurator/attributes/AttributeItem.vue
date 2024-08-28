<script setup lang="ts">
import {GlobalAttributeId,} from "@viamedici-spc/configurator-ts";
import {computed} from "vue";
import {attributeIdToString} from "../../utils/Naming";
import {provideActiveAttribute} from "../../utils/Contexts";
import AttributeTypeSelector from "./AttributeTypeSelector.vue";

const props = defineProps<{
  attributeId: GlobalAttributeId
}>();

const attributeId = computed(() => props.attributeId);
provideActiveAttribute(attributeId);

</script>

<template>
  <div class="attribute-item">
    <div class="label">
      {{ attributeIdToString(props.attributeId) }}
    </div>
    <AttributeTypeSelector/>
  </div>
</template>

<style scoped>
.attribute-item {
  display: grid;
  grid-template-columns: [label] 0.4fr 0.5em [selection] 0.6fr;
  grid-template-rows: [label selection] auto;
}

.label {
  grid-area: label;
}
</style>
