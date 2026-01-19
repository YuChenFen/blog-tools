<template>
    <div>
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Boid from './boids';
import GUI from 'lil-gui';

const canvasRef = ref();
let ctx = null;
const dpr = window.devicePixelRatio;
let animationId = null;
// 参数
const data = {
    hideController: false,
    separationWeight: 1.0,
    alignmentWeight: 1.0,
    cohesionWeight: 1.0
}

// 参数调节
const gui = new GUI({ title: '参数调节' });
gui.add(data, 'hideController').name('隐藏控制器').onChange(function (value) {
    const lilRoot = document.querySelector('.lil-root');
    if (lilRoot) {
        if (value) {
            lilRoot.classList.add('lil-gui-hidden');
        }else{
            lilRoot.classList.remove('lil-gui-hidden');
        }
    }
})
gui.add(data, 'separationWeight', 0, 2).step(0.01).name('分离权重');
gui.add(data, 'alignmentWeight', 0, 2).step(0.01).name('对齐权重');
gui.add(data, 'cohesionWeight', 0, 2).step(0.01).name('聚集权重');

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
            separationWeight: data.separationWeight,
            alignmentWeight: data.alignmentWeight,
            cohesionWeight: data.cohesionWeight
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
    gui.destroy();
})
</script>

<style scoped>
</style>