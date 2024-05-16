<script setup lang="ts">
import Attributes from './attributes/Attributes.vue';
import { ref } from 'vue';
const message = ref("Viamedici Smart Product Configurator Demo with Vue js");
</script>

<template>
  <div>
    {{ message }}
  <div>
    <Attributes />
  </div>
  </div>
</template>
