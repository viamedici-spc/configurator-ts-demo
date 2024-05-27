<template>
<div class="numeric-root">
   <ValueSelection />
   <div class="indicators">
    <SatisfactionIndicator />
    <Indicators />
   </div>
</div>
</template>

<script setup lang="ts">
import SatisfactionIndicator from '../SatisfactionIndicator.vue';
import Indicators from './Indicators.vue';
import ValueSelection from './ValueSelection.vue';

</script>

<style scoped>
.numeric-root {
    grid-area: selection;
    display: grid;
    grid-template-rows: [value-selection] auto [gap] 0.2em [indicators] auto;
    grid-template-columns: [value-selection indicators] 1fr;
}

.indicators {
    grid-area: indicators;
    font-size: 0.8em;
}
</style>
