<!-- <template>
  <slot></slot>
</template>

<script setup lang="ts">
import { useConfigurationInitialization } from '../utils/ConfigurationLifeCylce';


const { isInitializingPromise } = useConfigurationInitialization();

if (isInitializingPromise?.promise) {
  throw isInitializingPromise.promise;
}
</script> -->
