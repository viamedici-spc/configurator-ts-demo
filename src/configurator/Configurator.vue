<script setup lang="ts">
import {ref, shallowReadonly, shallowRef} from "vue";
import {provideCanResetConfiguration, provideConfiguration, provideSession,} from "../utils/Contexts";
import {
  AllowedRulesInExplainType,
  Configuration,
  ConfigurationModelSourceType,
  IConfigurationSession,
  SessionFactory,
} from "@viamedici-spc/configurator-ts";
import * as config from "../Config";
import Attributes from "./attributes/Attributes.vue";
import ConfigurationSatisfactionIndication from "./ConfigurationSatisfactionIndication.vue";
import ConfigurationMenu from "./Menu.vue";
import StoringMenu from "./StoringMenu.vue";

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
  }
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
  grid-template-rows: [header] auto [satisfaction menu storing-menu] auto [gap] 1em [main] auto;
  grid-template-columns: [satisfaction header-start main-start] 1fr [gap] 1em [storing-menu] auto [gap] 1em [menu] auto [header-end main-end];
  align-content: start;
}

.header {
  grid-area: header;
  display: grid;
  grid-template-columns: [title] 1fr auto;
  margin-top: 1em;
}

.main {
  grid-area: main;
  display: grid;
}
</style>
