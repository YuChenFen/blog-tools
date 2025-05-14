<template>
    <div style="height: 100%;overflow-y: auto;padding: 10px;">
        <wc-waterfall :gap="10" :cols="cols">
            <el-image v-for="(url, index) in urls" :preview-src-list="urls" :initial-index="index"
                :hide-on-click-modal="true" :key="index" :src="urls[index]" lazy
                style="border-radius: 5px;height: max-content;">
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
            <p>配置相关数据，点击上方的
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1rem"
                    height="1rem">
                    <path
                        d="M696.775111 512h184.718222a185.571556 185.571556 0 0 1-184.718222 184.718222A185.628444 185.628444 0 0 1 511.943111 512h184.832zM512 327.281778V142.506667a185.571556 185.571556 0 0 1 184.718222 184.775111A185.571556 185.571556 0 0 1 511.943111 512V327.281778z">
                    </path>
                    <path
                        d="M327.224889 512H512a185.571556 185.571556 0 0 0-184.718222-184.718222A185.571556 185.571556 0 0 0 142.449778 512h184.775111zM512 696.718222V512a185.571556 185.571556 0 0 0-184.775111 184.718222 185.628444 185.628444 0 0 0 184.718222 184.775111v-184.775111z">
                    </path>
                    <path
                        d="M39.992889 406.300444A483.441778 483.441778 0 0 0 28.444444 512a479.687111 479.687111 0 0 0 38.001778 188.245333A481.507556 481.507556 0 0 0 170.097778 853.902222a483.555556 483.555556 0 0 0 153.656889 103.651556A479.573333 479.573333 0 0 0 512 995.555556a480.142222 480.142222 0 0 0 188.245333-38.001778 482.190222 482.190222 0 0 0 216.007111-179.996445c15.985778-24.291556 29.752889-50.062222 41.301334-77.368889A479.630222 479.630222 0 0 0 995.555556 512a480.028444 480.028444 0 0 0-38.001778-188.245333A481.848889 481.848889 0 0 0 853.902222 170.097778 481.962667 481.962667 0 0 0 512 28.444444a480.028444 480.028444 0 0 0-188.245333 38.001778A481.848889 481.848889 0 0 0 170.097778 170.097778a481.678222 481.678222 0 0 0-103.594667 153.713778c-11.434667 26.908444-20.252444 54.385778-26.510222 82.488888z m55.751111 200.078223A426.780444 426.780444 0 0 1 85.333333 512a422.684444 422.684444 0 0 1 33.564445-166.115556 425.301333 425.301333 0 0 1 159.288889-190.976A425.528889 425.528889 0 0 1 512 85.333333a423.082667 423.082667 0 0 1 166.115556 33.564445 425.187556 425.187556 0 0 1 135.566222 91.420444A425.358222 425.358222 0 0 1 938.666667 512a423.424 423.424 0 0 1-33.564445 166.115556 425.813333 425.813333 0 0 1-159.288889 190.976A424.789333 424.789333 0 0 1 512 938.666667a423.537778 423.537778 0 0 1-166.115556-33.564445 425.130667 425.130667 0 0 1-135.566222-91.420444 427.064889 427.064889 0 0 1-91.477333-135.623111 422.684444 422.684444 0 0 1-23.096889-71.68z">
                    </path>
                </svg>
                图标即可获取图片
            </p>
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

wc-waterfall :deep(.el-image__wrapper) {
    height: max-content;
}

wc-waterfall :deep(.el-image:has(.loader-container)) {
    aspect-ratio: 16 / 9;
}

wc-waterfall :deep(.el-image-viewer__img) {
    max-width: 90% !important;
    max-height: 90% !important;
}

:deep(.el-image-viewer__mask) {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    opacity: 1;
}

.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
    font-size: 2rem;
    text-align: center;
    flex-direction: column;

    & p {
        margin-top: 10px;
        font-size: 1rem;
        color: #999;
        display: flex;
        align-items: center;
        gap: 5px;
        fill: #999;
    }
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    width: 100%;
    aspect-ratio: 16 / 9;
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
    aspect-ratio: 16 / 9;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.image-error .el-icon {
    font-size: 30px;
}
</style>
