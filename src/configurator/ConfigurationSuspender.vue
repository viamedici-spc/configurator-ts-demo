
<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useConfigurationInitializationContext } from '../utils/contexts';


const { isInitializingPromise } = useConfigurationInitializationContext();

if (isInitializingPromise?.promise) {
  throw isInitializingPromise.promise;
}
</script>
