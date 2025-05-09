<template>
    <div style="height: 100%;overflow-y: auto;padding: 10px;">
        <wc-waterfall :gap="10" :cols="cols">
            <el-image v-for="(url, index) in urls" :preview-src-list="urls" :initial-index="index"
                :hide-on-click-modal="true" :key="index" :src="urls[index]" lazy
                style="border-radius: 5px;min-height: 100px;">
                <template #placeholder>
                    <div class="loader-container">
                        <div class="loader"></div>
                    </div>
                </template>
                <template #error>
                    <div class="image-error">
                        <el-icon size="40px">
                            <Picture />
                        </el-icon>
                    </div>
                </template>
            </el-image>
        </wc-waterfall>
        <div class="empty" v-if="urls.length === 0">
            <div>暂无数据</div>
        </div>
    </div>
</template>

<script setup>
import 'wc-waterfall'
import { Picture } from '@element-plus/icons-vue'
import { useImageApiShowStore } from './store';
import { storeToRefs } from 'pinia'


const { cols, urls } = storeToRefs(useImageApiShowStore())
</script>

<style scoped>
wc-waterfall :deep(.el-image) {
    position: absolute;
}

.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
    font-size: 2rem;
    text-align: center;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    height: 100%;
    width: 100%;
    min-height: 100px;
}

.loader {
    width: 40px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #f03355;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    animation: l1 2s infinite cubic-bezier(0.3, 1, 0, 1);
}

@keyframes l1 {
    33% {
        border-radius: 0;
        background: #514b82;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)
    }

    66% {
        border-radius: 0;
        background: #ffa516;
        clip-path: polygon(50% 0, 50% 0, 100% 100%, 0 100%)
    }
}

.image-error {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.image-error .el-icon {
    font-size: 30px;
}
</style>
