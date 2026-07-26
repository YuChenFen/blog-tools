<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const toolName = computed(() => route.params.toolName)

const toolComponents = {
    'image-to-base64': defineAsyncComponent(() => import('../tools/image-and-base64/index.vue')),
    'svg-filters': defineAsyncComponent(() => import('../tools/svg-filters/index.vue')),
    'qr-code': defineAsyncComponent(() => import('../tools/qr-code/index.vue')),
    'color-contrast': defineAsyncComponent(() => import('../tools/color-contrast/index.vue')),
    'image-api-show': defineAsyncComponent(() => import('../tools/image-api-show/index.vue')),
    'github-release-statistics': defineAsyncComponent(() => import('../tools/gitHub-release-statistics/index.vue')),
    'pdf-book': defineAsyncComponent(() => import('../tools/pdf-book/index.vue')),
    'fourier': defineAsyncComponent(() => import('../tools/fourier/index.vue')),
    'boids': defineAsyncComponent(() => import('../tools/boids/index.vue')),
    'wgsl-editor': defineAsyncComponent(() => import('../tools/wgsl-editor/index.vue')),
    'random-video': defineAsyncComponent(() => import('../tools/random-video/index.vue')),
    'panorama-preview': defineAsyncComponent(() => import('../tools/panorama-preview/index.vue')),
    '3d-particles':defineAsyncComponent(() => import('../tools/3d-particles/index.vue')), 
    'ouroboros':defineAsyncComponent(() => import('../tools/ouroboros/index.vue'))
}

const currentToolComponent = computed(() => {
    return toolComponents[toolName.value] || null
})
</script>

<template>
    <div class="tool-view">
        <component :is="currentToolComponent" v-if="currentToolComponent" />
        <el-empty v-else description="工具未找到" />
    </div>
</template>

<style scoped>
.tool-view {
    margin: 0 auto;
    height: 100dvh;
}
</style>