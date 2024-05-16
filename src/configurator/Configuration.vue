<script setup lang="ts">
import {  provide } from 'vue';
import { useConfigurationManagement } from '../utils/useConfigurationManagement'
import {
  AllowedInExplain,
  AttributeRelations,
  ConfigurationModelSource,
  IConfiguratorClient,
  SessionContext,
} from "@viamedici-spc/configurator-ts";

const props = defineProps({
    configuratorClient: Object as () => IConfiguratorClient,
    configurationModelSource: Object as () => ConfigurationModelSource,
    attributeRelations: Object as () => AttributeRelations,
    usageRuleParameters: Object as () => Record<string, string>,
    allowedInExplain: Object as () => AllowedInExplain,
});

const { configuratorClient, ...sessionContext} = props;

useConfigurationManagement({
    configuratorClient,
    sessionContext
})
</script>

<script lang="ts">
export default {
  name: "Configuration",
};
</script>

<template>
  <div>Configuration</div>
  <!-- slots to recognize and accept children props-->
  <slot></slot>
</template>
