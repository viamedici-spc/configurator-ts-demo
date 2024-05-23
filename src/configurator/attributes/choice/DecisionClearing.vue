<template>
    <div class="root">
        <button @click="onClick">Clear decisions</button>
    </div>
</template>

<script setup lang="ts">
import { useChoiceAttribute } from '../../../utils/useAttributes';
import { useActiveAttribute } from '../AttributeItem.vue';

 const activeAttribute = useActiveAttribute();
 const attribute = useChoiceAttribute(activeAttribute!);
 const clearDecisions = useChoiceAttribute(activeAttribute!);

 const onClick = async()=>{
    alert(clearDecisions?.explain);
 }


</script>

<style scoped>
.root{
    grid-area: label;
    display: flex;
    justify-content: end;
    align-self: start;
}
</style>