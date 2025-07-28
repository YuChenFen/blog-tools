<template>
    <div>
        <canvas ref="canvasRef"></canvas>
        <div class="attrs">
            <div class="attrs-item">
                <div class="label">
                    分离权重
                </div>
                <div class="value">
                    <input type="range" min="0" max="2" step="0.01" v-model="separationWeight"></input>
                </div>
            </div>
            <div class="attrs-item">
                <div class="label">
                    对齐权重
                </div>
                <div class="value">
                    <input type="range" min="0" max="2" step="0.01" v-model="alignmentWeight"></input>
                </div>
            </div>
            <div class="attrs-item">
                <div class="label">
                    聚集权重
                </div>
                <div class="value">
                    <input type="range" min="0" max="2" step="0.01" v-model="cohesionWeight"></input>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Boid from './boids';

const canvasRef = ref();
let ctx = null;
const dpr = window.devicePixelRatio;
let animationId = null;
// 参数
const separationWeight = ref(1.0);
const alignmentWeight = ref(1.0);
const cohesionWeight = ref(1.0);

function resizeCanvas() {
    canvasRef.value.width = window.innerWidth * dpr;
    canvasRef.value.height = window.innerHeight * dpr;
    canvasRef.value.style.width = window.innerWidth - 5 + 'px';
    canvasRef.value.style.height = window.innerHeight - 5 + 'px';
}

// 创建Boids群体
const boids = [];
const boidsCount = 300;

function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

    // 更新并绘制所有Boid
    for (const boid of boids) {
        boid.flock(boids, {
            separationWeight: separationWeight.value,
            alignmentWeight: alignmentWeight.value,
            cohesionWeight: cohesionWeight.value
        });
        boid.update();
        boid.draw();
    }
    animationId = requestAnimationFrame(animate);
}

onMounted(() => {
    resizeCanvas();
    ctx = canvasRef.value.getContext('2d');
    window.addEventListener('resize', resizeCanvas);
    for (let i = 0; i < boidsCount; i++) {
        boids.push(new Boid(canvasRef.value));
    }
    animate();
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas);
    cancelAnimationFrame(animationId);
})
</script>

<style scoped>
.attrs {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
}

.attrs-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
}

.attrs-item label {
    font-size: 14px;
    color: #333;
}

.attrs-item .value {
    display: flex;
    align-items: center;
    width: 150px;
}

[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
    outline: 0;
    background-color: transparent;
    width: 120px;
    height: 15px;
}

[type="range"]::-webkit-slider-runnable-track {
    background: #0000004f;
    height: 15px;
}

[type="range" i]::-webkit-slider-container {
    height: 15px;
    overflow: hidden;
}

[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0px;
    height: 15px;
    border: 1px solid transparent;
    border-image: linear-gradient(#2FA1D6, #2FA1D6) 0 fill / 0 0 0 0 / 0px 0px 0 200px;
    cursor: e-resize;
}
</style>