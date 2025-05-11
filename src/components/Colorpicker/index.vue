<template>
    <div class="color-picker">
        <!-- 模式选择 -->
        <div class="mode-selector">
            <button v-for="tab in tabs" :key="tab.value" :class="{ active: mode === tab.value }"
                @click="mode = tab.value">
                {{ tab.label }}
            </button>
        </div>

        <!-- 纯色选择器 -->
        <div v-if="mode === 'solid'" class="color-panel solid-panel">
            <div class="color-preview" :style="{ background: solidColorValue }"></div>

            <div class="color-controls">
                <input type="color" v-model="solidColorHex" @input="handleSolidColorChange" />

                <div class="control-group">
                    <label>颜色值</label>
                    <input type="text" v-model="solidColorHex" @input="handleSolidColorChange" />
                </div>

                <div class="control-group">
                    <label>透明度: {{ solidOpacity }}%</label>
                    <input type="range" v-model="solidOpacity" min="0" max="100" @input="handleSolidColorChange" />
                </div>
            </div>
        </div>

        <!-- 渐变选择器 -->
        <div v-if="mode !== 'solid'" class="color-panel gradient-panel">
            <div class="gradient-preview" :style="{ background: gradientValue }"></div>

            <div class="gradient-stops-track" @click="addStopAtPosition">
                <div v-for="(stop, index) in gradientStops" :key="index" class="gradient-stop" :style="{
                    left: `${stop.position}%`,
                    backgroundColor: stop.color,
                    borderColor: index === activeStopIndex ? '#333' : 'white'
                }" @click.stop="activeStopIndex = index" @mousedown="startStopDrag(index, $event)">
                    <div class="stop-handle"></div>
                </div>
            </div>

            <div class="gradient-controls">
                <div v-if="activeStop" class="stop-editor">
                    <div class="control-group">
                        <label>色标颜色</label>
                        <input type="color" v-model="activeStop.color" @input="updateGradient" />
                        <input type="text" v-model="activeStop.color" @input="updateGradient" />
                    </div>

                    <div class="control-group">
                        <label>透明度: {{ activeStop.opacity }}%</label>
                        <input type="range" v-model="activeStop.opacity" min="0" max="100" @input="updateGradient" />
                    </div>
                </div>

                <div class="gradient-actions">
                    <button @click="addGradientStop" class="btn-action">
                        + 添加色标
                    </button>
                    <button @click="removeGradientStop" class="btn-action btn-remove"
                        :disabled="gradientStops.length <= 2">
                        - 删除色标
                    </button>
                </div>

                <div v-if="mode === 'linear-gradient'" class="angle-control">
                    <label>渐变角度: {{ gradientAngle }}°</label>
                    <div class="angle-slider">
                        <input type="range" v-model="gradientAngle" min="0" max="360" @input="updateGradient" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    change: {
        type: Function,
        required: true
    }
})

// 模式选择
const tabs = [
    { label: '纯色', value: 'solid' },
    { label: '线性渐变', value: 'linear-gradient' },
    { label: '径向渐变', value: 'radial-gradient' }
]
const mode = ref('solid')

// 纯色相关状态
const solidColorHex = ref('#000000')
const solidOpacity = ref(100)
const solidColorValue = computed(() => {
    return hexToRgba(solidColorHex.value, solidOpacity.value / 100)
})

// 渐变相关状态
const gradientStops = ref([
    { color: '#3a86ff', position: 0, opacity: 100 },
    { color: '#8338ec', position: 100, opacity: 100 }
])
const activeStopIndex = ref(0)
const gradientAngle = ref(90)
const isDragging = ref(false)

// 计算属性
const activeStop = computed(() => gradientStops.value[activeStopIndex.value])
const gradientValue = computed(() => generateGradientString())

// 方法
const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const handleSolidColorChange = () => {
    props.change('solid', {
        color: solidColorHex.value,
        opacity: solidOpacity.value,
        value: solidColorValue.value
    })
}

const generateGradientString = () => {
    const stops = gradientStops.value
        .map(stop => {
            const rgba = hexToRgba(stop.color, stop.opacity / 100)
            return `${rgba} ${stop.position}%`
        })
        .join(', ')

    if (mode.value === 'linear-gradient') {
        return `linear-gradient(${gradientAngle.value}deg, ${stops})`
    } else {
        return `radial-gradient(circle, ${stops})`
    }
}

const addGradientStop = () => {
    // 在中间位置添加新色标
    let newPosition = 50
    // 查找合适的位置，避免重叠
    for (let i = 0; i < gradientStops.value.length - 1; i++) {
        const space = gradientStops.value[i + 1].position - gradientStops.value[i].position
        if (space > 20) {
            newPosition = gradientStops.value[i].position + space / 2
            break
        }
    }

    const newColor = getColorBetween(
        gradientStops.value[0].color,
        gradientStops.value[gradientStops.value.length - 1].color,
        newPosition / 100
    )

    gradientStops.value.push({
        color: newColor,
        position: newPosition,
        opacity: 100
    })

    // 排序色标以确保位置顺序
    gradientStops.value.sort((a, b) => a.position - b.position)

    // 选择新添加的色标
    activeStopIndex.value = gradientStops.value.findIndex(
        stop => stop.position === newPosition
    )

    updateGradient()
}

const addStopAtPosition = (event) => {
    const container = event.currentTarget
    const rect = container.getBoundingClientRect()
    const position = ((event.clientX - rect.left) / rect.width) * 100

    // 计算左右两侧的颜色
    let leftStop = gradientStops.value[0]
    let rightStop = gradientStops.value[gradientStops.value.length - 1]

    for (let i = 0; i < gradientStops.value.length - 1; i++) {
        if (gradientStops.value[i].position <= position && gradientStops.value[i + 1].position >= position) {
            leftStop = gradientStops.value[i]
            rightStop = gradientStops.value[i + 1]
            break
        }
    }

    // 计算新颜色
    const ratio = (position - leftStop.position) / (rightStop.position - leftStop.position)
    const newColor = getColorBetween(leftStop.color, rightStop.color, ratio)

    gradientStops.value.push({
        color: newColor,
        position: position,
        opacity: leftStop.opacity + (rightStop.opacity - leftStop.opacity) * ratio
    })

    // 排序色标以确保位置顺序
    gradientStops.value.sort((a, b) => a.position - b.position)

    // 选择新添加的色标
    activeStopIndex.value = gradientStops.value.findIndex(
        stop => Math.abs(stop.position - position) < 0.1
    )

    updateGradient()
}

const getColorBetween = (color1, color2, ratio) => {
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)

    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)

    const r = Math.round(r1 + (r2 - r1) * ratio)
    const g = Math.round(g1 + (g2 - g1) * ratio)
    const b = Math.round(b1 + (b2 - b1) * ratio)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const removeGradientStop = () => {
    if (gradientStops.value.length > 2) {
        gradientStops.value.splice(activeStopIndex.value, 1)
        activeStopIndex.value = Math.max(0, activeStopIndex.value - 1)
        updateGradient()
    }
}

const updateGradient = () => {
    if (mode.value !== 'solid') {
        props.change(mode.value, {
            stops: [...gradientStops.value],
            angle: gradientAngle.value,
            value: gradientValue.value
        })
    } else {
        props.change('solid', {
            color: solidColorHex.value,
            opacity: solidOpacity.value,
            value: solidColorValue.value
        })
    }
}

const startStopDrag = (index, event) => {
    activeStopIndex.value = index
    isDragging.value = true

    const handleMove = (e) => {
        if (!isDragging.value) return

        const container = e.target.closest('.gradient-stops-track')
        const rect = container.getBoundingClientRect()
        let position = ((e.clientX - rect.left) / rect.width) * 100
        position = Math.max(0, Math.min(100, position))

        gradientStops.value[index].position = Math.round(position * 10) / 10

        updateGradient()
    }

    const handleUp = () => {
        isDragging.value = false
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)
        // 拖动结束后排序
        gradientStops.value.sort((a, b) => a.position - b.position)
        updateGradient()
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
}

// 初始化
watch(mode, (newMode) => {
    if (newMode !== 'solid' && gradientStops.value.length === 0) {
        gradientStops.value = [
            { color: '#3a86ff', position: 0, opacity: 100 },
            { color: '#8338ec', position: 100, opacity: 100 }
        ]
    }
    updateGradient()
}, { immediate: true })
</script>

<style scoped>
.color-picker {
    --primary-color: #3a86ff;
    --border-color: #e2e8f0;
    --border-radius: 10px;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    user-select: none;
}

.mode-selector {
    display: flex;
    border-bottom: 1px solid var(--border-color);
}

.mode-selector button {
    flex: 1;
    padding: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s;
    position: relative;
}

.mode-selector button:hover {
    background: #f8fafc;
}

.mode-selector button.active {
    color: var(--primary-color);
    font-weight: 600;
}

.mode-selector button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-color);
}

.color-panel {
    padding: 16px;
}

.color-preview,
.gradient-preview {
    width: 100%;
    height: 80px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid var(--border-color);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: background 0.2s;
}

.color-controls,
.gradient-controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-group label {
    font-size: 13px;
    color: #64748b;
    display: flex;
    justify-content: space-between;
}

input[type="color"] {
    width: 100%;
    height: 40px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    padding: 4px;
    background: white;
}

input[type="text"] {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-family: monospace;
    font-size: 13px;
    transition: border-color 0.2s;
}

input[type="text"]:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
}

input[type="range"] {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    background: #e2e8f0;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.1s;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
}

.gradient-stops-track {
    position: relative;
    height: 24px;
    margin: 16px 0;
    background: linear-gradient(to right, #f8fafc, #e2e8f0);
    border-radius: 12px;
    cursor: pointer;
}

.gradient-stop {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transform: translate(-50%, 0);
    cursor: grab;
    border: 3px solid;
    z-index: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gradient-stop:hover {
    transform: translate(-50%, 0) scale(1.1);
}

.gradient-stop:active {
    cursor: grabbing;
}

.stop-handle {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.gradient-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.btn-action {
    flex: 1;
    padding: 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.btn-add {
    background-color: #ECFDF5;
    color: #059669;
    border-color: #A7F3D0;
}

.btn-add:hover {
    background-color: #D1FAE5;
}

.btn-remove {
    background-color: #FEF2F2;
    color: #DC2626;
    border-color: #FECACA;
}

.btn-remove:hover {
    background-color: #FEE2E2;
}

.btn-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #F3F4F6;
    color: #9CA3AF;
    border-color: #E5E7EB;
}

.angle-control {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.angle-control label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    color: #6B7280;
    font-weight: 500;
}

.angle-slider {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.angle-slider button {
    padding: 0.25rem 0.5rem;
    background: #F3F4F6;
    border: 1px solid #E5E7EB;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.angle-slider button:hover {
    background: #E5E7EB;
}

.angle-slider input[type="range"] {
    flex-grow: 1;
}

.angle-value {
    width: 3rem;
    text-align: center;
    font-size: 0.75rem;
    color: #4B5563;
}

/* 响应式设计 */
@media (max-width: 480px) {
    .color-picker {
        max-width: 100%;
    }

    .control-row {
        flex-direction: column;
        gap: 1rem;
    }

    .angle-slider {
        flex-wrap: wrap;
    }

    .angle-slider input[type="range"] {
        order: 1;
        width: 100%;
        margin-top: 0.5rem;
    }
}
</style>