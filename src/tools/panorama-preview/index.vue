<template>
    <div ref="panoramaContainer"></div>
</template>

<script setup>
import { LinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, SRGBColorSpace, TextureLoader, WebGLRenderer } from 'three';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import GUI from 'lil-gui';
import imageSrc from "./images/image.jpg"
import { fa, hi } from 'element-plus/es/locales.mjs';

const panoramaContainer = ref(null);
// 创建场景
const scene = new Scene();

// 创建相机
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 1); // 将相机位置调整得更远，减少畸变

// 创建渲染器
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 动画循环id
let removeAnimation;
let currentImageSrc;
function create(imageSrc) {
    currentImageSrc = imageSrc;
    // 清空场景
    scene.clear();

    // 加载全景图纹理
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(imageSrc);

    // 创建球体几何体
    // 增加分段数，获得更平滑的表面，减少畸变效果
    const geometry = new SphereGeometry(500, 120, 80); // 增加到120x80分段
    geometry.scale(-1, 1, 1); // 翻转球体，使纹理朝内

    // 创建材质 - 优化色彩表现
    const material = new MeshBasicMaterial({
        map: texture,
        color: 0xffffff, // 纯白色基础色，确保纹理色彩准确还原
        toneMapped: false // 禁用色调映射，保持原始色彩
    });

    // 确保纹理配置正确，以获得最佳色彩表现
    texture.colorSpace = SRGBColorSpace; // 设置正确的色彩空间
    texture.minFilter = LinearFilter; // 使用线性过滤，避免纹理像素化
    texture.magFilter = LinearFilter;

    // 创建网格并添加到场景
    const sphere = new Mesh(geometry, material);
    scene.add(sphere);

    // 鼠标控制变量
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;
    let currentAngleX = 0;
    let currentAngleY = 0;
    const rotateSpeed = 0.002;
    const easingFactor = 0.05; // 缓动系数，控制平滑过渡速度

    // 缩放控制变量
    let cameraDistance = 0.1; // 相机到球心的距离
    let targetDistance = cameraDistance;

    // 统一的拖拽开始处理函数
    function handleDragStart(clientX, clientY) {
        isDragging = true;
        dragStartX = clientX;
        dragStartY = clientY;
    }

    // 统一的拖拽移动处理函数
    function handleDragMove(clientX, clientY) {
        if (!isDragging) return;

        const deltaX = clientX - dragStartX;
        const deltaY = dragStartY - clientY;

        // 更新目标角度
        targetAngleY += deltaX * rotateSpeed;
        targetAngleX += deltaY * rotateSpeed;

        // 限制垂直旋转角度，避免过度倾斜
        targetAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetAngleX));

        dragStartX = clientX;
        dragStartY = clientY;
    }

    // 统一的拖拽结束处理函数
    function handleDragEnd() {
        isDragging = false;
    }

    function onMousedown(event) {
        handleDragStart(event.clientX, event.clientY);
    }
    function onMousemove(event) {
        handleDragMove(event.clientX, event.clientY);
    }
    function onMouseup() {
        handleDragEnd();
    }
    function onMouseleave() {
        handleDragEnd();
    }
    function onTouchstart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            handleDragStart(event.touches[0].clientX, event.touches[0].clientY);
        }
    }
    function onTouchmove(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            handleDragMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    }
    function onTouchend(event) {
        event.preventDefault();
        handleDragEnd();
    }
    function onTouchcancel(event) {
        event.preventDefault();
        handleDragEnd();
    }
    function onWheel(event) {
        event.preventDefault();

        // 优化缩放实现，限制FOV范围在45-90度，减少球面畸变
        const zoomSpeed = 1.5; // 每次滚轮滚动的FOV变化量

        if (event.deltaY < 0) {
            // 滚轮向前滚动，视角放大（FOV减小）
            camera.fov = Math.max(30, camera.fov - zoomSpeed);
        } else {
            // 滚轮向后滚动，视角缩小（FOV增大）
            camera.fov = Math.min(90, camera.fov + zoomSpeed);
        }

        // 更新相机投影矩阵，使FOV变化生效
        camera.updateProjectionMatrix();
    }
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 鼠标事件处理
    renderer.domElement.addEventListener('mousedown', onMousedown);

    renderer.domElement.addEventListener('mousemove', onMousemove);

    renderer.domElement.addEventListener('mouseup', onMouseup);

    renderer.domElement.addEventListener('mouseleave', onMouseleave);

    // 触摸事件处理，支持移动设备
    renderer.domElement.addEventListener('touchstart', onTouchstart);

    renderer.domElement.addEventListener('touchmove', onTouchmove);

    renderer.domElement.addEventListener('touchend', onTouchend);

    renderer.domElement.addEventListener('touchcancel', onTouchcancel);

    // 鼠标滚轮事件 - 优化缩放实现，减少畸变
    // 限制FOV范围，避免过度畸变
    renderer.domElement.addEventListener('wheel', onWheel);

    // 添加窗口大小调整事件
    window.addEventListener('resize', onResize);

    if (removeAnimation) {
        removeAnimation();
    }
    // 动画循环
    let stopAnimation = false;
    function animate() {
        if(stopAnimation){
            return;
        }
        requestAnimationFrame(animate);

        // 平滑过渡：使用缓动函数更新当前角度
        currentAngleX += (targetAngleX - currentAngleX) * easingFactor;
        currentAngleY += (targetAngleY - currentAngleY) * easingFactor;

        // 移除缓动效果，直接更新相机距离用于调试
        cameraDistance = targetDistance;

        // 更新相机位置，使用当前距离
        camera.position.x = Math.sin(currentAngleY) * Math.cos(currentAngleX) * cameraDistance;
        camera.position.y = Math.sin(currentAngleX) * cameraDistance;
        camera.position.z = Math.cos(currentAngleY) * Math.cos(currentAngleX) * cameraDistance;

        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    // 启动动画
    animate();

    // 移除所有
    removeAnimation = () => {
        removeAnimation = null;
        renderer.domElement.removeEventListener('mousedown', onMousedown);
        renderer.domElement.removeEventListener('mousedown', onMousedown);
        renderer.domElement.removeEventListener('mousemove', onMousemove);
        renderer.domElement.removeEventListener('mouseup', onMouseup);
        renderer.domElement.removeEventListener('mouseleave', onMouseleave);
        renderer.domElement.removeEventListener('touchstart', onTouchstart);
        renderer.domElement.removeEventListener('touchmove', onTouchmove);
        renderer.domElement.removeEventListener('touchend', onTouchend);
        renderer.domElement.removeEventListener('touchcancel', onTouchcancel);
        renderer.domElement.removeEventListener('wheel', onWheel);
        window.removeEventListener('resize', onResize);
        stopAnimation = true;
    }
}

onMounted(() => {
    if (panoramaContainer.value) {
        panoramaContainer.value.appendChild(renderer.domElement);
        create(imageSrc);
    }
})


// GUI控制器
const data = {
    uploadImage() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const imageURL = URL.createObjectURL(file);
            create(imageURL);
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        setTimeout(() => {
            document.body.removeChild(fileInput);
        }, 100);
    },
    // 重置函数
    resetView() {
        create(currentImageSrc);
    },
    hideController: false
}
const gui = new GUI({ title: '控制器' });
gui.add(data, 'hideController').name('隐藏控制器').onChange(function (value) {
    const lilRoot = document.querySelector('.lil-root');
    if (lilRoot) {
        if (value) {
            lilRoot.classList.add('lil-gui-hidden');
        } else {
            lilRoot.classList.remove('lil-gui-hidden');
        }
    }
})
gui.add(data, 'resetView').name('重置');
gui.add(data, 'uploadImage').name('上传全景图');

onBeforeUnmount(() => {
    gui.destroy();
    // 停止动画循环
    if(removeAnimation){
        removeAnimation();
    }
})
</script>

<style scoped></style>