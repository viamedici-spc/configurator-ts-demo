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
import { useComponentAttribute } from "../../../utils/useAttributes";
import {AttributeInterpreter, ComponentDecisionState, DecisionKind, ExplainQuestionSubject, ExplainQuestionType} from "@viamedici-spc/configurator-ts";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import CommonValueSelection, {Value} from "../CommonValueSelection.vue";
import { handleExplain } from "../../../utils/Explain";
import { useStore } from "vuex";


const store = useStore();

const nothingValueId = "<nothing>";
const includedValueId = "included";
const excludedValueId = "excluded";

const activeAttribute = useActiveAttribute();
    const {attribute, makeDecision, explain, applySolution} = useComponentAttribute(activeAttribute!);

    const onChange = async (valueId: string | string[]) => {
        if (valueId === nothingValueId) {
            if (attribute.decision?.kind === DecisionKind.Explicit) {
                console.info("Reset decision for %s", attributeIdToString(attribute.id));
                await handleDecisionResponse(() => makeDecision(null));
                store.commit("setRerender");
            }
        } else {
            const state = valueId === includedValueId ? ComponentDecisionState.Included : ComponentDecisionState.Excluded;

            if (AttributeInterpreter.isComponentStatePossible(attribute, state)) {
                console.info("Make decision for %s: %s", attributeIdToString(attribute.id), state.toString());

                await handleDecisionResponse(() => makeDecision(state));
                store.commit("setRerender");
            } else {
                console.info("Explain blocked value for %s: %s", attributeIdToString(attribute.id), state.toString());

                await handleExplain(() => explain({question: ExplainQuestionType.whyIsStateNotPossible, state: state, subject: ExplainQuestionSubject.component, attributeId:activeAttribute!}, "full"), applySolution);
                store.commit("setRerender");
                // Here store.commit is executed while handleExplain is getting executed
            }
        }
    };

    const selectedValue = attribute.decision?.state === ComponentDecisionState.Included
        ? includedValueId
        : attribute.decision?.state === ComponentDecisionState.Excluded
            ? excludedValueId
            : nothingValueId;

    const isIncludedStatePossible = AttributeInterpreter.isComponentStatePossible(attribute, ComponentDecisionState.Included);
    const isExcludedStatePossible = AttributeInterpreter.isComponentStatePossible(attribute, ComponentDecisionState.Excluded);

    const excludedValue: Value<string> = {
        id: excludedValueId,
        name: "excluded",
        isImplicit: attribute.decision?.state === ComponentDecisionState.Excluded && attribute.decision?.kind === DecisionKind.Implicit
    };
    const includedValue: Value<string> = {
        id: includedValueId,
        name: "included",
        isImplicit: attribute.decision?.state === ComponentDecisionState.Included && attribute.decision?.kind === DecisionKind.Implicit
    };
    const allowedValues = [
  isExcludedStatePossible && excludedValue,
  isIncludedStatePossible && includedValue
].filter(Boolean) as Value<string>[];  // Filter out false values

const blockedValues = [
  (!isExcludedStatePossible) && excludedValue,
  (!isIncludedStatePossible) && includedValue
].filter(Boolean) as Value<string>[];
</script>