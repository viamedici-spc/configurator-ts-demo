<template>
  <span :style="{color: color }">
 {{ attribute.isSatisfied ? 'satisfied' : 'unsatisfied' }}
  </span>
 <button v-if="!attribute.isSatisfied" @click="onExplain">Explain</button>
</template>

<script setup lang="ts">
import { useAttributes, useExplain } from '../../utils/useAttributes';
import { useActiveAttribute } from './AttributeItem.vue';
import { handleExplain } from '../../utils/Explain';
const activeAttribute = useActiveAttribute();
    const [attribute] = useAttributes([activeAttribute!]);
    const {explain, applySolution} = useExplain();

const onExplain = () => {
    handleExplain(()=> explain(b=> b.whyIsNotSatisfied.attribute(attribute?.id), "full"), applySolution)
}

const color = attribute.isSatisfied? "var(--color-satisfied)" : "var(--color-unsatisfied)";

</script>