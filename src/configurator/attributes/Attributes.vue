<script setup lang="ts">
import AttributeItem from "./AttributeItem.vue";
</script>

<template>
  <div class="attributes">
    <AttributeItem :attributeId="{sharedConfigurationModelId: 'SalesShared', localId: 'SalesRegion'}"/>
    <AttributeItem :attributeId="{localId: 'Construction'}"/>
    <AttributeItem :attributeId="{localId: 'Transmission'}"/>
    <AttributeItem :attributeId="{componentPath: ['Transmission'], localId: 'Type'}"/>
    <AttributeItem :attributeId="{localId: 'EngineType'}"/>
    <AttributeItem :attributeId="{localId: 'HeavyDuty'}"/>
    <AttributeItem :attributeId="{localId: 'HorsePower'}"/>
    <AttributeItem :attributeId="{localId: 'Accessories'}"/>
  </div>
</template>

<style scoped>
.attributes {
  grid-area: inherit;
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
