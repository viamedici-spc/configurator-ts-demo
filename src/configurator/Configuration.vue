<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { provideConfigurationContext, provideConfigurationInitializationContext, provideConfigurationUpdatingContext, provideSessionContext } from "../utils/contexts";
import {
  Configuration,
  ConfigurationModelSourceType,
  IConfigurationSession,
  IConfiguratorClient,
  createClient,
} from "@viamedici-spc/configurator-ts";
import * as config from "../config";
import { ConfigurationInitialization, ConfigurationUpdating } from "../utils/types";

const client = ref<IConfiguratorClient | null>(null);
const configuration = ref<Configuration | null>(null);
const session = ref<IConfigurationSession | null>(null);
const initialization = ref<ConfigurationInitialization | null>(null);
const updating = ref<ConfigurationUpdating | null>(null);

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

  configuration.value = session.value.getConfiguration();

  console.log(session.value.getConfiguration());
});

provideConfigurationContext(configuration);
provideSessionContext(session);
provideConfigurationInitializationContext(initialization);
provideConfigurationUpdatingContext(updating);
</script>
