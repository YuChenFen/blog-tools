<script setup lang="ts">
import { ref } from "vue"

const emit = defineEmits<{
  imageUrl: [url: string]
  gltfUrl: [url: string]
  textSubmit: [text: string]
}>()

defineProps<{
  imageFit?: "contain" | "cover"
  imageColorFidelity?: boolean
  imageThresholdQuantile?: number
  imageGamma?: number
  imageAlphaMin?: number
  imageSaturationMin?: number
  imageSkipWhites?: boolean
  imageWhiteBrightMin?: number
}>()

const showContent = ref(true)
const selectedTab = ref<"image" | "gltf" | "text">("image")
const dragImg = ref(false)
const dragGlb = ref(false)
const textInputValue = ref("")
const imgInputRef = ref<HTMLInputElement | null>(null)
const glbInputRef = ref<HTMLInputElement | null>(null)

const GLB_PRESETS = [
  { name: "鸭子 Duck", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb" },
  { name: "狐狸 Fox", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb" },
  { name: "骨架 Skeletons", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/RecursiveSkeletons/glTF-Binary/RecursiveSkeletons.glb" },
]

const IMAGE_PRESETS = [
  { name: "预设1", url: "/presets/images/img-01.png" },
  { name: "预设2", url: "/presets/images/img-02.png" },
  { name: "预设3", url: "/presets/images/img-03.png" },
  { name: "预设4", url: "/presets/images/img-04.png" },
]

const TEXT_PRESETS = ["美丽中国", "世界和平", "开心", "快乐", "好好学习", "不想上班", "牛马生活"]

function onPickImage(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return
  const url = URL.createObjectURL(f)
  emit("imageUrl", url)
}

function onPickGLB(e: Event) {
  const target = e.target as HTMLInputElement
  const f = target.files?.[0]
  if (!f) return
  const url = URL.createObjectURL(f)
  emit("gltfUrl", url)
}

function onDropGLB(e: Event) {
  e.preventDefault()
  const dt = (e as DragEvent).dataTransfer
  const f = dt?.files?.[0]
  if (!f) return
  if (!f.name.toLowerCase().endsWith(".glb") && !f.name.toLowerCase().endsWith(".gltf")) return
  const url = URL.createObjectURL(f)
  emit("gltfUrl", url)
  dragGlb.value = false
}

function onDropImage(e: Event) {
  e.preventDefault()
  const dt = (e as DragEvent).dataTransfer
  const f = dt?.files?.[0]
  if (!f) return
  if (!f.type.startsWith("image/")) return
  const url = URL.createObjectURL(f)
  emit("imageUrl", url)
  dragImg.value = false
}

function submitText() {
  const val = textInputValue.value.trim()
  if (!val) return
  emit("textSubmit", val)
  textInputValue.value = ""
}
</script>

<template>
  <div class="upload-container">
    <div class="panel" style="flex: 1 1 0; width: 100%">
      <div class="panel-header">
        <div class="card-title">操作栏</div>
        <button class="btn" @click="showContent = !showContent" style="padding:3px 10px;font-size:11px">
          {{ showContent ? '收起' : '展开' }}
        </button>
      </div>

      <div class="tabs" role="tablist" v-show="showContent">
        <button type="button" :class="['tab', { active: selectedTab === 'image' }]" @click="selectedTab = 'image'">图片模式</button>
        <button type="button" :class="['tab', { active: selectedTab === 'gltf' }]" @click="selectedTab = 'gltf'">GLB模式</button>
        <button type="button" :class="['tab', { active: selectedTab === 'text' }]" @click="selectedTab = 'text'">文本模式</button>
      </div>

      <div v-if="showContent && selectedTab === 'image'" class="sections-row">
        <div class="section">
          <div class="control-row">
            <div :class="['dashed-drop', { 'drag-over': dragImg }]" @dragover.prevent @dragenter="dragImg = true" @dragleave="dragImg = false" @drop="onDropImage">
              拖拽图片到此
            </div>
            <button class="btn" @click="imgInputRef?.click()">选择图片</button>
            <input ref="imgInputRef" type="file" accept="image/*" style="display:none" @change="onPickImage" />
          </div>
          <div style="margin-top:8px">
            <div class="section-title">预设图片</div>
            <div class="image-grid">
              <button v-for="p in IMAGE_PRESETS" :key="p.url" type="button" class="thumb-card" :title="p.name" @click="emit('imageUrl', p.url)">
                <img :src="p.url" :alt="p.name" />
                <div class="thumb-caption">{{ p.name }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showContent && selectedTab === 'gltf'" class="sections-row">
        <div class="section">
          <div class="control-row">
            <div :class="['dashed-drop', { 'drag-over': dragGlb }]" @dragover.prevent @dragenter="dragGlb = true" @dragleave="dragGlb = false" @drop="onDropGLB">
              拖拽GLB到此
            </div>
            <button class="btn" @click="glbInputRef?.click()">选择GLB文件</button>
            <input ref="glbInputRef" type="file" accept=".glb,.gltf" style="display:none" @change="onPickGLB" />
          </div>
          <div style="margin-top:8px">
            <div class="section-title">预设模型</div>
            <div class="preset-list">
              <button v-for="p in GLB_PRESETS" :key="p.name" class="chip" @click="emit('gltfUrl', p.url)">{{ p.name }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showContent && selectedTab === 'text'" class="sections-row">
        <div class="section">
          <div class="control-row">
            <input class="input input-text" v-model="textInputValue" type="text" placeholder="输入文字并应用" @keydown.enter="submitText" />
            <button class="btn" @click="submitText">应用文字</button>
          </div>
          <div style="margin-top:8px">
            <div class="section-title">预设文字</div>
            <div class="preset-list">
              <button v-for="p in TEXT_PRESETS" :key="p" class="chip" @click="textInputValue = p; submitText()">{{ p }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
