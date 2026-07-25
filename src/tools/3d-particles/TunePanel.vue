<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  antiCenterEnabled: boolean
  antiCenterRadius: number
  antiCenterStrength: number
  bloomThreshold: number
  bloomIntensity: number
  pointSize: number
  particleCount: number
  motionSpeed: number
  voidMaskEnabled: boolean
  voidRadius: number
  voidSoftness: number
}>()

const emit = defineEmits<{
  "update:antiCenterEnabled": [v: boolean]
  "update:antiCenterRadius": [v: number]
  "update:antiCenterStrength": [v: number]
  "update:bloomThreshold": [v: number]
  "update:bloomIntensity": [v: number]
  "update:pointSize": [v: number]
  "update:particleCount": [v: number]
  "update:motionSpeed": [v: number]
  "update:voidMaskEnabled": [v: boolean]
  "update:voidRadius": [v: number]
  "update:voidSoftness": [v: number]
  applyPreset: [name: string]
}>()

const collapsed = ref(true)

function fmt(n: number, d = 2) {
  return Number(n).toFixed(d)
}
</script>

<template>
  <div :class="['tune-container', { collapsed }]">
    <div class="panel">
      <div class="panel-header">
        <span class="card-title">调参面板</span>
        <button class="btn" style="padding:3px 8px;font-size:11px" @click="collapsed = !collapsed">
          {{ collapsed ? '▸' : '▾' }}
        </button>
      </div>

      <template v-if="!collapsed">
        <!-- Particle settings -->
        <div class="section-title">粒子设置</div>
        <div class="slider-group">
          <div class="slider-label">
            <span>点数</span>
            <span class="slider-value">{{ fmt(particleCount, 0) }}</span>
          </div>
          <input type="range" min="5000" max="80000" step="1000" :value="particleCount"
            @input="emit('update:particleCount', Number(($event.target as HTMLInputElement).value))" />
        </div>
        <div class="slider-group">
          <div class="slider-label">
            <span>尺寸</span>
            <span class="slider-value">{{ fmt(pointSize) }}</span>
          </div>
          <input type="range" min="0.05" max="0.5" step="0.01" :value="pointSize"
            @input="emit('update:pointSize', Number(($event.target as HTMLInputElement).value))" />
        </div>
        <div class="slider-group">
          <div class="slider-label">
            <span>运动速度</span>
            <span class="slider-value">{{ fmt(motionSpeed) }}</span>
          </div>
          <input type="range" min="0.1" max="5" step="0.1" :value="motionSpeed"
            @input="emit('update:motionSpeed', Number(($event.target as HTMLInputElement).value))" />
        </div>

        <div class="divider" />

        <!-- Bloom -->
        <div class="section-title">Bloom 光晕</div>
        <div class="slider-group">
          <div class="slider-label">
            <span>阈值</span>
            <span class="slider-value">{{ fmt(bloomThreshold) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" :value="bloomThreshold"
            @input="emit('update:bloomThreshold', Number(($event.target as HTMLInputElement).value))" />
        </div>
        <div class="slider-group">
          <div class="slider-label">
            <span>强度</span>
            <span class="slider-value">{{ fmt(bloomIntensity) }}</span>
          </div>
          <input type="range" min="0" max="3" step="0.05" :value="bloomIntensity"
            @input="emit('update:bloomIntensity', Number(($event.target as HTMLInputElement).value))" />
        </div>

        <div class="divider" />

        <!-- Anti-center -->
        <div class="section-title">反中心排斥</div>
        <label class="control" style="margin-bottom:8px">
          <input type="checkbox" class="toggle" :checked="antiCenterEnabled"
            @change="emit('update:antiCenterEnabled', ($event.target as HTMLInputElement).checked)" />
          启用
        </label>
        <div class="slider-group">
          <div class="slider-label">
            <span>半径</span>
            <span class="slider-value">{{ fmt(antiCenterRadius) }}</span>
          </div>
          <input type="range" min="2" max="20" step="0.5" :value="antiCenterRadius" :disabled="!antiCenterEnabled"
            @input="emit('update:antiCenterRadius', Number(($event.target as HTMLInputElement).value))" />
        </div>
        <div class="slider-group">
          <div class="slider-label">
            <span>强度</span>
            <span class="slider-value">{{ fmt(antiCenterStrength) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" :value="antiCenterStrength" :disabled="!antiCenterEnabled"
            @input="emit('update:antiCenterStrength', Number(($event.target as HTMLInputElement).value))" />
        </div>

        <div class="divider" />

        <!-- Void mask -->
        <div class="section-title">虚空遮罩</div>
        <label class="control" style="margin-bottom:8px">
          <input type="checkbox" class="toggle" :checked="voidMaskEnabled"
            @change="emit('update:voidMaskEnabled', ($event.target as HTMLInputElement).checked)" />
          启用
        </label>
        <div class="slider-group">
          <div class="slider-label">
            <span>半径</span>
            <span class="slider-value">{{ fmt(voidRadius) }}</span>
          </div>
          <input type="range" min="2" max="20" step="0.5" :value="voidRadius" :disabled="!voidMaskEnabled"
            @input="emit('update:voidRadius', Number(($event.target as HTMLInputElement).value))" />
        </div>
        <div class="slider-group">
          <div class="slider-label">
            <span>柔化</span>
            <span class="slider-value">{{ fmt(voidSoftness) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" :value="voidSoftness" :disabled="!voidMaskEnabled"
            @input="emit('update:voidSoftness', Number(($event.target as HTMLInputElement).value))" />
        </div>

        <div class="divider" />

        <!-- Presets -->
        <div class="section-title">预设</div>
        <div class="preset-list">
          <button class="chip" @click="emit('applyPreset', '沉浸柔光')">沉浸柔光</button>
          <button class="chip" @click="emit('applyPreset', '爆火高亮')">爆火高亮</button>
          <button class="chip" @click="emit('applyPreset', '默认')">默认</button>
        </div>
      </template>
    </div>
  </div>
</template>
