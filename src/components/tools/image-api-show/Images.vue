<template>
    <div style="height: 100%;overflow-y: auto;padding: 10px;">
        <wc-waterfall :gap="10" :cols="cols">
            <el-image v-for="(url, index) in urls" :preview-src-list="urls" :initial-index="index"
                :hide-on-click-modal="true" :key="index" :src="urls[index]" lazy style="border-radius: 5px;" />
        </wc-waterfall>
    </div>
</template>

<script setup>
import 'wc-waterfall'
import { useImageApiShowStore } from './store';
import { storeToRefs } from 'pinia'


const { cols, urls } = storeToRefs(useImageApiShowStore())
</script>

<style scoped>
wc-waterfall :deep(.el-image) {
    position: absolute;
}
</style>
