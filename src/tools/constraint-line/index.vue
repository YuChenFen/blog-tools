<template>
    <canvas ref="canvasRef" @mousemove="move"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import Victor from 'victor';
import GUI from 'lil-gui';

const dpr = window.devicePixelRatio || 1;
const canvasRef = ref(null);
let ctx = null;
const nodes = []
// 参数
const data = {
    hideController: false,
    showNodeStroke: false,
    nodesLength: 1,
    nodeRadius: 50
}

class Node {
    constructor(position, size, radius) {
        this.position = position;
        this.size = size;
        this.radius = radius;
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        if (data.showNodeStroke) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    nodes[0].draw(ctx);
    for (let i = 1; i < nodes.length; i++) {
        ctx.beginPath()
        ctx.moveTo(nodes[i - 1].position.x, nodes[i - 1].position.y)
        ctx.lineTo(nodes[i].position.x, nodes[i].position.y)
        ctx.lineWidth = 4;
        ctx.strokeStyles = '#000000';
        ctx.lineCap = 'round';
        ctx.stroke();
        nodes[i].draw(ctx);
    }
}

function move(e) {
    nodes[0].position.x = e.clientX * dpr
    nodes[0].position.y = e.clientY * dpr

    for (let i = 1; i < nodes.length; i++) {
        const newPosition = nodes[i].position.clone()
            .subtract(nodes[i - 1].position)
            .normalize()
            .multiply(new Victor(nodes[i].radius, nodes[i].radius))
            .add(nodes[i - 1].position)
        nodes[i].position = newPosition
    }
    draw();
}

function reNodes() {
    nodes.length = 0;
    for (let i = 0; i < data.nodesLength; i++) {
        const node = new Node(new Victor(100, 100), 20, data.nodeRadius);
        nodes.push(node);
    }
}

onMounted(() => {
    const canvas = canvasRef.value;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth - 5 + 'px';
    canvas.style.height = window.innerHeight - 5 + 'px';

    window.canvas = canvas
    ctx = canvas.getContext('2d');

    reNodes();
    draw();

})
onBeforeUnmount(() => {
    gui.destroy();
})

const gui = new GUI({ title: '参数调节' });
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
gui.add(data, 'showNodeStroke').name('是否显示节点边框');
gui.add(data, 'nodesLength', 1, 80).step(1).name('节点个数').onChange(reNodes);
gui.add(data, 'nodeRadius', 20, 100).step(1).name('节点间隔').onChange(reNodes);
</script>

<style lang="scss" scoped></style>