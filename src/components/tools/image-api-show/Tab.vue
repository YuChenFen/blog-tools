<template>
    <div style="width: 100%;display: flex;align-items: center;height: 100%;padding: 0 5px;">
        <div>{{ params.api.id }}</div>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
const params = attrs.params;
// console.log(attrs);
</script>
