<template>
  <div>Value Selection</div>
</template>

<script setup lang="ts">
import {
  AttributeInterpreter,
  ChoiceValueDecisionState,
  ChoiceValueId,
  DecisionKind,
  ExplainQuestionType,
} from "@viamedici-spc/configurator-ts";
import { useActiveAttribute } from "../AttributeItem.vue";
import { useChoiceAttribute } from "../../../utils/useAttributes";
import { handleDecisionResponse } from "../../../utils/PromiseErrorHandling";
import { attributeIdToString } from "../../../utils/Naming";
import CommonValueSelection, { value } from "../CommonValueSelection";
import { handleExplain } from "../../../utils/Explain";

const nothingChoiceValueId = "<nothing>";

const activeAttribute = useActiveAttribute();
const { attribute, makeDecision, explain, applySolution, clearDecisions } =
  useChoiceAttribute(activeAttribute!);
const allowedChoiceValues = AttributeInterpreter.getAllowedChoiceValues(
  attribute
).map(
  (v) =>
    ({
      id: v.id,
      isImplicit: v.decision?.kind === DecisionKind.Implicit,
    } satisfies Value<ChoiceValueId>)
);
const blockedChoiceValues =
  AttributeInterpreter.getBlockedChoiceValues(attribute);
const isMultiselect = AttributeInterpreter.isMultiSelect(attribute);
const selectedChoiceValueIds = AttributeInterpreter.getSelectedChoiceValues(
  attribute
).map((a) => a.id satisfies ChoiceValueId);
const selectedChoiceValueId = selectedChoiceValueIds[0] ?? nothingChoiceValueId;
</script>
