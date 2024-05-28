<template>
  <div class="attributes-root">
    <AttributeItem
        v-for="attributeId in attributeIds"
        :key="`${attributeId.localId}-${rerenderTrigger}`"
        :attributeId="attributeId"
    />

    <AttributeItem :attributeId="{ sharedConfigurationModelId: 'SalesShared', localId: 'SalesRegion' }"/>
  </div>
</template>

<script setup lang="ts">
import AttributeItem from "./AttributeItem.vue";
import {ref, watch} from "vue";
import {useStore} from "vuex";

const store = useStore();
const rerenderTrigger = ref(0);
//
// watch(
//     () => store.state.rerender,
//     (newVal) => {
//       if (newVal) {
//         rerenderTrigger.value++;
//         console.log("Re-rendered:", rerenderTrigger.value, "time(s).");
//       } else {
//         console.log("No re-rendering is made so far by now!");
//       }
//     },
//     {immediate: true}
// );

const attributeIds = ref([
  {sharedConfigurationModelId: "SalesShared", localId: "SalesRegion"},
  {localId: "Construction"},
  {localId: "Transmission"},
  {componentPath: ["Transmission"], localId: "Type"},
  {localId: "EngineType"},
  {localId: "HeavyDuty"},
  {localId: "HorsePower"},
  {localId: "Accessories"},
]);
</script>

<style scoped>
.attributes-root {
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
