<script setup lang="ts">
// import Attributes from "./attributes/Attributes.vue";
import Configuration from "./Configuration.vue";
// import { ErrorIndicator } from "./ErrorIndicator.vue";
import {
  AllowedRulesInExplainType,
  ClientSideLifeTimeHandlerOptions,
  ConfigurationModelFromChannel,
  ConfigurationModelSourceType,
  createClient,
} from "@viamedici-spc/configurator-ts";
import * as config from "../config";
import Root from "../components/Root.vue";
const configuratorClient = createClient({
    sessionHandler: {accessToken: config.hcaEngineAccessToken} satisfies ClientSideLifeTimeHandlerOptions,
    hcaEngineBaseUrl: config.hcaEngineEndpoint
});
const configurationModelSource = {
    type: ConfigurationModelSourceType.Channel,
    deploymentName: config.configurationModelPackage.deploymentName,
    channel: config.configurationModelPackage.channel
} satisfies ConfigurationModelFromChannel;
</script>

<template>
  <Root class="configurator-root">
    <div class="configurator-header">Configurator Vue.js Demo</div>
    <div>
      <Configuration
        :configuratorClient="configuratorClient"
        :configurationModelSource="configurationModelSource"
        :allowedInExplain="{ rules: { type: AllowedRulesInExplainType.all } }"
      >
        <!-- <ConfigurationSatisfactorIndication /> -->
      </Configuration>
      <!-- <Attributes/> -->
      <div class="configurator-main">

      </div>
    </div>
  </Root>
</template>

<style scoped>
.configurator-root {
  max-width: 1250px;
  flex-grow: 1;
}
.configurator-header {
  display: grid;
  grid-template-columns: [title] 1fr auto;
  margin-top: 1em;
}
.configurator-main{
    display: grid;
    grid-template-rows:[error-indicator attributes] auto;
    grid-template-columns: [error-indicator attributes] 1fr;
}
</style>
