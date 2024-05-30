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
import {useActiveAttribute} from "../AttributeItem.vue";
import { useComponentAttributeRef } from "../../../utils/useAttributes";
import {AttributeInterpreter, ComponentDecisionState, DecisionKind, ExplainQuestionSubject, ExplainQuestionType} from "@viamedici-spc/configurator-ts";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import CommonValueSelection, {Value} from "../CommonValueSelection.vue";
import { handleExplain } from "../../../utils/Explain";
import { computed } from "vue";



const nothingValueId = "<nothing>";
const includedValueId = "included";
const excludedValueId = "excluded";

const activeAttribute = useActiveAttribute();

    const result = useComponentAttributeRef(activeAttribute!.value);
    const attribute = computed(()=>result.value.attribute);
    const { makeDecision, explain, applySolution} = result.value;

    const onChange = async (valueId: string | string[]) => {
        if (valueId === nothingValueId) {
            if (attribute.value.decision?.kind === DecisionKind.Explicit) {
                console.info("Reset decision for %s", attributeIdToString(attribute.value.id));
                await handleDecisionResponse(() => makeDecision(null));
                
            }
        } else {
            const state = valueId === includedValueId ? ComponentDecisionState.Included : ComponentDecisionState.Excluded;

            if (AttributeInterpreter.isComponentStatePossible(attribute.value, state)) {
                console.info("Make decision for %s: %s", attributeIdToString(attribute.value.id), state.toString());

                await handleDecisionResponse(() => makeDecision(state));
            } else {
                console.info("Explain blocked value for %s: %s", attributeIdToString(attribute.value.id), state.toString());

                await handleExplain(() => explain({question: ExplainQuestionType.whyIsStateNotPossible, state: state, subject: ExplainQuestionSubject.component, attributeId:activeAttribute!.value}, "full"), applySolution);
            }
        }
    };

    const selectedValue = computed(()=>attribute.value.decision?.state === ComponentDecisionState.Included
        ? includedValueId
        : attribute.value.decision?.state === ComponentDecisionState.Excluded
            ? excludedValueId
            : nothingValueId);

    const isIncludedStatePossible = computed(()=>AttributeInterpreter.isComponentStatePossible(attribute.value, ComponentDecisionState.Included));
    const isExcludedStatePossible = computed(()=>AttributeInterpreter.isComponentStatePossible(attribute.value, ComponentDecisionState.Excluded));

    const excludedValue: Value<string> = {
        id: excludedValueId,
        name: "excluded",
        isImplicit: attribute.value.decision?.state === ComponentDecisionState.Excluded && attribute.value.decision?.kind === DecisionKind.Implicit
    };
    const includedValue: Value<string> = {
        id: includedValueId,
        name: "included",
        isImplicit: attribute.value.decision?.state === ComponentDecisionState.Included && attribute.value.decision?.kind === DecisionKind.Implicit
    };
    const allowedValues = computed(()=>[
  isExcludedStatePossible && excludedValue,
  isIncludedStatePossible && includedValue
].filter(Boolean) as Value<string>[]);  // Filter out false values

const blockedValues = computed(()=>
[
  (!isExcludedStatePossible.value) && excludedValue,
  (!isIncludedStatePossible.value) && includedValue
].filter(Boolean) as Value<string>[])
;
</script>