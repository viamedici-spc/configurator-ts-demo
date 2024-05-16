<script lang="ts">
import {
    ref,
    onMounted
} from 'vue';
import {
    useConfigurationInitialization,
    useConfigurationUpdating
} from "@viamedici-spc/configurator-react";
import Root from '../components/Root.vue';
import {
    UpdateError
} from 'vue';

export default ErrorIndicator() {
    name: 'updateError',
    setup() {
        const error = ref(null);
        const init = useConfigurationInitialization();
        const update = useConfigurationUpdating();

        onMounted(() => {
            error.value = init.error || update.error;
        });

        return {
            error
        };
    }
}
</script>

<template>
<Root v-if="error" class="errorIndicator-root">
    <div class="errorIndicator-title">{{ error.type === 'init' ? 'Initialization Error' : 'Update Error' }}</div>
    <p>Error type: {{ JSON.stringify(error.Type) }}</p>
    <button @click="error.retry">Retry</button>
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
