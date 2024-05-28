<script lang="ts">
import Configurator from "./configurator/Configurator.vue";
import './globalStyles.css';

export default {
  components: {
    Configurator,
  }
}

</script>

<template>
  <div class="app">
    <Configurator/>
    <div class="header"></div>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  padding: 1em;
  display: flex;
  justify-content: center;
}
</style>
