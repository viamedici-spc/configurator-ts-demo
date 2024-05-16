<script lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import Root from "./Root.vue";

export default {
  components: {
    HelloWorld,
    Root
  }
}
</script>

<template>
  <Root class="root">
    <HelloWorld msg="Demo Configurator with Vue.js" />
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
