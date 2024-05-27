<template>
  <!-- <DecisionClearing /> -->
    <div class="choiceAttribute-root">
      <ValueSelection />
      <div class="indicators">
        <SatisfactionIndicator />
        <Indicators />
    </div>
    </div>
</template>

<script lang="ts">
import { defineComponent} from "vue";
import Indicators from "./Indicators.vue";
import ValueSelection from "./ValueSelection.vue";
import SatisfactionIndicator from "../SatisfactionIndicator.vue";
import DecisionClearing from "./DecisionClearing.vue";

export default defineComponent({
  name: "DropdownMenu",
  components: {
    Indicators,
    ValueSelection,
    SatisfactionIndicator,
    DecisionClearing,
  },
})

</script>

<style scoped>
.choiceAttribute-root {
  grid-area: selection;
  display: grid;
  grid-template-rows: [value-selection] auto [gap] 0.2em [indicators] auto;
  grid-template-columns: [value-selection indicators] 1fr;
}

.indicators {
  grid-area: indicators;
  font-size: 0.8em;
}
</style>
