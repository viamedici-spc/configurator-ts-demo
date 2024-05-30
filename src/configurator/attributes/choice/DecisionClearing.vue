<template>
    <div class="decision-clearing-root">
        <button @click="onClick">Clear decisions</button>
    </div>
</template>

<script setup lang="ts">
import { useChoiceAttributeRef } from '../../../utils/useAttributes';
import { useActiveAttribute } from '../AttributeItem.vue';

 const activeAttribute = useActiveAttribute();
 const clearDecisions = useChoiceAttributeRef(activeAttribute!.value);

 const onClick = async()=>{
    alert(clearDecisions?.value.explain);
 }


</script>

<style scoped>
.decision-clearing-root{
    grid-area: label;
    display: flex;
    justify-content: end;
    align-self: start;
}
</style>