<script setup lang="ts">
import {handleExplain} from "../utils/Explain";
import {useCanResetConfiguration, useConfiguration, useSession} from "../utils/Contexts";
import {computed} from "vue";
import {ConfigurationInterpreter} from "@viamedici-spc/configurator-ts";

const configuration = useConfiguration();
const session = useSession();
const canResetConfiguration = useCanResetConfiguration();

</script>

<template>
  <div class="configuration-menu">
    <button
        class="reset-button"
        @click="session.resetConfiguration"
        :disabled="!canResetConfiguration">
      Reset Configuration
    </button>
    <button
        class="reset-button"
        @click="session.reinitialize">
      Re-initialize Configuration
    </button>
  </div>
</template>

<style scoped>
.configuration-menu {
  grid-area: menu;
  display: flex;
  flex-direction: column;
  gap: 1em;
  background-color: var(--color-base-1);
  padding: var(--size-card-padding);
  border-radius: var(--shape-card-border-radius);
  box-shadow: var(--shadow-card);
}

</style>
