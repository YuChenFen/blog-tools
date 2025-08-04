<template>
    <div class="wgsl-editor">
        <vue-monaco-editor v-model:value="shaderText" :options="{}" language="wgsl" />
    </div>
</template>

<script setup>
import { useAttrs } from 'vue';

const shaderText = useAttrs().params.params.shaderText;
</script>

<style scoped>
.wgsl-editor {
    height: 100%;
}
</style>