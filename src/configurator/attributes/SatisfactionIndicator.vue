<script setup lang="ts">
import {handleExplain} from "../../utils/Explain";
import {useActiveAttribute, useConfiguration, useSession} from "../../utils/Contexts";
import {computed} from "vue";
import {ConfigurationInterpreter} from "@viamedici-spc/configurator-ts";

const activeAttribute = useActiveAttribute();
const configuration = useConfiguration();
const session = useSession();

const attribute = computed(() => {
  const result = ConfigurationInterpreter.getAttribute(configuration.value, activeAttribute.value);
  if (result === undefined) {
    throw new Error("Attribute not found");
  }
  return result;
});

const model = computed(() => {
  return {
    label: attribute.value.isSatisfied
        ? `satisfied${attribute.value.canContributeToConfigurationSatisfaction ? " (can contribute)" : ""}`
        : "unsatisfied",
    color: attribute.value.canContributeToConfigurationSatisfaction
        ? 'var(--color-mandatory)'
        : (attribute.value.isSatisfied ? 'var(--color-satisfied)' : 'var(--color-unsatisfied)')
  }
});

const onExplain = () => {
  handleExplain(() => session.explain(b => b.whyIsNotSatisfied.attribute(attribute.value.id), "full"), s => session.applySolution(s));
};

</script>

<template>
  <span :style="{ color: model.color }">
    {{ model.label }}
  </span>
  <button v-if="!attribute.isSatisfied" @click="onExplain" :style="{marginLeft: '0.4em', padding: '0'}">Explain</button>
</template>
