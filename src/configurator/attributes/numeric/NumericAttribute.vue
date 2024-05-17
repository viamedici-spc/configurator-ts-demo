<template>
<div class="root">
   NumericAttribute
</div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.root {
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
