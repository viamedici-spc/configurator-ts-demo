<script setup lang="ts">
import Configurator from "./configurator/Configurator.vue";
</script>

<template>
  <div class="app">
    <Suspense>
      <Configurator/>

      <template #fallback>
        Configuration loading …
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 1em;
  display: flex;
  justify-content: center;
}
</style>
