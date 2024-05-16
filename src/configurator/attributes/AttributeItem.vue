<script lang="ts">
import Root from '../../components/Root.vue';
export default {
    name: 'AttributeItem',
    props: {
        attributes: {
            type: Array,
            required: true
        }
    }
}
</script>

<template>
    <Root class="attributeItem-root">
        <p v-for="attribute in attributes" :key="attribute">{{ attribute }}</p>
    </Root>
</template>

<style scoped>
.attributeItem-root{
    display: grid;
    grid-template-columns: [label] 0.4fr 0.5em [selection] 0.6fr;
    grid-template-rows: [label selection] auto;
}
</style>