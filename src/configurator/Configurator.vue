<script setup lang="ts">
import {shallowRef, shallowReadonly} from "vue";
import {
  provideConfiguration,
  provideSession,
} from "../utils/Contexts";
import {
  ConfigurationModelSourceType,
  Configuration,
  IConfigurationSession, SessionFactory,
} from "@viamedici-spc/configurator-ts";
import * as config from "../Config";
import Attributes from "./attributes/Attributes.vue";
import ConfigurationSatisfactionIndication from "./ConfigurationSatisfactionIndication.vue";

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
});

const sessionRef = shallowReadonly<IConfigurationSession>(session);
provideSession(sessionRef);

const configurationRef = shallowRef<Configuration>(session.getConfiguration());
provideConfiguration(configurationRef);

session.addConfigurationChangedListener((c) => {
  configurationRef.value = c;
  console.log(c);
});

</script>

<template>
  <div class="configurator">
    <div class="header">
      <h1>Demo Configurator with Vue.js</h1>
    </div>
    <ConfigurationSatisfactionIndication/>
    <div class="main">
      <Attributes/>
    </div>
  </div>
</template>

<style scoped>
.configurator {
  max-width: 1250px;
  flex-grow: 1;
}

.header {
  display: grid;
  grid-template-columns: [title] 1fr auto;
  margin-top: 1em;
}

.main {
  display: grid;
}
</style>
