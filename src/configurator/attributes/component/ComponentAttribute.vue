<template>
  <TreeClearing />
  <div class="componentAttribute-root">
    <ValueSelection />
    <div class="indicators-root"><SatisfactionIndicator /></div>
  </div>
</template>

<script setup lang="ts">
import SatisfactionIndicator from "../SatisfactionIndicator.vue";
import TreeClearing from "./TreeClearing.vue";
import ValueSelection from "./ValueSelection.vue";
</script>

<style scoped>
.componentAttribute-root {
  grid-area: selection;
  display: grid;
  grid-template-rows: [value-selection] auto [gap] 0.2em [indicators] auto;
  grid-template-columns: [value-selection indicators] 1fr;
}
.indicators-root {
  grid-area: indicators;
  font-size: 0.8em;
}
</style>
