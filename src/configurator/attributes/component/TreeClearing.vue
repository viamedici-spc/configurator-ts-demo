<template>
<div class="tree-clearing-root">
    <button @click="onClick">Clear Subtree</button>
</div>
</template>

<script setup lang="ts">
import { useActiveAttribute } from '../AttributeItem.vue';
import { useComponentAttributeRef } from "../../../utils/useAttributes";
import { handleError } from '../../../utils/PromiseErrorHandling';


const activeAttribute = useActiveAttribute();
const {clearSubtree} = useComponentAttributeRef(activeAttribute!.value).value;

const onClick = async () => {
 await handleError(() => clearSubtree());
}

</script>

<style scoped>
.tree-clearing-root{
    grid-area: label;
    display: flex;
    justify-content: end;
    align-self: start;
}
</style>