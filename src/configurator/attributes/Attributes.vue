<script lang="ts">
import AttributeItem from "./AttributeItem.vue";
import Root from "../../components/Root.vue";
export default {
    components: {
        AttributeItem,
        Root,
    },
};
</script>

<template>
<Root class="attributes-root">
    <AttributeItem :attributeId="{sharedConfigurationModelId: 'SalesShared', localId: 'SalesRegion'}" />
    <AttributeItem :attributeId="{localId: 'Construction'}" />
    <AttributeItem :attributeId="{localId: 'Transmission'}" />
    <AttributeItem :attributeId="{componentPath: ['Transmission'], localId: 'Type'}" />
    <AttributeItem :attributeId="{localId: 'EngineType'}" />
    <AttributeItem :attributeId="{localId: 'HeavyDuty'}" />
    <AttributeItem :attributeId="{localId: 'HorsePower'}" />
    <AttributeItem :attributeId="{localId: 'Accessories'}" />
</Root>
</template>

<style scoped>
.attributes-root {
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
