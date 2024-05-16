<script lang="ts">
import Configurator from "./configurator/Configurator.vue";
import Root from "./components/Root.vue";

export default {
  components: {
    Configurator,
    Root
  }
}
</script>

<template>
  <Root class="root">
    <Configurator />
  </Root>
</template>

<style scoped>
.root {
  height: 100vh;
  padding: 1em;
  display: flex;
  justify-content: center;
}
</style>
