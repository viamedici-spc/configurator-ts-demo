<template>
  <CommonValueSelection
    :nothingValue="{
      id: nothingValueId,
      name: selectedValue !== nothingValueId ? 'Reset' : '',
    }"
    :allowedValues="allowedValues"
    :blockedValues="blockedValues"
    :isMultiselect="false"
    :selectedValues="selectedValue"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useActiveAttribute } from "../AttributeItem.vue";
import { useBooleanAttributeRef } from "../../../utils/useAttributes";
import {
  AttributeInterpreter,
  DecisionKind,
  ExplainQuestionSubject,
  ExplainQuestionType,
} from "@viamedici-spc/configurator-ts";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import { handleExplain } from "../../../utils/Explain";
import CommonValueSelection, { Value } from "../CommonValueSelection.vue";

const nothingValueId = "<nothing>";
const trueValueId = "true";
const falseValueId = "false";

const activeAttribute = useActiveAttribute();

if (!activeAttribute) {
  throw new Error("activeAttribute is null!");
}

const result = useBooleanAttributeRef(activeAttribute.value);

const { attribute, makeDecision, explain, applySolution } = result.value;

const selectedValue = computed(() =>
  attribute.decision?.state === true
    ? trueValueId
    : attribute.decision?.state === false
    ? falseValueId
    : nothingValueId
);

const isTrueValuePossible = computed(() =>
  AttributeInterpreter.isBooleanValuePossible(attribute, true)
);
const isFalseValuePossible = computed(() =>
  AttributeInterpreter.isBooleanValuePossible(attribute, false)
);

const falseValue = computed(() => ({
  id: falseValueId,
  name: "no",
  isImplicit:
    attribute.decision?.state === false &&
    attribute.decision?.kind === DecisionKind.Implicit,
}));

const trueValue = computed(() => ({
  id: trueValueId,
  name: "yes",
  isImplicit:
    attribute.decision?.state === true &&
    attribute.decision?.kind === DecisionKind.Implicit,
}));

const allowedValues = computed(() =>
  [
    isFalseValuePossible.value && falseValue.value,
    isTrueValuePossible.value && trueValue.value,
  ].filter(Boolean) as Value<string>[]
);

const blockedValues = computed(() =>
  [
    !isFalseValuePossible.value && falseValue.value,
    !isTrueValuePossible.value && trueValue.value,
  ].filter(Boolean) as Value<string>[]
);

const onChange = async (valueId: string | string[]) => {
  if (valueId === nothingValueId) {
    if (attribute.decision?.kind === DecisionKind.Explicit) {
      console.info("Reset decision for %s", attributeIdToString(attribute.id));
      await handleDecisionResponse(() => makeDecision(null));
    }
  } else {
    const value = valueId === trueValueId;

    if (AttributeInterpreter.isBooleanValuePossible(attribute, value)) {
      console.info(
        "Make decision for %s: %s",
        attributeIdToString(attribute.id),
        value.toString()
      );

      await handleDecisionResponse(() => makeDecision(value));
    } else {
      console.info(
        "Explain blocked value for %s: %s",
        attributeIdToString(attribute.id),
        value.toString()
      );

      handleExplain(() =>
        explain({
          question: ExplainQuestionType.whyIsStateNotPossible,
          state: value,
          subject: ExplainQuestionSubject.boolean,
          attributeId: activeAttribute.value,
        }, "full"), applySolution);
    }
  }
};
</script>

