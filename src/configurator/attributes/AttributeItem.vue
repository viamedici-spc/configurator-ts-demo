<script lang="ts">
import Root from '../../components/Root.vue';
import Label from '../../components/Label.vue';
import { PropType, defineComponent } from 'vue';

interface AttributeId{
    localId: string,
    [key: string]: any;
}

export default defineComponent({
    name: 'AttributeItem',
    components: {
        Root,
        Label
    },
    props: {
        attributeId: {
            type: Object as PropType<AttributeId>,
            required: true
        }
    }
})

</script>

<template>
<Root class="attributeItem-root">
    <Label> Label of Attribute</Label>
    <p>{{ attributeId.localId}}</p>
</Root>
</template>

<style scoped>
.attributeItem-root {
    display: grid;
    grid-template-columns: [label] 0.4fr 0.5em [selection] 0.6fr;
    grid-template-rows: [label selection] auto;
}

.attributeItem-label {
    grid-area: label;
}
</style>
