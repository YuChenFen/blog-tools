<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue"
import ParticleScene from "./ParticleScene.vue"
import UploadPanel from "./UploadPanel.vue"
import TunePanel from "./TunePanel.vue"
import cssText from './styles.css?inline';

const mode = ref<"random" | "text" | "image" | "gltf">("random")
const effect = ref<string>("none")
const text = ref("文化")
const imageUrl = ref("https://threejs.org/examples/textures/uv_grid_opengl.jpg")
const gltfUrl = ref("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb")

const antiCenterEnabled = ref(false)
const antiCenterRadius = ref(8)
const antiCenterStrength = ref(0.5)
const bloomThreshold = ref(0.4)
const bloomIntensity = ref(0.6)
const pointSize = ref(0.2)
const particleCount = ref(30000)
const motionSpeed = ref(1.8)
const voidMaskEnabled = ref(false)
const voidRadius = ref(8)
const voidSoftness = ref(0.4)
const cameraTheta = ref(0)
const cameraPhi = ref(0)

const fps = ref(0)
const loading = ref(false)
const resetViewTick = ref(0)

const particleSceneRef = ref<any>(null)

const EFFECTS = [
    { key: "none", label: "默认" },
    { key: "randomCloud", label: "随机云海" },
    { key: "explode", label: "爆裂回流" },
    { key: "vortex", label: "星环涡洞" },
    { key: "shockwave", label: "光爆冲击波" },
    { key: "blackhole", label: "黑洞吞噬" },
    { key: "waterfall", label: "瀑布云幕" },
    { key: "rainbow", label: "彩虹换色" },
    { key: "wind", label: "风洞回旋" },
    { key: "breathing", label: "星群聚散" },
    { key: "ripple", label: "波纹干涉" },
    { key: "sphere", label: "球壳成像" },
    { key: "grid", label: "网格阵列" },
] as const

function onModeChange(m: string) {
    mode.value = m as any
    effect.value = "none"
    cameraPhi.value = 0
    resetViewTick.value++
}

function onEffectChange(e: string) {
    effect.value = e
}

function applyPreset(name: string) {
    if (name === "沉浸柔光") {
        antiCenterEnabled.value = false
        antiCenterRadius.value = 12
        antiCenterStrength.value = 0.6
        bloomThreshold.value = 0.5
        bloomIntensity.value = 0.7
        pointSize.value = 0.18
        voidMaskEnabled.value = false
        voidRadius.value = 10
        voidSoftness.value = 0.4
    } else if (name === "爆火高亮") {
        antiCenterEnabled.value = false
        antiCenterRadius.value = 10
        antiCenterStrength.value = 0.4
        bloomThreshold.value = 0.25
        bloomIntensity.value = 1.2
        pointSize.value = 0.25
        voidMaskEnabled.value = false
        voidRadius.value = 8
        voidSoftness.value = 0.2
    } else {
        antiCenterEnabled.value = false
        antiCenterRadius.value = 6
        antiCenterStrength.value = 0.5
        bloomThreshold.value = 0.6
        bloomIntensity.value = 0.4
        pointSize.value = 0.15
        voidMaskEnabled.value = false
        voidRadius.value = 6
        voidSoftness.value = 0.6
    }
}

function onScreenshot() {
    particleSceneRef.value?.takeScreenshot()
}

function onResetView() {
    cameraTheta.value = 0
    cameraPhi.value = 0
    resetViewTick.value++
    particleSceneRef.value?.resetView()
}

const activeEffects = computed(() => EFFECTS.filter((e) => e.key !== "none"))
const inactiveEffects = computed(() => EFFECTS.filter((e) => e.key === "none" || (e.key !== "none" && effect.value !== e.key)))

let styleTag = null;
onMounted(() => {
    mode.value = "random"
    styleTag = document.createElement('style');
    styleTag.textContent = cssText;
    document.head.appendChild(styleTag);
})
onUnmounted(() => {
    if (styleTag) document.head.removeChild(styleTag);
});
</script>

<template>
    <div class="app-root">
        <div class="app-bg" />

        <!-- Top toolbar -->
        <div class="toolbar">
            <div class="brand">
                <span class="brand-dot" />
                粒子化展廊
            </div>

            <div v-if="activeEffects.length" class="toolbar-divider" />

            <button v-for="e in activeEffects" :key="e.key" :class="['btn', { active: effect === e.key }]"
                @click="onEffectChange(e.key)">
                {{ e.label }}
            </button>

            <div class="toolbar-spacer" />

            <button class="btn" @click="onResetView" title="重置视角">
                ↺ 重置
            </button>
            <button class="btn" @click="onScreenshot" title="截图">
                ⤓ 截图
            </button>

            <span v-if="fps" class="badge">{{ fps }} FPS</span>
        </div>

        <UploadPanel
            @image-url="(u: string) => { imageUrl = u; onModeChange('image'); effect = 'none'; cameraPhi = 0; resetViewTick++ }"
            @gltf-url="(u: string) => { gltfUrl = u; onModeChange('gltf'); effect = 'none' }"
            @text-submit="(t: string) => { text = t; onModeChange('text'); effect = 'none'; cameraPhi = 0; resetViewTick++ }" />

        <TunePanel v-model:anti-center-enabled="antiCenterEnabled" v-model:anti-center-radius="antiCenterRadius"
            v-model:anti-center-strength="antiCenterStrength" v-model:bloom-threshold="bloomThreshold"
            v-model:bloom-intensity="bloomIntensity" v-model:point-size="pointSize"
            v-model:particle-count="particleCount" v-model:motion-speed="motionSpeed"
            v-model:void-mask-enabled="voidMaskEnabled" v-model:void-radius="voidRadius"
            v-model:void-softness="voidSoftness" @apply-preset="applyPreset" />

        <ParticleScene ref="particleSceneRef" :mode="mode" :text="text" :image-url="imageUrl" :gltf-url="gltfUrl"
            :effect="effect" :point-size="pointSize" :particle-count="particleCount" :motion-speed="motionSpeed"
            :anti-center-enabled="antiCenterEnabled" :anti-center-radius="antiCenterRadius"
            :anti-center-strength="antiCenterStrength" :void-mask-enabled="voidMaskEnabled" :void-radius="voidRadius"
            :void-softness="voidSoftness" @loading="(v: boolean) => { loading = v }"
            @fps="(v: number) => { fps = v }" />
    </div>
</template>

<style scoped>
.toolbar-divider {
    width: 1px;
    height: 20px;
    background: var(--border-subtle);
    margin: 0 4px;
    flex-shrink: 0;
}

.toolbar-spacer {
    flex: 1;
}
</style>
