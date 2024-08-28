<script setup lang="ts">
import {
  AttributeType, ConfigurationInterpreter,
} from "@viamedici-spc/configurator-ts";
import ComponentAttribute from "./component/ComponentAttribute.vue";
import ChoiceAttribute from "./choice/ChoiceAttribute.vue";
import BooleanAttribute from "./boolean/BooleanAttribute.vue";
import NumericAttribute from "./numeric/NumericAttribute.vue";
import {useActiveAttribute, useConfiguration} from "../../utils/Contexts";
import {computed} from "vue";

const activeAttribute = useActiveAttribute();
const configuration = useConfiguration();
const attribute = computed(() => ConfigurationInterpreter.getAttribute(configuration.value, activeAttribute.value));
</script>

<template>
  <ChoiceAttribute v-if="attribute?.type === AttributeType.Choice"/>
  <NumericAttribute v-if="attribute?.type === AttributeType.Numeric"/>
  <BooleanAttribute v-if="attribute?.type === AttributeType.Boolean"/>
  <ComponentAttribute v-if="attribute?.type === AttributeType.Component"/>
  <span v-if="attribute === undefined">Attribute not found</span>
</template>