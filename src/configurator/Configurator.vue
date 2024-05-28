<script setup lang="ts">
import {ref, onMounted} from "vue";
import {
  provideConfigurationContext,
  provideSessionContext,
} from "../utils/contexts";
// import ErrorIndicator from "./ErrorIndicator.vue";
import {
  ConfigurationModelSourceType,
  createClient,
  Configuration,
  IConfigurationSession,
  IConfiguratorClient,
} from "@viamedici-spc/configurator-ts";
import * as config from "../config";
import Attributes from "./attributes/Attributes.vue";
import ConfigurationSatisfactionIndication from "./ConfigurationSatisfactionIndication.vue";

const client = ref<IConfiguratorClient | null>(null);
const configuration = ref<Configuration | null>(null);
const session = ref<IConfigurationSession | null>(null);
const isConfigured = ref(false);

onMounted(async () => {
  client.value = createClient({
    sessionHandler: {
      accessToken: config.hcaEngineAccessToken,
    },
    hcaEngineBaseUrl: config.hcaEngineEndpoint,
  });


  session.value = await client.value.createSession({
    configurationModelSource: {
      type: ConfigurationModelSourceType.Channel,
      deploymentName: config.configurationModelPackage.deploymentName,
      channel: config.configurationModelPackage.channel,
    },
  });
  session.value.setOnConfigurationChangedHandler((c) => {
    configuration.value = c;
    console.log(c);
  });
  configuration.value = session.value.getConfiguration();
  if (configuration.value) isConfigured.value = true;
  console.log(session.value.getConfiguration());
});

provideConfigurationContext(configuration);
provideSessionContext(session);
</script>

<template>
  <div class="configurator">
    <h1 class="header">Configurator Vue.js Demo</h1>
    <template v-if="!isConfigured">
      <span>Configuration loading …</span>
    </template>
    <template v-if="isConfigured">
      <div>
        <ConfigurationSatisfactionIndication/>
        <div class="main">
          <!-- <ErrorIndicator /> -->
          <Attributes/>
        </div>
      </div>
    </template>
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
  grid-template-rows: [error-indicator attributes] auto;
  grid-template-columns: [error-indicator attributes] 1fr;
}
</style>
