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
  <div class="root">
    <Configurator />
  </div>
</template>

<style scoped>
.root {
  height: 100vh;
  padding: 1em;
  display: flex;
  justify-content: center;
}
</style>
