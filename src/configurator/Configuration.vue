<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, onMounted } from "vue";
import {
  ConfigurationContextKey,
  provideConfigurationContext,
} from "../utils/contexts";
import {
  Configuration,
  ConfigurationModelSourceType,
  createClient,
} from "@viamedici-spc/configurator-ts";
import * as config from "../config";

const configuration = ref<Configuration | null>(null);

onMounted( async () => {
  const client = createClient({
    sessionHandler: {
      accessToken: config.hcaEngineAccessToken,
    },
    hcaEngineBaseUrl: config.hcaEngineEndpoint,
  });

  const session = await client.createSession({
    configurationModelSource: {
      type: ConfigurationModelSourceType.Channel,
      deploymentName: config.configurationModelPackage.deploymentName,
      channel: config.configurationModelPackage.channel,
    },
  });

  configuration.value = session.getConfiguration();

  console.log(session.getConfiguration());

});

provideConfigurationContext(configuration);
</script>
