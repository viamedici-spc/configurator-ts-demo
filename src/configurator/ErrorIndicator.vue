<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigurationInitialization, useConfigurationUpdating } from '@viamedici-spc/configurator-react';
import Root from '../components/Root.vue';

type ConfigurationError = {
  type: string;
  retry: () => void;
} | null;

const error = ref<ConfigurationError>(null);

const { error: initError } = useConfigurationInitialization();
const { error: updateError } = useConfigurationUpdating();

onMounted(() => {
  if (initError) {
    error.value = {
      type: 'init',
      retry: initError.retry || (()=>{})
    };
  } else if (updateError) {
    error.value = {
      type: 'update',
      retry: updateError.retry || (()=>{})
    };
  }
});

const retry = () => {
  if (error.value && error.value.retry) {
    error.value.retry();
  }
};
</script>

<template>
  <Root v-if="error" class="errorIndicator-root">
    <div class="errorIndicator-title">{{ error.type === 'init' ? 'Initialization Error' : 'Update Error' }}</div>
    <p>Error type: {{ JSON.stringify(error.type) }}</p>
    <button @click="retry">Retry</button>
  </Root>
</template>

<style scoped>
.errorIndicator-root {
  grid-area: error-indicator;
  color: hsl(0, 0%, 91%);
  background-color: var(--color-error);
  padding: var(--size-card-padding);
  border-radius: var(--shape-card-border-radius);
  margin-bottom: 1.5em;
  box-shadow: var(--shadow-card);
}
.errorIndicator-title {
  margin-top: 0;
}
</style>
