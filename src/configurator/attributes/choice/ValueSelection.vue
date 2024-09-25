<script setup lang="ts">
import {
  AttributeInterpreter, AttributeType,
  ChoiceValueDecisionState,
  ChoiceValueId, ConfigurationInterpreter, ConfiguratorErrorType,
  DecisionKind, ExplainQuestionSubject,
  ExplainQuestionType, ExplicitChoiceDecision,
} from "@viamedici-spc/configurator-ts";
import {handleDecisionResponse} from "../../../utils/PromiseErrorHandling";
import {attributeIdToString} from "../../../utils/Naming";
import {handleExplain} from "../../../utils/Explain";
import CommonValueSelection, {Value} from "../CommonValueSelection.vue";
import {computed} from "vue";
import {useActiveAttribute, useConfiguration, useSession} from "../../../utils/Contexts";

const nothingChoiceValueId = "<nothing>";

const activeAttribute = useActiveAttribute();
const session = useSession();
const configuration = useConfiguration();

const model = computed(() => {
  const attributeId = activeAttribute.value;
  const attribute = ConfigurationInterpreter.getChoiceAttribute(configuration.value, attributeId);
  if (attribute == undefined) {
    console.error("Choice attribute not found with id", attributeId)
    throw new Error("Choice attribute not found");
  }

  const allowedChoiceValues = AttributeInterpreter.getAllowedChoiceValues(attribute)
      .map(v => ({id: v.id, isImplicit: v.decision?.kind === DecisionKind.Implicit} satisfies Value));
  const blockedChoiceValues = AttributeInterpreter.getBlockedChoiceValues(attribute);
  const isMultiselect = AttributeInterpreter.isChoiceAttributeMultiSelect(attribute);
  const selectedChoiceValueIds = AttributeInterpreter.getIncludedChoiceValues(attribute).map((a) => a.id as ChoiceValueId);
  const selectedChoiceValueId = selectedChoiceValueIds[0] ?? nothingChoiceValueId;

  const onChange = async (choiceValueId: ChoiceValueId) => {
    if (choiceValueId === nothingChoiceValueId) {
      if (selectedChoiceValueIds.length === 1) {
        console.info("Reset decision for %s.%s", attributeIdToString(attribute.id), selectedChoiceValueId);
        await handleDecisionResponse(() => session.makeDecision({
              type: AttributeType.Choice,
              attributeId: attributeId,
              choiceValueId: selectedChoiceValueId,
              state: null,
            } as ExplicitChoiceDecision)
        );
      } else if (selectedChoiceValueIds.length > 1) {
        console.info("Reset all decisions for %s", attributeIdToString(attribute.id), selectedChoiceValueId);
        await handleDecisionResponse(async () => {
          const resetDecisions = [...attribute.values.values()]
              .filter(v => v.decision != null && v.decision.kind === DecisionKind.Explicit)
              .map(v => ({
                type: AttributeType.Choice,
                attributeId: attribute.id,
                choiceValueId: v.id,
                state: null,
              } as ExplicitChoiceDecision));

          if (resetDecisions.length > 0) {
            await session.setMany(resetDecisions, {type: "KeepExistingDecisions"});
          }
        });
      }
    } else if (allowedChoiceValues.some(v => v.id === choiceValueId)) {
      console.info("Make decision for %s.%s", attributeIdToString(attribute.id), choiceValueId);
      const state = selectedChoiceValueIds.some(v => v === choiceValueId)
          ? null
          : ChoiceValueDecisionState.Included;

      await handleDecisionResponse(() => session.makeDecision({
            type: AttributeType.Choice,
            attributeId: attributeId,
            choiceValueId: choiceValueId,
            state: state,
          } as ExplicitChoiceDecision),
          (e) => {
            if (e.type === ConfiguratorErrorType.ConflictWithConsequence) {
              return () => handleExplain(() => session.explain({
                subject: ExplainQuestionSubject.choiceValue,
                question: ExplainQuestionType.whyIsStateNotPossible,
                choiceValueId: choiceValueId,
                state,
                attributeId
              }, "full"), s => session.applySolution(s));
            }
            return null;
          }
      );
    } else if (choiceValueId != null && choiceValueId !== "") {
      console.info("Explain blocked value for %s.%s", attributeIdToString(attribute.id), choiceValueId);

      await handleExplain(() => session.explain({
        subject: ExplainQuestionSubject.choiceValue,
        question: ExplainQuestionType.whyIsStateNotPossible,
        choiceValueId: choiceValueId,
        state: ChoiceValueDecisionState.Included,
        attributeId
      }, "full"), s => session.applySolution(s));
    }
  };

  return {
    allowedChoiceValues,
    blockedChoiceValues,
    selectedChoiceValueIds,
    selectedChoiceValueId,
    isMultiselect,
    onChange
  }
});

</script>

<template>
  <CommonValueSelection
      :nothingValue="{ id: nothingChoiceValueId, name: model.selectedChoiceValueIds.length > 0 ? 'Reset' : '' }"
      :allowedValues="model.allowedChoiceValues"
      :blockedValues="model.blockedChoiceValues"
      :isMultiselect="model.isMultiselect"
      :selectedValues="model.isMultiselect ? model.selectedChoiceValueIds : model.selectedChoiceValueId"
      @change="model.onChange"
  />
</template>
