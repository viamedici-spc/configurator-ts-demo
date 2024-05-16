<script lang="ts">
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
    <div>
        <p v-for="attribute in attributes" :key="attribute">{{ attribute }}</p>
    </div>
</template>