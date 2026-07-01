<script setup lang="ts">
import {ref, shallowReadonly, shallowRef} from "vue";
import {provideCanResetConfiguration, provideConfiguration, provideSession,} from "../utils/Contexts";
import {
  AllowedRulesInExplainType,
  AttributeType,
  ChoiceValueDecisionState,
  Configuration,
  ConfigurationModelSourceType,
  IConfigurationSession,
  SessionFactory,
} from "@viamedici-spc/configurator-ts";
import * as config from "../Config";
import type {SalesRegion} from "./SalesRegion";
import Attributes from "./attributes/Attributes.vue";
import ConfigurationSatisfactionIndication from "./ConfigurationSatisfactionIndication.vue";
import ConfigurationMenu from "./Menu.vue";
import StoringMenu from "./StoringMenu.vue";

// The Sales Region selector is hard-coded: its value is sent as a Fixed Decision when the session is created (empty =
// none). The same attribute is also shown dynamically in the list to reveal the effect of fixing it. The parent owns
// the value (and re-mounts this component via :key on change) so the box can sit in the control-box row.
const props = defineProps<{ salesRegion: SalesRegion | "" }>();
const emit = defineEmits<{ "update:salesRegion": [region: SalesRegion | ""] }>();

function onSalesRegionChange(event: Event) {
  emit("update:salesRegion", (event.target as HTMLSelectElement).value as SalesRegion | "");
}

const session = await SessionFactory.createSession({
  apiBaseUrl: config.hcaEngineEndpoint,
  sessionInitialisationOptions: {
    accessToken: config.hcaEngineAccessToken
  },
  configurationModelSource: {
    type: ConfigurationModelSourceType.Channel,
    deploymentName: config.configurationModelPackage.deploymentName,
    channel: config.configurationModelPackage.channel,
  },
  allowedInExplain: {
    rules: {type: AllowedRulesInExplainType.all}
  },
  fixedDecisions: props.salesRegion ? [{
    type: AttributeType.Choice,
    attributeId: {sharedConfigurationModelId: "SalesShared", localId: "SalesRegion"},
    choiceValueId: props.salesRegion,
    state: ChoiceValueDecisionState.Included
  }] : undefined
});

const sessionRef = shallowReadonly<IConfigurationSession>(session);
provideSession(sessionRef);

const configurationRef = shallowRef<Configuration>(session.getConfiguration());
provideConfiguration(configurationRef);

session.addConfigurationChangedListener((c) => {
  configurationRef.value = c;
  console.log("Configuration changed", c);
});

const canResetConfigurationRef = ref<boolean>(session.canResetConfiguration());
provideCanResetConfiguration(canResetConfigurationRef);

session.addCanResetConfigurationChangedListener((b) => {
  canResetConfigurationRef.value = b;
  console.log("CanResetConfiguration changed", b);
});

</script>

<template>
  <div class="configurator">
    <div class="header">
      <h1>Demo Configurator with Vue.js</h1>
    </div>
    <label class="sales-region">
      Sales Region (fixed):
      <select :value="props.salesRegion" @change="onSalesRegionChange">
        <option value="">(none)</option>
        <option v-for="region in ['EU', 'US']" :key="region" :value="region">{{ region }}</option>
      </select>
    </label>
    <ConfigurationSatisfactionIndication/>
    <StoringMenu/>
    <ConfigurationMenu/>
    <div class="main">
      <Attributes/>
    </div>
  </div>
</template>

<style scoped>
.configurator {
  max-width: 1250px;
  flex-grow: 1;
  display: grid;
  grid-template-rows: [header] auto [satisfaction menu storing-menu sales-region] auto [gap] 1em [main] auto;
  grid-template-columns: [satisfaction header-start main-start] 1fr [gap] 1em [sales-region] auto [gap] 1em [storing-menu] auto [gap] 1em [menu] auto [header-end main-end];
  align-content: start;
}

.header {
  grid-area: header;
  display: grid;
  grid-template-columns: [title] 1fr auto;
  margin-top: 1em;
}

.sales-region {
  grid-area: sales-region;
  display: flex;
  align-items: center;
  gap: 0.5em;
  background-color: var(--color-base-1);
  padding: var(--size-card-padding);
  border-radius: var(--shape-card-border-radius);
  box-shadow: var(--shadow-card);
}

.main {
  grid-area: main;
  display: grid;
}
</style>
