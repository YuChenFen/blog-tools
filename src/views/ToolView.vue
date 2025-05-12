<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const toolName = computed(() => route.params.toolName)

const toolComponents = {
    'image-to-base64': defineAsyncComponent(() => import('../components/tools/image-and-base64/index.vue')),
    'svg-filters': defineAsyncComponent(() => import('../components/tools/svg-filters/index.vue')),
    'qr-code': defineAsyncComponent(() => import('../components/tools/qr-code/index.vue')),
    'color-contrast': defineAsyncComponent(() => import('../components/tools/color-contrast/index.vue')),
    'image-api-show': defineAsyncComponent(() => import('../components/tools/image-api-show/index.vue')),
    'github-release-statistics': defineAsyncComponent(() => import('../components/tools/gitHub-release-statistics/index.vue')),
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
    height: 100vh;
}
</style>