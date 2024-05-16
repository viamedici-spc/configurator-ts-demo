<script lang="ts">
import AttributeItem from "./AttributeItem.vue";

export default {
    components: {
        AttributeItem
    }
}
</script>

<template>
    <div>
        <AttributeItem :attributes="['SalesRegion', 'Construction', 'Transmission', 'TransmissionType', 'EngineType', 'HeavyDuty', 'HorsePower', 'Accessories']"></AttributeItem>
    </div>
</template>
