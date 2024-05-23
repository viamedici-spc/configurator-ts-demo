<template>
    <select
      :value="selectedValues"
      :multiple="isMultiselect"
      @change="handleChange"
      class="root"
    >
      <option :value="nothingValue?.id">
        {{ nothingValue?.isImplicit ? 'Implicit: ' : '' }}
        {{ nothingValue?.name ?? nothingValue?.id }}
      </option>
      <option
        v-for="value in allowedValues"
        :key="value.id"
        :value="value.id"
      >
        {{ value.isImplicit ? 'Implicit: ' : '' }}
        {{ value.name ?? value.id }}
      </option>
      <optgroup v-if="blockedValues!.length > 0" label="Blocked">
        <option
          v-for="value in blockedValues"
          :key="value.id"
          :value="value.id"
        >
          {{ value.isImplicit ? 'Implicit: ' : '' }}
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

type Props<TId extends string> = {
  nothingValue: Value<TId>;
  allowedValues: ReadonlyArray<Value<TId>>;
  blockedValues: ReadonlyArray<Value<TId>>;
  isMultiselect: boolean;
  selectedValues: TId | TId[];
  onChange: (value: TId) => void;
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
  setup(props) {
    const allowedValues = props.allowedValues!.filter(Boolean);
    const blockedValues = props.blockedValues!.filter(Boolean);

    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
      if (props.isMultiselect) {
        props.onChange!(selectedOptions as string[]);
      } else {
        props.onChange!(target.value as string);
      }
    };

    return {
      handleChange,
    };
}
});
</script>

<style scoped>
.root {
  grid-area: value-selection;
}
</style>
