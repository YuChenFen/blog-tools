<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
const PARTICLE_COUNT = 30000
interface Props {
  mode?: "random" | "text" | "image" | "gltf"
  text?: string
  imageUrl?: string
  gltfUrl?: string
  effect?: string
  pointSize?: number
  particleCount?: number
  motionSpeed?: number
  antiCenterEnabled?: boolean
  antiCenterRadius?: number
  antiCenterStrength?: number
  voidMaskEnabled?: boolean
  voidRadius?: number
  voidSoftness?: number
  imageFit?: "contain" | "cover"
  imageColorFidelity?: boolean
  imageThresholdQuantile?: number
  imageGamma?: number
  imageAlphaMin?: number
  imageSaturationMin?: number
  imageSkipWhites?: boolean
  imageWhiteBrightMin?: number
}
const props = withDefaults(defineProps<Props>(), {
  mode: "random",
  text: "",
  imageUrl: "",
  gltfUrl: "",
  effect: "none",
  pointSize: 0.2,
  particleCount: PARTICLE_COUNT,
  motionSpeed: 1,
  antiCenterEnabled: true,
  antiCenterRadius: 8,
  antiCenterStrength: 0.5,
  voidMaskEnabled: false,
  voidRadius: 8,
  voidSoftness: 0.4,
  imageFit: "contain",
  imageColorFidelity: true,
  imageThresholdQuantile: 0.4,
  imageGamma: 0.9,
  imageAlphaMin: 20,
  imageSaturationMin: 0.15,
  imageSkipWhites: true,
  imageWhiteBrightMin: 220,
})
const emit = defineEmits<{
  loading: [v: boolean]
  fps: [v: number]
}>()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let points: THREE.Points | null = null
let geometry: THREE.BufferGeometry | null = null
let controls: OrbitControls | null = null
let animationId: number | null = null
let currentEffect = "none"
let explodeActive = false
let effectTime = 0
let sceneReady = false
let targetsReadyRef = true
const positions = new Float32Array(PARTICLE_COUNT * 3)
const velocities = new Float32Array(PARTICLE_COUNT * 3)
const targets = new Float32Array(PARTICLE_COUNT * 3)
const colors = new Float32Array(PARTICLE_COUNT * 3)
const originalTargets = new Float32Array(PARTICLE_COUNT * 3)
const mouse = new THREE.Vector3(99999, 99999, 99999)
function resetPositionsToCloud() {
  const area = 60
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * area
    positions[i3 + 1] = (Math.random() - 0.5) * area
    positions[i3 + 2] = (Math.random() - 0.5) * area
    velocities[i3] = (Math.random() - 0.5) * 0.1
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.1
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.1
  }
}
function initParticles() {
  if (geometry) {
    scene?.remove(points!)
    geometry.dispose()
  }
  geometry = new THREE.BufferGeometry()
  // Initialize random cloud positions (only on first create)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 60
    positions[i3 + 1] = (Math.random() - 0.5) * 60
    positions[i3 + 2] = (Math.random() - 0.5) * 60
    velocities[i3] = (Math.random() - 0.5) * 0.1
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.1
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.1
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    targets[i3] = positions[i3]; targets[i3 + 1] = positions[i3 + 1]; targets[i3 + 2] = positions[i3 + 2]
    originalTargets[i3] = positions[i3]; originalTargets[i3 + 1] = positions[i3 + 1]; originalTargets[i3 + 2] = positions[i3 + 2]
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    const hue = 200 + Math.random() * 60
    const col = new THREE.Color().setHSL(hue / 360, 0.8, 0.5 + Math.random() * 0.2)
    colors[i3] = col.r; colors[i3 + 1] = col.g; colors[i3 + 2] = col.b
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geometry.setDrawRange(0, Math.min(props.particleCount, PARTICLE_COUNT))
  const material = new THREE.PointsMaterial({
    size: props.pointSize, vertexColors: true, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  })
  points = new THREE.Points(geometry!, material)
  scene!.add(points!)
}
function initScene() {
  const canvas = canvasRef.value!
  scene = new THREE.Scene()
  scene.background = new THREE.Color("#0b0b12")
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 80)
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  initParticles()
  window.addEventListener("resize", onResize)
  renderer.domElement.addEventListener("mousemove", onMouseMove)
  sceneReady = true
  animate()
}
// Set random cloud targets without touching positions (smooth transition)
function setRandomTargets() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    targets[i3] = (Math.random() - 0.5) * 50
    targets[i3 + 1] = (Math.random() - 0.5) * 30
    targets[i3 + 2] = (Math.random() - 0.5) * 50
  }
}
async function setTargetsFromRandomCloud() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    targets[i3] = positions[i3]; targets[i3 + 1] = positions[i3 + 1]; targets[i3 + 2] = positions[i3 + 2]
    originalTargets[i3] = positions[i3]; originalTargets[i3 + 1] = positions[i3 + 1]; originalTargets[i3 + 2] = positions[i3 + 2]
  }
}
// Fill remaining particles by wrapping around sampled points (avoids leftover random particles)
function fillRemaining(ptIdx: number) {
  for (let i = ptIdx; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    const srcIdx = ((i - ptIdx) % ptIdx) * 3
    targets[i3] = targets[srcIdx]
    targets[i3 + 1] = targets[srcIdx + 1]
    targets[i3 + 2] = targets[srcIdx + 2]
    colors[i3] = 0
    colors[i3 + 1] = 0
    colors[i3 + 2] = 0
  }
}
async function setTargetsFromText(text: string) {

  const size = 512
  const cvs = document.createElement("canvas")
  cvs.width = size; cvs.height = size
  const ctx = cvs.getContext("2d")!
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"
  let fontPx = 360
  const maxW = size * 0.88
  const setFont = (px: number) => { ctx.font = `bold ${px}px "Microsoft YaHei", "Noto Sans SC", sans-serif` }
  setFont(fontPx)
  let w = ctx.measureText(text).width
  while (w > maxW && fontPx > 48) { fontPx -= 10; setFont(fontPx); w = ctx.measureText(text).width }
  ctx.fillText(text, size / 2, size / 2)
  const imgData = ctx.getImageData(0, 0, size, size)
  const data = imgData.data
  let ptIdx = 0
  for (let y = 0; y < size && ptIdx < PARTICLE_COUNT; y += 2) {
    for (let x = 0; x < size && ptIdx < PARTICLE_COUNT; x += 2) {
      const idx = (y * size + x) * 4
      if (data[idx] > 128) {
        const i3 = ptIdx * 3
        targets[i3] = ((x / size) - 0.5) * 40
        targets[i3 + 1] = (0.5 - y / size) * 40
        targets[i3 + 2] = 0
        colors[i3] = 1
        colors[i3 + 1] = 1
        colors[i3 + 2] = 1
        ptIdx++
      }
    }
  }
  fillRemaining(ptIdx)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    originalTargets[i3] = targets[i3]; originalTargets[i3 + 1] = targets[i3 + 1]; originalTargets[i3 + 2] = targets[i3 + 2]
  }
}
async function setTargetsFromImage(url: string) {

  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const bitmap = await createImageBitmap(blob)
    const size = 512
    const cvs = document.createElement("canvas")
    cvs.width = size; cvs.height = size
    const ctx = cvs.getContext("2d")!
    const bw = bitmap.width; const bh = bitmap.height
    const fit = props.imageFit
    const s = fit === "cover" ? Math.max(size / Math.max(1, bw), size / Math.max(1, bh)) : Math.min(size / Math.max(1, bw), size / Math.max(1, bh))
    const dw = Math.round(bw * s); const dh = Math.round(bh * s)
    const dx = Math.floor((size - dw) / 2); const dy = Math.floor((size - dh) / 2)
    ctx.drawImage(bitmap, dx, dy, dw, dh)
    const imgData = ctx.getImageData(0, 0, size, size)
    const data = imgData.data
    const alphaMinVal = Math.max(0, Math.min(255, props.imageAlphaMin))
    const gval = props.imageGamma
    const freq = new Uint32Array(256)
    for (let i = 0; i < data.length; i += 4) {
      const a0 = data[i + 3]
      if (a0 > alphaMinVal) {
        const rr0 = Math.pow(data[i] / 255, gval)
        const gg0 = Math.pow(data[i + 1] / 255, gval)
        const bb0 = Math.pow(data[i + 2] / 255, gval)
        const br = Math.min(255, Math.round(((rr0 + gg0 + bb0) / 3) * 255))
        freq[br] += 1
      }
    }
    const total = freq.reduce((a: number, b: number) => a + b, 0)
    const targetP = Math.max(0, Math.min(0.8, props.imageThresholdQuantile))
    let dynamicThreshold0 = 0
    if (targetP > 0) {
      const targetC = Math.floor(total * targetP)
      let acc = 0
      for (let k = 0; k < 256; k++) { acc += freq[k]; if (acc >= targetC) { dynamicThreshold0 = Math.max(0, Math.min(200, k)); break } }
    }
    const step = Math.max(1, Math.floor(Math.sqrt((size * size) / Math.max(1, 30000))))
    const spanX = 50 * (dw / size); const spanY = 50 * (dh / size)
    const satMin = props.imageSaturationMin; const whiteMin = props.imageWhiteBrightMin
    const skipWhites = props.imageSkipWhites; const colorFidelity = props.imageColorFidelity
    let ptIdx = 0
    for (let y = 0; y < size && ptIdx < PARTICLE_COUNT; y += step) {
      for (let x = 0; x < size && ptIdx < PARTICLE_COUNT; x += step) {
        const idx = (y * size + x) * 4
        const r0 = data[idx], g0 = data[idx + 1], b0 = data[idx + 2], a0 = data[idx + 3]
        const rrG = Math.pow(r0 / 255, gval), ggG = Math.pow(g0 / 255, gval), bbG = Math.pow(b0 / 255, gval)
        const bright = ((rrG + ggG + bbG) / 3) * 255
        const rL = r0 / 255, gL = g0 / 255, bL = b0 / 255
        const maxC = Math.max(rL, gL, bL), minC = Math.min(rL, gL, bL)
        const sat = maxC > 0 ? (maxC - minC) / maxC : 0
        const isWhiteBg = skipWhites && sat < satMin && bright >= whiteMin
        if (a0 > alphaMinVal) {
          const i3 = ptIdx * 3
          targets[i3] = (((x - dx) / Math.max(1, dw)) - 0.5) * spanX
          targets[i3 + 1] = (0.5 - (y - dy) / Math.max(1, dh)) * spanY
          targets[i3 + 2] = 0
          colors[i3] = colorFidelity ? r0 / 255 : rrG
          colors[i3 + 1] = colorFidelity ? g0 / 255 : ggG
          colors[i3 + 2] = colorFidelity ? b0 / 255 : bbG
          ptIdx++
        }
      }
    }
    // FIX: wrap around instead of filling with random cloud particles
    fillRemaining(ptIdx)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      originalTargets[i3] = targets[i3]; originalTargets[i3 + 1] = targets[i3 + 1]; originalTargets[i3 + 2] = targets[i3 + 2]
    }
    geometry!.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geometry!.attributes.color.needsUpdate = true
  } catch (e) { console.error("Image sampling failed:", e) }
}
async function setTargetsFromGLTF(url: string) {

  try {
    emit("loading", true)
    const loader = new GLTFLoader()
    loader.load(url, (gltf: any) => {
      // Compute bounding box on scene hierarchy (accounts for transforms)
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = new THREE.Vector3(); box.getCenter(center)
      const size = new THREE.Vector3(); box.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z) || 1

      // Normalize vertices to fit within ~30 units regardless of model size
      let ptIdx = 0
      const normalizedScale = 30 / maxDim
      const sampleMeshes = (object: THREE.Object3D) => {
        if (object.isMesh && ptIdx < PARTICLE_COUNT) {
          const geo = object.geometry; const posAttr = geo.attributes.position
          if (posAttr) {
            const count = Math.min(posAttr.count, PARTICLE_COUNT - ptIdx)
            for (let i = 0; i < count; i++) {
              // Transform local vertex to world space, then normalize relative to center
              const localPos = new THREE.Vector3().fromBufferAttribute(posAttr, i)
              const worldPos = localPos.applyMatrix4(object.matrixWorld)
              const v = new THREE.Vector3(worldPos.x - center.x, worldPos.y - center.y, worldPos.z - center.z).multiplyScalar(normalizedScale)
              const i3 = ptIdx * 3; targets[i3] = v.x; targets[i3 + 1] = v.y; targets[i3 + 2] = v.z;
              colors[i3] = 1
              colors[i3 + 1] = 1
              colors[i3 + 2] = 1
              ptIdx++
            }
          }
        }
        object.children.forEach(sampleMeshes)
      }
      gltf.scene.traverse(sampleMeshes)
      // Fill remaining particles by wrapping around sampled points
      fillRemaining(ptIdx)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3; originalTargets[i3] = targets[i3]; originalTargets[i3 + 1] = targets[i3 + 1]; originalTargets[i3 + 2] = targets[i3 + 2]
      }
      emit("loading", false)
    }, undefined, (err: any) => { console.error("GLTF load failed:", err); emit("loading", false) })
  } catch (e) { console.error("GLTF setup failed:", e); emit("loading", false) }
}
function onMouseMove(event: MouseEvent) {
  if (!renderer || !camera) return
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse2D = new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse2D, camera)
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const intersection = new THREE.Vector3()
  raycaster.ray.intersectPlane(plane, intersection)
  if (intersection) mouse.copy(intersection)
}
function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
function updatePhysics(time: number, speed: number) {
  const damping = 0.92
  const antiCenterEnabled = props.antiCenterEnabled
  const antiCenterRadius = props.antiCenterRadius
  const antiCenterStrength = props.antiCenterStrength
  const voidRadius = props.voidRadius
  const voidSoftness = props.voidSoftness
  const voidMaskEnabled = props.voidMaskEnabled
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3
    const px = positions[i3], py = positions[i3 + 1], pz = positions[i3 + 2]
    const tx = targets[i3], ty = targets[i3 + 1], tz = targets[i3 + 2]
    // Only attract to targets when they are ready (avoids jumping during async sampling)
    if (targetsReadyRef) {
      velocities[i3] += (tx - px) * 0.0012 * speed
      velocities[i3 + 1] += (ty - py) * 0.0012 * speed
      velocities[i3 + 2] += (tz - pz) * 0.0012 * speed
    }
    if (antiCenterEnabled) {
      const distToCenter = Math.sqrt(px * px + py * py + pz * pz)
      if (distToCenter < antiCenterRadius && distToCenter > 0.01) {
        const force = antiCenterStrength * (1 - distToCenter / antiCenterRadius)
        velocities[i3] += (px / distToCenter) * force * 0.01
        velocities[i3 + 1] += (py / distToCenter) * force * 0.01
        velocities[i3 + 2] += (pz / distToCenter) * force * 0.01
      }
    }
    if (voidMaskEnabled) {
      const dist = Math.sqrt(px * px + py * py)
      if (dist < voidRadius + voidSoftness * 10) {
        const factor = 1 - Math.min(1, Math.max(0, (dist - voidRadius) / (voidSoftness * 10)))
        if (dist > 0.01) { velocities[i3] += (px / dist) * factor * 0.3; velocities[i3 + 1] += (py / dist) * factor * 0.3 }
      }
    }
    const mdx = px - mouse.x, mdy = py - mouse.y, mdz = pz - mouse.z
    const mDist = Math.sqrt(mdx * mdx + mdy * mdy + mdz * mdz)
    if (mDist < 10 && mDist > 0.1) {
      const force = 0.5 / (mDist * mDist)
      velocities[i3] += (mdx / mDist) * force
      velocities[i3 + 1] += (mdy / mDist) * force
      velocities[i3 + 2] += (mdz / mDist) * force
    }
    switch (currentEffect) {
      case "explode":
        if (explodeActive) {
          const dist = Math.sqrt(px * px + py * py + pz * pz)
          if (dist > 0.01) { velocities[i3] += (px / dist) * 2; velocities[i3 + 1] += (py / dist) * 2; velocities[i3 + 2] += (pz / dist) * 2 }
        }
        break
      case "vortex": {
        const dx = px, dz = pz, dist = Math.sqrt(dx * dx + dz * dz)
        if (dist > 0.1) { velocities[i3] += (-dz / dist) * 0.3 * speed; velocities[i3 + 2] += (dx / dist) * 0.3 * speed; velocities[i3 + 1] -= 0.05 * speed }
        break
      }
      case "shockwave": {
        const dist = Math.sqrt(px * px + py * py + pz * pz)
        const wavePos = (effectTime * 15) % 60
        const waveDist = Math.abs(dist - wavePos)
        if (waveDist < 5 && dist > 0.01) { const force = (1 - waveDist / 5) * 0.8; velocities[i3] += (px / dist) * force; velocities[i3 + 1] += (py / dist) * force; velocities[i3 + 2] += (pz / dist) * force }
        break
      }
      case "blackhole": {
        const dist = Math.sqrt(px * px + py * py + pz * pz)
        if (dist > 0.1) {
          const force = 2 / (dist * dist + 1)
          velocities[i3] += (-px / dist) * force * 0.05; velocities[i3 + 1] += (-py / dist) * force * 0.05; velocities[i3 + 2] += (-pz / dist) * force * 0.05
          velocities[i3] += (-pz / dist) * 0.1 * speed; velocities[i3 + 2] += (px / dist) * 0.1 * speed
        }
        break
      }
      case "waterfall":
        velocities[i3 + 1] -= 0.15 * speed
        if (positions[i3 + 1] < -30) { positions[i3 + 1] = 30; velocities[i3 + 1] = 0 }
        break
      case "breathing": {
        const breathe = Math.sin(time * 0.8) * 0.5
        targets[i3] = originalTargets[i3] * (1 + breathe)
        targets[i3 + 2] = originalTargets[i3 + 2] * (1 + breathe * 0.5)
        break
      }
      case "ripple": {
        const dist = Math.sqrt(px * px + py * py)
        const ripple = Math.sin(dist * 0.3 - time * 3) * 2
        if (dist > 0.1) { velocities[i3] += (px / dist) * ripple * 0.02; velocities[i3 + 1] += (py / dist) * ripple * 0.02 }
        break
      }
      case "sphere": {
        const dist = Math.sqrt(originalTargets[i3] ** 2 + originalTargets[i3 + 1] ** 2 + originalTargets[i3 + 2] ** 2)
        if (dist > 0.01) { const sphereR = 20; targets[i3] = (originalTargets[i3] / dist) * sphereR; targets[i3 + 1] = (originalTargets[i3 + 1] / dist) * sphereR; targets[i3 + 2] = (originalTargets[i3 + 2] / dist) * sphereR }
        break
      }
      case "grid": {
        const gridSize = 30; const steps = 20
        targets[i3] = Math.round(originalTargets[i3] / (gridSize / steps)) * (gridSize / steps)
        targets[i3 + 1] = Math.round(originalTargets[i3 + 1] / (gridSize / steps)) * (gridSize / steps)
        targets[i3 + 2] = Math.round(originalTargets[i3 + 2] / (gridSize / steps)) * (gridSize / steps)
        break
      }
      case "rainbow": {
        const hue = (time * 0.05 + i / PARTICLE_COUNT) % 1
        const col = new THREE.Color().setHSL(hue, 0.8, 0.6)
        colors[i3] = col.r; colors[i3 + 1] = col.g; colors[i3 + 2] = col.b
        break
      }
      case "wind": {
        velocities[i3] += Math.sin(py * 0.1 + time) * 0.3 * speed * 0.01
        velocities[i3 + 1] += Math.cos(px * 0.1 + time * 0.5) * 0.05
      }
    }
    velocities[i3] *= damping; velocities[i3 + 1] *= damping; velocities[i3 + 2] *= damping
    positions[i3] += velocities[i3]; positions[i3 + 1] += velocities[i3 + 1]; positions[i3 + 2] += velocities[i3 + 2]
  }
  geometry!.attributes.position.needsUpdate = true
  geometry!.attributes.color.needsUpdate = true
}
function animate() {
  animationId = requestAnimationFrame(animate)
  const time = performance.now() * 0.001
  effectTime = time
  updatePhysics(time, props.motionSpeed)
  if (points) points.material.size = props.pointSize
  if (controls) controls.update()
  if (renderer && scene && camera) renderer.render(scene, camera)
}
watch(() => props.mode, async (newMode) => {
  if (!sceneReady) return
  emit("loading", true)
  targetsReadyRef = false
  currentEffect = "none"; explodeActive = false
  switch (newMode) {
    case "random": setRandomTargets(); break
    case "text": if (props.text) await setTargetsFromText(props.text); break
    case "image": if (props.imageUrl) await setTargetsFromImage(props.imageUrl); break
    case "gltf": if (props.gltfUrl) await setTargetsFromGLTF(props.gltfUrl); break
  }
  targetsReadyRef = true
  emit("loading", false)
})
// Also watch data sources so switching presets within the same mode re-samples
watch(
  () => ({ url: props.imageUrl, gltf: props.gltfUrl, txt: props.text }),
  async () => {
    if (!sceneReady) return
    emit("loading", true)
    targetsReadyRef = false
    currentEffect = "none"; explodeActive = false
    const m = props.mode
    if (m === "image") { if (props.imageUrl) await setTargetsFromImage(props.imageUrl) }
    else if (m === "gltf") { if (props.gltfUrl) await setTargetsFromGLTF(props.gltfUrl) }
    else if (m === "text") { if (props.text) await setTargetsFromText(props.text) }
    targetsReadyRef = true
    emit("loading", false)
  },
  { deep: true }
)
watch(() => props.effect, (newEffect) => {
  currentEffect = newEffect; explodeActive = false
  if (newEffect === "explode") { explodeActive = true; setTimeout(() => { explodeActive = false }, 2000) }
}, { immediate: true })
onMounted(() => { initScene() })
onBeforeUnmount(() => {
  if (animationId !== null) cancelAnimationFrame(animationId)
  window.removeEventListener("resize", onResize)
  renderer?.dispose(); geometry?.dispose()
})
defineExpose({
  takeScreenshot() {
    if (!renderer) return
    renderer.render(scene!, camera!)
    const url = renderer.domElement.toDataURL("image/png")
    const a = document.createElement("a"); a.href = url; a.download = "screenshot.png"; a.click()
  },
  resetView() {
    if (!camera || !controls) return
    camera.position.set(0, 0, 80); controls.target.set(0, 0, 0); controls.update()
  },
})
</script>
<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>
<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
}
</style>