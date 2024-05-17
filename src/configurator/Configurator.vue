<script setup lang="ts">
import Configuration from "./Configuration.vue";
import ErrorIndicator from "./ErrorIndicator.vue";
import {
  AllowedRulesInExplainType,
  ClientSideLifeTimeHandlerOptions,
  ConfigurationModelFromChannel,
  ConfigurationModelSourceType,
  createClient,
} from "@viamedici-spc/configurator-ts";
import { ConfigurationSuspender } from "@viamedici-spc/configurator-react";
import * as config from "../config";
import Root from "../components/Root.vue";
import Attributes from "./attributes/Attributes.vue";

const configuratorClient = createClient({
  sessionHandler: {
    accessToken: config.hcaEngineAccessToken,
  } satisfies ClientSideLifeTimeHandlerOptions,
  hcaEngineBaseUrl: config.hcaEngineEndpoint,
});
const configurationModelSource = {
  type: ConfigurationModelSourceType.Channel,
  deploymentName: config.configurationModelPackage.deploymentName,
  channel: config.configurationModelPackage.channel,
} satisfies ConfigurationModelFromChannel;
</script>

<template>
  <Root class="configurator-root">
    <div class="configurator-header">Configurator Vue.js Demo</div>

    <Suspense>
      <template #fallback>
        <span>Configuration loading …</span>
      </template>
      <template #default>
        <Configuration
          :configuratorClient="configuratorClient"
          :configurationModelSource="configurationModelSource"
          :allowedInExplain="{ rules: { type: AllowedRulesInExplainType.all } }"
        >
          <div class="configurator-main">
            <ErrorIndicator />
            <ConfigurationSuspender>
              <Attributes />
            </ConfigurationSuspender>
          </div>
        </Configuration>
      </template>
    </Suspense>
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
.configurator-main {
  display: grid;
  grid-template-rows: [error-indicator attributes] auto;
  grid-template-columns: [error-indicator attributes] 1fr;
}
</style>
