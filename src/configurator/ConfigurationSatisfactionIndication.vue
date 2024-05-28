<template>
  <div :class="['configuration-satisfaction-indication', { satisfied: configuration?.isSatisfied }]">
    <div class="text">
      {{
        configuration?.isSatisfied ? "Configuration satisfied" : "Configuration unsatisfied"
      }}
    </div>
    <button
        v-if="!configuration?.isSatisfied"
        class="button"
        @click="onExplain">
      Explain
    </button>
  </div>
</template>

<script setup lang="ts">
import {useExplain} from '../utils/useAttributes';
import {handleExplain} from '../utils/Explain';
import {useConfigurationContext} from '../utils/contexts';

const configuration = useConfigurationContext();
const {explain, applySolution} = useExplain();

const onExplain = () => {
  handleExplain(() => explain(b => b.whyIsNotSatisfied.configuration, "full"), applySolution);
};

</script>


<style scoped>
.configuration-satisfaction-indication {
  margin-bottom: 1em;
  display: grid;
  grid-template-rows: [text explain-button] auto;
  grid-template-columns: [text] auto [explain-button] auto;
  gap: 0.5em;
  justify-content: start;
  background-color: var(--color-unsatisfied-bg);
  color: var(--color-unsatisfied);
  padding: var(--size-card-padding);
  border-radius: var(--shape-card-border-radius);
  font-weight: bolder;
  box-shadow: var(--shadow-card);

  &.satisfied {
    background-color: var(--color-satisfied-bg);
    color: var(--color-satisfied);
  }
}

.text {
  grid-area: text;
  align-self: center;
}

.button {
  grid-area: explain-button;
}
</style>
