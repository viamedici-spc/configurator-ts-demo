<template>
<div class="attribute-item-root">
    <div class="label">
        {{ attributeIdToString(attributeId!) }}
    </div>
    <template v-if="isAttributeReady">
        <AttributeTypeSelector :attribute="attribute" />
    </template>
    <template v-else>
        <span>Loading attributes...</span>
    </template>
</div>
</template>

<script lang="ts">
import {
    Attribute,
    AttributeType,
    GlobalAttributeId,
} from "@viamedici-spc/configurator-ts";
import {
    PropType,
    defineComponent,
    h,
    inject,
    computed,
    provide,
    ref,
    watch,
    Ref,
} from "vue";
import ComponentAttribute from "./component/ComponentAttribute.vue";
import ChoiceAttribute from "./choice/ChoiceAttribute.vue";
import BooleanAttribute from "./boolean/BooleanAttribute.vue";
import NumericAttribute from "./numeric/NumericAttribute.vue";
import {
    attributeIdToString
} from "../../utils/Naming";
import {
   useAttributesRef
} from "../../utils/useAttributes";

const activeAttributeContext = Symbol("activeAttributeContext");
 
export const useActiveAttribute = (): Ref<GlobalAttributeId> | null => {
    return inject<Ref<GlobalAttributeId> | null>(activeAttributeContext, null);
};

const AttributeTypeSelector = defineComponent({
    props: {
        attribute: Object as PropType < Attribute > ,
    },
    components: {
        ComponentAttribute,
        ChoiceAttribute,
        BooleanAttribute,
        NumericAttribute,
    },
    setup(props) {
        return () => {
            switch (props.attribute?.type) {
                case AttributeType.Choice:
                    return h(ChoiceAttribute);
                case AttributeType.Numeric:
                    return h(NumericAttribute);
                case AttributeType.Boolean:
                    return h(BooleanAttribute);
                case AttributeType.Component:
                    return h(ComponentAttribute);
                default:
                    return h("span", "Unknown attribute type");
            }
        };
    },
});

export default defineComponent({
    name: "AttributeItem",
    components: {
        AttributeTypeSelector,
    },
    props: {
        attributeId: Object as PropType < GlobalAttributeId > ,
    },
    setup(props) {
        
        // attributeId of each AttributeItem should be reactive so that we can inject it in any function that is of type ComputedRef
        const attributeId= ref(props.attributeId);

        const attributes = useAttributesRef([attributeId.value!], false);

        const attribute = computed(() => attributes.value[0]);

        const isAttributeReady = ref(false);

        provide(activeAttributeContext, attributeId);


        watch(
            attribute,
            (newVal) => {
                if (newVal) {
                    isAttributeReady.value = true;
                }
            }, {
                immediate: true
            }
        );

        return {
            attributeIdToString,
            attribute,
            isAttributeReady,
        };
    },
});
</script>

<style scoped>
.attribute-item-root {
    display: grid;
    grid-template-columns: [label] 0.4fr 0.5em [selection] 0.6fr;
    grid-template-rows: [label selection] auto;
}

.label {
    grid-area: label;
}
</style>
