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
import { useChoiceAttributeRef } from "../../../utils/useAttributes";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import { handleExplain } from "../../../utils/Explain";
import CommonValueSelection, { Value } from "../CommonValueSelection.vue";
import { computed } from "vue";

const nothingChoiceValueId = "<nothing>";

const activeAttribute = useActiveAttribute();

if (activeAttribute === null) {
  throw new Error("activeAttribute is null!");
}

const result = useChoiceAttributeRef(activeAttribute.value);

const attribute = computed(() => result.value.attribute);

const { clearDecisions, makeDecision, applySolution, explain } = result.value;

const allowedChoiceValues = computed(() =>
  AttributeInterpreter.getAllowedChoiceValues(result.value.attribute).map(
    (v) =>
      ({
        id: v.id,
        isImplicit: v.decision?.kind === DecisionKind.Implicit,
      } satisfies Value<ChoiceValueId>)
  )
);
const blockedChoiceValues = computed(() =>
  AttributeInterpreter.getBlockedChoiceValues(attribute.value)
);
const isMultiselect = computed(() =>
  AttributeInterpreter.isMultiSelect(attribute.value)
);
const selectedChoiceValueIds = computed(() =>
  AttributeInterpreter.getSelectedChoiceValues(attribute.value).map(
    (a) => a.id as ChoiceValueId
  )
);
const selectedChoiceValueId = computed(() =>
  selectedChoiceValueIds.value[0] ?? nothingChoiceValueId
);


const onChange = async (value: string | string[]) => {
  const choiceValueIds = Array.isArray(value) ? value : [value];

  for (const choiceValueId of choiceValueIds) {
    if (choiceValueId === nothingChoiceValueId) {
      if (selectedChoiceValueIds.value.length === 1) {
        console.info(
          "Reset decision for %s.%s",
          attributeIdToString(attribute.value.id),
          selectedChoiceValueId.value
        );
        await handleDecisionResponse(() =>
          makeDecision(selectedChoiceValueId.value, null)
        );
      } else if (selectedChoiceValueIds.value.length > 1) {
        console.info(
          "Reset all decisions for %s",
          attributeIdToString(attribute.value.id)
        );
        await handleDecisionResponse(() => clearDecisions());
      }
    } else if (allowedChoiceValues.value.some((v) => v.id === choiceValueId)) {
      console.info(
        "Make decision for %s.%s",
        attributeIdToString(attribute.value.id),
        choiceValueId
      );
      const state = selectedChoiceValueIds.value.some((v) => v === choiceValueId)
        ? null
        : ChoiceValueDecisionState.Included;

      await handleDecisionResponse(() => makeDecision(choiceValueId, state));
    } else if (choiceValueId != null && choiceValueId !== "") {
      console.info(
        "Explain blocked value for %s.%s",
        attributeIdToString(attribute.value.id),
        choiceValueId
      );
      await handleExplain(
        () =>
          explain(
            {
              question: ExplainQuestionType.whyIsStateNotPossible,
              choiceValueId: choiceValueId,
              state: ChoiceValueDecisionState.Included,
              attributeId: activeAttribute!.value,
              subject: ExplainQuestionSubject.choiceValue,
            },
            "full"
          ),
        applySolution
      );
    }
  }
};
</script>
