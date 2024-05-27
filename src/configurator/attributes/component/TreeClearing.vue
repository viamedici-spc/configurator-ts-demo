<template>
<div class="treeClearing-root">
    <button @click="onClick">Clear Subtree</button>
</div>
</template>

<script setup lang="ts">
import { useActiveAttribute } from '../AttributeItem.vue';
import { useComponentAttribute } from "../../../utils/useAttributes";
import { handleError } from '../../../utils/PromiseErrorHandling';
import { useStore } from 'vuex';

const store = useStore();

const activeAttribute = useActiveAttribute();
const {clearSubtree} = useComponentAttribute(activeAttribute!);

const onClick = async () => {
 await handleError(() => clearSubtree());
 store.commit("setRerender");
}

</script>

<style scoped>
.treeClearing-root{
    grid-area: label;
    display: flex;
    justify-content: end;
    align-self: start;
}
</style>