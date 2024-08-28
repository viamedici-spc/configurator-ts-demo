<script setup lang="ts">
import {computed} from "vue";
import {
  AttributeInterpreter, AttributeType, ConfigurationInterpreter,
  DecisionKind, ExplainQuestionSubject,
  ExplainQuestionType, ExplicitBooleanDecision,
} from "@viamedici-spc/configurator-ts";
import {handleDecisionResponse} from "../../../utils/PromiseErrorHandling";
import {attributeIdToString} from "../../../utils/Naming";
import {handleExplain} from "../../../utils/Explain";
import CommonValueSelection, {Value} from "../CommonValueSelection.vue";
import {useActiveAttribute, useConfiguration, useSession} from "../../../utils/Contexts";

const nothingValueId = "<nothing>";
const trueValueId = "true";
const falseValueId = "false";

const activeAttribute = useActiveAttribute();
const session = useSession();
const configuration = useConfiguration();

const model = computed(() => {
  const attributeId = activeAttribute.value;
  const attribute = ConfigurationInterpreter.getBooleanAttribute(configuration.value, attributeId);
  if (attribute == undefined) {
    console.error("Boolean attribute not found with id", attributeId)
    throw new Error("Boolean attribute not found");
  }

  const selectedValue = attribute.decision?.state === true
      ? trueValueId
      : attribute.decision?.state === false
          ? falseValueId
          : nothingValueId;

  const isTrueValuePossible = AttributeInterpreter.isBooleanValuePossible(attribute, true);
  const isFalseValuePossible = AttributeInterpreter.isBooleanValuePossible(attribute, false);
  const falseValue: Value = {
    id: falseValueId,
    name: "no",
    isImplicit: attribute.decision?.state === false && attribute.decision?.kind === DecisionKind.Implicit
  };
  const trueValue: Value = {
    id: trueValueId,
    name: "yes",
    isImplicit: attribute.decision?.state === true && attribute.decision?.kind === DecisionKind.Implicit
  };
  const allowedValues = [
    ...(isFalseValuePossible ? [falseValue] : []),
    ...(isTrueValuePossible ? [trueValue] : [])
  ];
  const blockedValues = [
    ...(!isFalseValuePossible ? [falseValue] : []),
    ...(!isTrueValuePossible ? [trueValue] : [])
  ];

  const onChange = async (valueId: string) => {
    if (valueId === nothingValueId) {
      if (attribute.decision?.kind === DecisionKind.Explicit) {
        console.info("Reset decision for %s", attributeIdToString(attribute.id));
        await handleDecisionResponse(() => session.makeDecision({
              type: AttributeType.Boolean,
              attributeId: attributeId,
              state: null
            } as ExplicitBooleanDecision)
        );
      }
    } else {
      const value = valueId === trueValueId;

      if (AttributeInterpreter.isBooleanValuePossible(attribute, value)) {
        console.info("Make decision for %s: %s", attributeIdToString(attribute.id), value.toString());

        await handleDecisionResponse(() => session.makeDecision({
              type: AttributeType.Boolean,
              attributeId: attributeId,
              state: value
            } as ExplicitBooleanDecision)
        );
      } else {
        console.info("Explain blocked value for %s: %s", attributeIdToString(attribute.id), value.toString());

        await handleExplain(() => session.explain({
          subject: ExplainQuestionSubject.boolean,
          question: ExplainQuestionType.whyIsStateNotPossible,
          state: value,
          attributeId
        }, "full"), s => session.applySolution(s));
      }
    }
  };

  return {
    allowedValues,
    blockedValues,
    selectedValue,
    onChange
  }
})
</script>

<template>
  <CommonValueSelection
      :nothingValue="{ id: nothingValueId, name: model.selectedValue !== nothingValueId ? 'Reset' : '' }"
      :allowedValues="model.allowedValues"
      :blockedValues="model.blockedValues"
      :isMultiselect="false"
      :selectedValues="model.selectedValue"
      @change="model.onChange"
  />
</template>
