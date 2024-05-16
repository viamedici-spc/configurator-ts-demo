<script lang="ts">
import AttributeItem from "./AttributeItem.vue";
import Root from "../../components/Root.vue";
export default {
    components: {
        AttributeItem
    }
}
</script>

<template>
    <Root class="attributes-root">
        <AttributeItem :attributes="['SalesRegion', 'Construction', 'Transmission', 'TransmissionType', 'EngineType', 'HeavyDuty', 'HorsePower', 'Accessories']"></AttributeItem>
    </Root>
</template>

<style scoped>
.attributes-root{
    grid-area: attributes;
    display: grid;
    grid-auto-flow: row;
    align-content: start;
    gap: 1em;
    background-color: var(--color-base-1);
    padding: var(--size-card-padding);
    border-radius: var(--shape-card-border-radius);
    box-shadow: var(--shadow-card);
}
</style>