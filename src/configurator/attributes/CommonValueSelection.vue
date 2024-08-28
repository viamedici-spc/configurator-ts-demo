<script setup lang="ts">
import CommonValueSelectionOption from "./CommonValueSelectionOption.vue";

export type Value = {
  id: string;
  name?: string;
  isImplicit?: boolean;
};

interface Props {
  nothingValue: Value;
  allowedValues: ReadonlyArray<Value>;
  blockedValues: ReadonlyArray<Value>;
  isMultiselect: boolean;
  selectedValues: string | string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "change", value: string): void;
}>();

const handleChange = (event: Event) => {
  const target = event.currentTarget as HTMLSelectElement;
  const value = target.value;
  // Reset the selection directly. Let the event handler decide about the desired selection.
  target.value = props.selectedValues as any;
  emit("change", value);
}

</script>

<template>
  <select
      class="common-value-selection"
      :value="selectedValues"
      :multiple="isMultiselect"
      @change="handleChange">
    <CommonValueSelectionOption :value="nothingValue"/>
    <CommonValueSelectionOption v-for="value in allowedValues" :key="value.id" :value="value"/>
    <optgroup v-if="blockedValues!.length > 0" label="Blocked">
      <CommonValueSelectionOption v-for="value in blockedValues" :key="value.id" :value="value"/>
    </optgroup>
  </select>
</template>

<style scoped>
.common-value-selection {
  grid-area: value-selection;
}
</style>
