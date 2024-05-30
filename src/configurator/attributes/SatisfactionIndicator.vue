<template>
  <span :style="{ color: color }">
    {{ attribute.isSatisfied ? "satisfied" : "unsatisfied" }}
  </span>
  <button v-if="!attribute.isSatisfied" @click="onExplain">Explain</button>
</template>

<script setup lang="ts">
import { useAttributesRef, useExplain } from "../../utils/useAttributes";
import { useActiveAttribute } from "./AttributeItem.vue";
import { handleExplain } from "../../utils/Explain";
import { computed } from "vue";
const activeAttribute = useActiveAttribute();

const attributes = useAttributesRef([activeAttribute!.value]);

const attribute = computed(() => attributes.value[0]);

const { explain, applySolution } = useExplain();

const onExplain = () => {
  handleExplain(
    () =>
      explain(
        (b) => b.whyIsNotSatisfied.attribute(attribute.value?.id),
        "full"
      ),
    applySolution
  );
};

const color = computed(() =>
  attribute.value && attribute.value.isSatisfied
    ? "var(--color-satisfied)"
    : "var(--color-unsatisfied)"
);
</script>
