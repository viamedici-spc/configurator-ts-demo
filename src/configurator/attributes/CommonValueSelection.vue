<template>
  <select
    :value="selectedValues"
    :multiple="isMultiselect"
    @change="handleChange"
    class="common-value-selection-root"
  >
    <option :value="nothingValue?.id">
      {{ nothingValue?.isImplicit ? "Implicit: " : "" }}
      {{ nothingValue?.name ?? nothingValue?.id }}
    </option>
    <option v-for="value in allowedValues" :key="value.id" :value="value.id">
      {{ value.isImplicit ? "Implicit: " : "" }}
      {{ value.name ?? value.id }}
    </option>
    <optgroup v-if="blockedValues!.length > 0" label="Blocked">
      <option v-for="value in blockedValues" :key="value.id" :value="value.id">
        {{ value.isImplicit ? "Implicit: " : "" }}
        {{ value.name ?? value.id }}
      </option>
    </optgroup>
  </select>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";


export type Value<TId extends string> = {
  id: TId;
  name?: string;
  isImplicit?: boolean;
};

export default defineComponent({
  name: "CommonValueSelection",
  props: {
    nothingValue: Object as PropType<Value<string>>,

    allowedValues: Array as PropType<ReadonlyArray<Value<string>>>,
    blockedValues: Array as PropType<ReadonlyArray<Value<string>>>,

    isMultiselect: Boolean,
    selectedValues: [String, Array] as PropType<string | string[]>,

    onChange: Function as PropType<(value: string | string[]) => void>,
  },
  setup(props, { emit }) {

    
    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const selectedOptions = Array.from(target.selectedOptions).map(
        (option) => option.value
      );
      if (props.isMultiselect) {
        emit("change", selectedOptions as string[]);
      } else {
        emit("change", target.value as string);
      }
    };

    return {
      handleChange,
    };
  }
});
</script>

<style scoped>
.common-value-selection-root {
  grid-area: value-selection;
}
</style>
