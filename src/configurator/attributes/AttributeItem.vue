<template>
  <Root class="attributeItem-root">
    <Label>Label of Attribute</Label>
    <p>{{ attributeId.localId }}</p>
    <!--"attribute" should be called from useAttributes just as in the react demo -->
    <AttributeTypeSelector :attribute="attribute" />
  </Root>
</template>

<script lang="ts">
import { Attribute, AttributeType } from "@viamedici-spc/configurator-ts";
import Root from "../../components/Root.vue";
import Label from "../../components/Label.vue";
import { PropType, defineComponent, h } from "vue";
import ComponentAttribute from "./component/ComponentAttribute.vue";
import ChoiceAttribute from "./choice/ChoiceAttribute.vue";
import BooleanAttribute from "./boolean/BooleanAttribute.vue";
import NumericAttribute from "./numeric/NumericAttribute.vue";

interface AttributeId {
  localId: string;
  [key: string]: any;
}

const AttributeTypeSelector = defineComponent({
  props: {
    attribute: {
      type: Object as PropType<Attribute>,
      required: true,
    },
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
        case null:
        case undefined: 
        return h('span', 'Attribute not found !')
        default:
        return h('span', 'Unknown attribute type')
      }
    };
  },
});

export default defineComponent({
  name: "AttributeItem",
  components: {
    Root,
    Label,
    AttributeTypeSelector,
  },
  props: {
    attributeId: {
      type: Object as PropType<AttributeId>,
      required: true,
    },
    attribute: {
      type: Object as PropType<Attribute>,
      required: true,
    },
  },
});
</script>

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
