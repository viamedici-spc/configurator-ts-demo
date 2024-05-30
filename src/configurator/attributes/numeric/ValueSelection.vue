<template>
  <input
    class="value-selection-root"
    type="number"
    :step="Math.pow(0.1, result.attribute.decimalPlaces)"
    :min="result.attribute.range.min"
    :max="result.attribute.range.max"
    :value="inputValue"
    @input="onChange"
    @blur="applyPendingValue"
    @keydown.capture="handleKeydown"
  />
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import { useActiveAttribute } from "../AttributeItem.vue";
import { useNumericAttributeRef } from "../../../utils/useAttributes";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import { handleExplain } from "../../../utils/Explain";
import {
  FailureType,
  ExplainQuestionType,
  ExplainQuestionSubject,
} from "@viamedici-spc/configurator-ts";

const activeAttribute = useActiveAttribute();
const result = useNumericAttributeRef(activeAttribute!.value);
const attribute = computed(()=>result.value.attribute);

const { makeDecision, explain, applySolution} = result.value;

const pendingValue = ref<number | undefined | null>(null);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  pendingValue.value = target.value === "" ? undefined : parseFloat(target.value);
};

const applyPendingValue = async () => {
  if (pendingValue.value === null || pendingValue.value === undefined) {
    return;
  }
  const precision = Math.pow(10, attribute.value.decimalPlaces);
  const round = (value: number) => Math.round((value + Number.EPSILON) * precision) / precision;
  const roundedValue = pendingValue.value !== undefined ? round(pendingValue.value) : pendingValue.value;

  pendingValue.value = null;
  console.info("Make decision for %s: %s", attributeIdToString(attribute.value.id), roundedValue !== undefined ? roundedValue.toString() : "Undefined");

  await handleDecisionResponse(
    () => makeDecision(roundedValue),
    (e) => {
      if (
        e.type === FailureType.ConfigurationModelNotFeasible ||
        e.type === FailureType.ConfigurationConflict
      ) {
        return () => handleExplain(
          () => explain(
            {
              question: ExplainQuestionType.whyIsStateNotPossible,
              state: roundedValue!,
              subject: ExplainQuestionSubject.numeric,
              attributeId: activeAttribute!.value,
            },
            "full"
          ),
          applySolution
        );
      }
      return null;
    }
  );
};

const inputValue = computed(() => {
  return pendingValue.value !== null
    ? pendingValue.value ?? ""
    : attribute.value.decision?.state ?? "";
});

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await applyPendingValue();
  }
};
</script>

<style scoped>
.value-selection-root {
  grid-area: value-selection;
}
</style>
