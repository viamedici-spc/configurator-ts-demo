<script setup lang="ts">
import {ref} from "vue";
import Configurator from "./configurator/Configurator.vue";
import type {SalesRegion} from "./configurator/SalesRegion";

// The parent owns the Sales Region so it survives the Configurator re-mount (:key) that creates a fresh session for
// the selected region. Empty by default = no Fixed Decision is sent.
const salesRegion = ref<SalesRegion | "">("");
</script>

<template>
  <div class="app">
    <Suspense>
      <Configurator :sales-region="salesRegion" :key="salesRegion"
                    @update:sales-region="salesRegion = $event"/>

      <template #fallback>
        Configuration loading …
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 1em;
  display: flex;
  justify-content: center;
}
</style>
