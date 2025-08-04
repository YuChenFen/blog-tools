<script>
import Tab from './Tab.vue';
import WgslEditor from './WgslEditor.vue';
import WebGPUCanvas from './WebGPUCanvas.vue';

export default {
    components: {
        WgslEditor,
        WebGPUCanvas,
        Tab
    }
};
</script>

<script setup>
import { DockviewVue, themeAbyss } from 'dockview-vue';
import { useWgslEditorStore } from './store';
import { storeToRefs } from 'pinia'

const wgslEditorStore = useWgslEditorStore();
const { vertexShader, fragmentShader } = storeToRefs(wgslEditorStore);
const { setDockviewApi } = wgslEditorStore;
const isGPU = !!navigator.gpu;
themeAbyss.className = 'dockview-theme-light';
function onReady(event) {
    const api = event.api;
    setDockviewApi(api);
    if (window.innerWidth >= 768) {
        const shadersPanel = api.addPanel({
            id: '顶点着色器',
            component: 'WgslEditor',
            tabComponent: 'Tab',
            params: {
                shaderText: vertexShader,
            },
            minimumWidth: 0
        });
        api.addPanel({
            id: '片元着色器',
            component: 'WgslEditor',
            tabComponent: 'Tab',
            minimumWidth: 0,
            params: {
                shaderText: fragmentShader,
            },
            position: {
                referencePanel: '顶点着色器',
                direction: 'within'
            }
        });
        const ImagePanel = api.addPanel({
            id: 'WebGPUCanvas',
            component: 'WebGPUCanvas',
            position: {
                direction: 'right'
            }
        });
        // shadersPanel.group.header.hidden = true;
        ImagePanel.group.header.hidden = true;
        ImagePanel.group.api.setSize({
            width: 500
        })
        api.onWillShowOverlay((e) => {
            e.preventDefault();
        })
    }
}
</script>

<template>
    <div class="container">
        <DockviewVue v-if="isGPU" style="width:100%;height:100%" @ready="onReady">
        </DockviewVue>
        <div v-else class="no-gpu">
            未检测到 GPU
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}
.no-gpu {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
}
</style>