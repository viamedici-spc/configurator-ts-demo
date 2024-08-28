<script setup lang="ts">
import Indicators from "./Indicators.vue";
import ValueSelection from "./ValueSelection.vue";
import SatisfactionIndicator from "../SatisfactionIndicator.vue";
</script>

<template>
  <div class="choice-attribute">
    <ValueSelection/>
    <div class="indicators">
      <SatisfactionIndicator/>
      <span> · </span>
      <Indicators/>
    </div>
  </div>
</template>

<style scoped>
.choice-attribute {
  grid-area: selection;
  display: grid;
  grid-template-rows: [value-selection] auto [gap] 0.2em [indicators] 1.2em;
  grid-template-columns: [value-selection indicators] 1fr;
}

.indicators {
  grid-area: indicators;
  font-size: 0.8em;
}
</style>
