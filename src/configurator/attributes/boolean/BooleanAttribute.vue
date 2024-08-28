<script setup lang="ts">
import SatisfactionIndicator from "../SatisfactionIndicator.vue";
import ValueSelection from "./ValueSelection.vue";
</script>

<template>
  <div class="boolean-attribute">
    <ValueSelection/>
    <div class="indicators">
      <SatisfactionIndicator/>
    </div>
  </div>
</template>

<style scoped>
.boolean-attribute {
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
