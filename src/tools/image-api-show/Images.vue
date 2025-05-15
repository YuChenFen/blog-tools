<template>
    <div style="height: 100%;overflow-y: auto;padding: 10px;">
        <wc-waterfall :gap="10" :cols="cols">
            <el-image v-for="(url, index) in urls" :preview-src-list="urls" :initial-index="index"
                :hide-on-click-modal="true" :key="index" :src="urls[index]" :lazy="isLazy"
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
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
                <path d="M25.984 851.008a486.016 102.528 0 1 0 972.032 0 486.016 102.528 0 1 0-972.032 0Z"
                    fill="#D6DFE5" p-id="28872"></path>
                <path d="M202.56 628.672l96-130.688h426.88l96 130.688-119.552 160.512-336.192 34.304z" fill="#808F9B"></path>
                <path
                    d="M708.288 753.536H315.712a17.152 17.152 0 0 1-17.152-17.152v-489.6c0-9.472 7.68-17.152 17.152-17.152h392.576c9.472 0 17.152 7.68 17.152 17.152v489.6c0 9.472-7.68 17.152-17.152 17.152z"
                    fill="#DCE0E6"></path>
                <path
                    d="M648.512 641.472v13.504c0 11.2-12.16 20.288-27.264 20.288H402.752c-15.04 0-27.264-9.088-27.264-20.288v-13.504c0-7.488-8.192-13.504-18.24-13.504H202.56v195.968c0 18.688 20.352 33.792 45.44 33.792h528c25.088 0 45.44-15.104 45.44-33.792V627.968h-154.688c-10.048 0-18.24 6.016-18.24 13.44zM649.728 448H374.272a17.152 17.152 0 0 1-17.152-17.088v-124.16c0-9.472 7.68-17.152 17.152-17.152h275.456c9.472 0 17.152 7.68 17.152 17.088v124.16c0 9.536-7.68 17.216-17.152 17.216zM655.808 532.224H368.192a11.072 11.072 0 0 1 0-22.144h287.616c6.144 0 11.072 4.992 11.072 11.136a11.072 11.072 0 0 1-11.072 11.008zM655.808 597.952H368.192a11.072 11.072 0 0 1 0-22.144h287.616a11.072 11.072 0 1 1 0 22.144z"
                    fill="#AEB8C2"></path>
                <path
                    d="M882.176 70.4c-63.936 0-115.776 36.8-115.776 82.112 0 14.72 5.504 28.48 15.04 40.384l-9.664 37.44s16.96-12.224 35.52-15.296c20.224 12.16 46.336 19.52 74.88 19.52 64 0 115.84-36.736 115.84-82.048 0-45.312-51.84-82.048-115.84-82.048z m-38.208 94.08a9.088 9.088 0 1 1 0-18.24 9.088 9.088 0 0 1 0 18.176z m35.712-1.664a10.24 10.24 0 1 1 0-20.608 10.24 10.24 0 0 1 0 20.608z m37.952 1.6a11.904 11.904 0 1 1 0-23.808 11.904 11.904 0 0 1 0 23.808z"
                    fill="#DCE0E6"></path>
            </svg>
            <div style="margin-top: 15px;">暂无数据</div>
            <el-text type="info" style="margin-top: 10px;font-size: 1rem;">配置相关数据，点击上方的
                <el-icon>
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        width="1rem" height="1rem">
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
                </el-icon>
                图标即可获取图片
            </el-text>
        </div>
    </div>
</template>

<script setup>
import 'wc-waterfall'
import { Picture } from '@element-plus/icons-vue'
import { useImageApiShowStore } from './store';
import { storeToRefs } from 'pinia'

const { cols, urls } = storeToRefs(useImageApiShowStore())
// 关闭懒加载
const isLazy = false
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
    padding-bottom: 50px;
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
