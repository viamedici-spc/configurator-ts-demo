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
import CommonValueSelection, { Value } from "../CommonValueSelection.vue";
import { handleExplain } from "../../../utils/Explain";

const nothingValueId = "<nothing>";
const trueValueId = "true";
const falseValueId = "false";

const activeAttribute = useActiveAttribute();

const result = useBooleanAttributeRef(activeAttribute!.value);

const { attribute, makeDecision, explain, applySolution } = result.value!

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

      handleExplain(() => explain({question: ExplainQuestionType.whyIsStateNotPossible, state: value, subject:ExplainQuestionSubject.boolean,attributeId:activeAttribute?.value!}, "full"), applySolution);
    }
  }
};

const selectedValue = attribute.decision?.state === true
        ? trueValueId
        : attribute.decision?.state === false
            ? falseValueId
            : nothingValueId;

    const isTrueValuePossible = AttributeInterpreter.isBooleanValuePossible(attribute, true);
    const isFalseValuePossible = AttributeInterpreter.isBooleanValuePossible(attribute, false);
    const falseValue: Value<string> = {
        id: falseValueId,
        name: "no",
        isImplicit: attribute.decision?.state === false && attribute.decision?.kind === DecisionKind.Implicit
    };
    const trueValue: Value<string> = {
        id: trueValueId,
        name: "yes",
        isImplicit: attribute.decision?.state === true && attribute.decision?.kind === DecisionKind.Implicit
    };
    const allowedValues = [
        isFalseValuePossible && falseValue,
        isTrueValuePossible && trueValue
    ].filter(Boolean) as Value<string>[];;
    const blockedValues = [
        (!isFalseValuePossible) && falseValue,
        (!isTrueValuePossible) && trueValue
    ].filter(Boolean) as Value<string>[];;
</script>
