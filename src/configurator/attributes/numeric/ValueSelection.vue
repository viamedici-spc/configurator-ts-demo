<template>
  <input
    class="valueSelection-root"
    type="number"
    :step="Math.pow(0.1, attribute.decimalPlaces)"
    :min="attribute.range.min"
    :max="attribute.range.max"
    :value="inputValue"
    @input="onChange"
    @blur="applyPendingValue"
    @keydown.capture="handleKeydown"
  />
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import { useActiveAttribute } from "../AttributeItem.vue";
import { useNumericAttribute } from "../../../utils/useAttributes";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import { handleExplain } from "../../../utils/Explain";
import {
  FailureType,
  ExplainQuestionType,
  ExplainQuestionSubject,
} from "@viamedici-spc/configurator-ts";
import { useStore } from 'vuex';

const store = useStore();

const activeAttribute = useActiveAttribute();
const { attribute, makeDecision, explain, applySolution } = useNumericAttribute(activeAttribute!);

const pendingValue = ref<number | undefined | null>(null);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  pendingValue.value = target.value === "" ? undefined : parseFloat(target.value);
};

const applyPendingValue = async () => {
  if (pendingValue.value === null || pendingValue.value === undefined) {
    return;
  }
  const precision = Math.pow(10, attribute.decimalPlaces);
  const round = (value: number) => Math.round((value + Number.EPSILON) * precision) / precision;
  const roundedValue = pendingValue.value !== undefined ? round(pendingValue.value) : pendingValue.value;

  pendingValue.value = null;
  console.info("Make decision for %s: %s", attributeIdToString(attribute.id), roundedValue !== undefined ? roundedValue.toString() : "Undefined");

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
              attributeId: activeAttribute!,
            },
            "full"
          ),
          applySolution
        );
      }
      return null;
    }
  );
  store.commit("setRerender");
};

const inputValue = computed(() => {
  return pendingValue.value !== null
    ? pendingValue.value ?? ""
    : attribute.decision?.state ?? "";
});

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await applyPendingValue();
  }
};
</script>

<style scoped>
.valueSelection-root {
  grid-area: value-selection;
}
</style>
