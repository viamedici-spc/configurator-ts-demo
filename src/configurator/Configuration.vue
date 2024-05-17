<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {  provide, ref, onMounted } from "vue";
import {
  ConfigurationModelSourceType,
  createClient,
} from "@viamedici-spc/configurator-ts";
import * as config from "../config";
import { createLogger } from "vite";
onMounted(() => {
  console.log("Mounted");
});

const client = createClient({
  sessionHandler: { accessToken: config.hcaEngineAccessToken },
  hcaEngineBaseUrl: config.hcaEngineEndpoint,
});

const session = await client.createSession({
  configurationModelSource: {
    type: ConfigurationModelSourceType.Channel,
    deploymentName: config.configurationModelPackage.deploymentName,
    channel: config.configurationModelPackage.channel,
  },
});

console.log(session.getConfiguration())

// Provide context values
</script>
