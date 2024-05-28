<template>
  <CommonValueSelection
    :nothingValue="{
      id: nothingChoiceValueId,
      name: selectedChoiceValueIds.length > 0 ? 'Reset' : '',
    }"
    :allowedValues="allowedChoiceValues"
    :blockedValues="blockedChoiceValues"
    :isMultiselect="isMultiselect"
    :selectedValues="
      isMultiselect ? selectedChoiceValueIds : selectedChoiceValueId
    "
    @change="onChange"
  />
</template>

<script setup lang="ts">
import {
  AttributeInterpreter,
  ChoiceValueDecisionState,
  ChoiceValueId,
  DecisionKind,
  ExplainQuestionSubject,
  ExplainQuestionType,
} from "@viamedici-spc/configurator-ts";
import { useActiveAttribute } from "../AttributeItem.vue";
import { useChoiceAttribute } from "../../../utils/useAttributes";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import { handleExplain } from "../../../utils/Explain";
import CommonValueSelection, { Value } from "../CommonValueSelection.vue";
import { useStore } from "vuex";

const store = useStore();

const nothingChoiceValueId = "<nothing>";

const activeAttribute = useActiveAttribute();
const { attribute, makeDecision, explain, applySolution, clearDecisions } = useChoiceAttribute(
  activeAttribute!
);

const allowedChoiceValues = 
  AttributeInterpreter.getAllowedChoiceValues(attribute!).map(
    (v) =>
      ({
        id: v.id,
        isImplicit: v.decision?.kind === DecisionKind.Implicit,
      } satisfies Value<ChoiceValueId>)
  )
;

const blockedChoiceValues = AttributeInterpreter.getBlockedChoiceValues(attribute);
const isMultiselect = AttributeInterpreter.isMultiSelect(attribute);
const selectedChoiceValueIds = AttributeInterpreter.getSelectedChoiceValues(attribute).map( (a) => a.id as ChoiceValueId );
const selectedChoiceValueId = selectedChoiceValueIds[0] ?? nothingChoiceValueId;

const callStore = () => {
  store.commit("setRerender");
  console.log("setRerender store mutation called from Choice.ValueSelection!");
};
const onChange = async (value: string | string[]) => {
  const choiceValueIds = Array.isArray(value) ? value : [value];

  for (const choiceValueId of choiceValueIds) {
    if (choiceValueId === nothingChoiceValueId) {
      if (selectedChoiceValueIds.length === 1) {
        console.info(
          "Reset decision for %s.%s",
          attributeIdToString(attribute.id),
          selectedChoiceValueId
        );
        await handleDecisionResponse(() =>
          makeDecision(selectedChoiceValueId, null)
        ).finally(()=>store.commit("setRerender"));
        
      } else if (selectedChoiceValueIds.length > 1) {
        console.info(
          "Reset all decisions for %s",
          attributeIdToString(attribute.id)
        );
        await handleDecisionResponse(() => clearDecisions()).finally(()=>  callStore());
      }
    } else if (allowedChoiceValues.some((v) => v.id === choiceValueId)) {
      console.info(
        "Make decision for %s.%s",
        attributeIdToString(attribute.id),
        choiceValueId
      );
      const state = selectedChoiceValueIds.some(
        (v) => v === choiceValueId
      )
        ? null
        : ChoiceValueDecisionState.Included;

      await handleDecisionResponse(() => makeDecision(choiceValueId, state)).finally(()=>  callStore());
    } else if (choiceValueId != null && choiceValueId !== "") {
      console.info(
        "Explain blocked value for %s.%s",
        attributeIdToString(attribute.id),
        choiceValueId
      );
      await handleExplain(() => explain({question: ExplainQuestionType.whyIsStateNotPossible, choiceValueId: choiceValueId, state: ChoiceValueDecisionState.Included, attributeId: activeAttribute!, subject: ExplainQuestionSubject.choiceValue}, "full"), applySolution).finally(()=>{
        callStore();
      })
    }
  }
};
</script>
