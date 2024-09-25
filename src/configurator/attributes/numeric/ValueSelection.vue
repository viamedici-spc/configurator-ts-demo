<script setup lang="ts">
import {computed, ref} from "vue";
import {handleDecisionResponse} from "../../../utils/PromiseErrorHandling";
import {attributeIdToString} from "../../../utils/Naming";
import {handleExplain} from "../../../utils/Explain";
import {
  AttributeType,
  ConfigurationInterpreter,
  ConfiguratorErrorType,
  ExplainQuestionSubject,
  ExplainQuestionType,
  ExplicitNumericDecision,
} from "@viamedici-spc/configurator-ts";
import {useActiveAttribute, useConfiguration, useSession} from "../../../utils/Contexts";

const activeAttribute = useActiveAttribute();
const session = useSession();
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

const pendingValue = ref<number | undefined | null>(null);

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  pendingValue.value = target.value === "" ? undefined : parseFloat(target.value);
};

const applyPendingValue = async () => {
  if (pendingValue.value === null) {
    return;
  }

  const precision = Math.pow(10, attribute.value.decimalPlaces);
  const round = (value: number) => Math.round((value + Number.EPSILON) * precision) / precision;
  const roundedValue = pendingValue.value !== undefined ? round(pendingValue.value) : pendingValue.value;

  pendingValue.value = null;
  console.info("Make decision for %s: %s", attributeIdToString(attribute.value.id), roundedValue?.toString() ?? "Undefined");

  if (roundedValue != null && (roundedValue < attribute.value.range.min || roundedValue > attribute.value.range.max)) {
    alert(`Value is out of range [${attribute.value.range.min}; ${attribute.value.range.max}]`);
    return;
  }

  await handleDecisionResponse(
      () => session.makeDecision({
        type: AttributeType.Numeric,
        attributeId: activeAttribute.value,
        state: roundedValue
      } as ExplicitNumericDecision),
      (e) => {
        if (roundedValue != null && e.type === ConfiguratorErrorType.SetDecisionConflict) {
          return () => handleExplain(() => session.explain({
            subject: ExplainQuestionSubject.numeric,
            question: ExplainQuestionType.whyIsStateNotPossible,
            state: roundedValue,
            attributeId: activeAttribute.value
          }, "full"), s => session.applySolution(s));
        }
        return null;
      }
  );
};

const inputValue = computed(() => pendingValue.value !== null ? pendingValue.value ?? "" : attribute.value.decision?.state ?? "");

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await applyPendingValue();
  }
};
</script>

<template>
  <input
      class="value-selection"
      type="number"
      :step="Math.pow(0.1, attribute.decimalPlaces)"
      :min="attribute.range.min"
      :max="attribute.range.max"
      :value="inputValue"
      @input="onChange"
      @blur="applyPendingValue"
      @keydown="handleKeydown"
  />
</template>

<style scoped>
.value-selection {
  grid-area: value-selection;
}
</style>
