<script setup lang="ts">
import {
  AttributeInterpreter, AttributeType,
  ComponentDecisionState, ConfigurationInterpreter,
  DecisionKind, ExplainQuestionSubject,
  ExplainQuestionType, ExplicitComponentDecision,
} from "@viamedici-spc/configurator-ts";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import CommonValueSelection, { Value } from "../CommonValueSelection.vue";
import { handleExplain } from "../../../utils/Explain";
import { computed } from "vue";
import {useActiveAttribute, useConfiguration, useSession} from "../../../utils/Contexts";

const nothingValueId = "<nothing>";
const includedValueId = "included";
const excludedValueId = "excluded";

const activeAttribute = useActiveAttribute();
const session = useSession();
const configuration = useConfiguration();

const model = computed(() => {
  const attributeId = activeAttribute.value;
  const attribute = ConfigurationInterpreter.getComponentAttribute(configuration.value, attributeId);
  if (attribute == undefined) {
    console.error("Component attribute not found with id", attributeId)
    throw new Error("Component attribute not found");
  }

  const selectedValue = attribute.decision?.state === ComponentDecisionState.Included
      ? includedValueId
      : attribute.decision?.state === ComponentDecisionState.Excluded
          ? excludedValueId
          : nothingValueId;

  const isIncludedStatePossible = AttributeInterpreter.isComponentStatePossible(attribute, ComponentDecisionState.Included);
  const isExcludedStatePossible = AttributeInterpreter.isComponentStatePossible(attribute, ComponentDecisionState.Excluded);
  const excludedValue: Value = {
    id: excludedValueId,
    name: "excluded",
    isImplicit: attribute.decision?.state === ComponentDecisionState.Excluded && attribute.decision?.kind === DecisionKind.Implicit
  };
  const includedValue: Value = {
    id: includedValueId,
    name: "included",
    isImplicit: attribute.decision?.state === ComponentDecisionState.Included && attribute.decision?.kind === DecisionKind.Implicit
  };
  const allowedValues = [
    ...(isIncludedStatePossible ? [includedValue] : []),
    ...(isExcludedStatePossible ? [excludedValue] : [])
  ];
  const blockedValues = [
    ...(!isIncludedStatePossible ? [includedValue] : []),
    ...(!isExcludedStatePossible ? [excludedValue] : [])
  ];

  const onChange = async (valueId: string) => {
    if (valueId === nothingValueId) {
      if (attribute.decision?.kind === DecisionKind.Explicit) {
        console.info("Reset decision for %s", attributeIdToString(attribute.id));
        await handleDecisionResponse(() => session.makeDecision({
              type: AttributeType.Component,
              attributeId: attributeId,
              state: null
            } as ExplicitComponentDecision)
        );
      }
    } else {
      const state = valueId === includedValueId ? ComponentDecisionState.Included : ComponentDecisionState.Excluded;

      if (AttributeInterpreter.isComponentStatePossible(attribute, state)) {
        console.info("Make decision for %s: %s", attributeIdToString(attribute.id), state.toString());

        await handleDecisionResponse(() => session.makeDecision({
              type: AttributeType.Component,
              attributeId: attributeId,
              state
            } as ExplicitComponentDecision)
        );
      } else {
        console.info("Explain blocked value for %s: %s", attributeIdToString(attribute.id), state.toString());

        await handleExplain(() => session.explain({
          subject: ExplainQuestionSubject.component,
          question: ExplainQuestionType.whyIsStateNotPossible,
          state,
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
