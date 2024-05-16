<script lang="ts">
import Root from '../components/Root.vue';
</script>

<template>
<Root class="errorIndicator-root">
    <div class="errorIndicator-title">
       Initialization Error
    </div>
    <p>
        Error type: Error
    </p>
    <button>Retry</button>
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
.errorIndicator-title{
    margin-top: 0;
}
</style>
