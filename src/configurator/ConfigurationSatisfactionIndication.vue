<!-- <template>
  <Root class="configurationSatisfactionIndication-root">
    <div class="configurationSatisfactionIndication-text">
      {{
        isSatisfied ? "Configuration satisfied" : "Configuration unsatisfied"
      }}
    </div>
    <div
      v-if="!isSafistied"
      class="configurationSatisfactionIndication-button"
      @click="onExplain"
    >
      Explain
    </div>
  </Root>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import {
  useConfiguration,
  useConfigurationInitialization,
  useExplain,
} from "@viamedici-spc/configurator-react";
import { handleExplain } from '../utils/Explain';

const { isInitializing } = useConfigurationInitialization();
const { configuration } = useConfiguration();
const { explain, applySolution } = useExplain();

const isSatisfied = ref(configuration.isSatisfied);

const onExplain = () => {
  handleExplain(() => explain(b => b.whyIsNotSatisfied.configuration, 'full'), applySolution);
};

onMounted(() => {
  if (isInitializing) {
    return;
  }
});


</script>



<style scoped>
.configurationSatisfactionIndication-root {
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
.configurationSatisfactionIndication-text {
  grid-area: text;
  align-self: center;
}
.configurationSatisfactionIndication-button {
  grid-area: explain-button;
}
</style> -->
