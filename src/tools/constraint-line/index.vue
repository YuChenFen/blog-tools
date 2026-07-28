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
    showLine: true,
    nodesLength: 1,
    nodeSize: 20,
    nodeSizeType: 'default',
    nodeRadius: 50,
    nodeColor: '#000000',
    strokeColor: '#000000',
    lineColor: '#000000'
}

// 节点大小选项
function nodeSizeOption(defaultSize, idx) {
    switch (data.nodeSizeType) {
        case 'default': return defaultSize;
        case 'snake':
            if (idx === 0) {
                return defaultSize * 3 / 4;
            } else if (idx === 1) {
                return defaultSize * 3 / 2;
            } else {
                return defaultSize - (idx - 2) * (defaultSize / data.nodesLength)
            }
    }
    return defaultSize;
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
        ctx.fillStyle = data.nodeColor;
        ctx.fill();
        if (data.showNodeStroke) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = data.strokeColor;
            ctx.stroke();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    nodes[nodes.length - 1].draw(ctx);
    for (let i = nodes.length - 1; i >= 1; i--) {
        nodes[i - 1].draw(ctx);
        if (data.showLine) {
            ctx.beginPath()
            ctx.moveTo(nodes[i - 1].position.x, nodes[i - 1].position.y)
            ctx.lineTo(nodes[i].position.x, nodes[i].position.y)
            ctx.lineWidth = 4;
            ctx.strokeStyle = data.lineColor;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
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
    const initialPos = new Victor(window.innerWidth * dpr / 2, window.innerHeight * dpr / 2);
    nodes.length = 0;
    for (let i = 0; i < data.nodesLength; i++) {
        const node = new Node(initialPos.clone(), nodeSizeOption(data.nodeSize, i), data.nodeRadius);
        nodes.push(node);
    }
    draw();
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
const nodeFolder = gui.addFolder('节点选项');
nodeFolder.add(data, 'nodesLength', 1, 80).step(1).name('节点个数').onChange(reNodes);
nodeFolder.add(data, 'nodeSize', 0, 100).step(1).name('节点大小').onChange(reNodes);
nodeFolder.add(data, 'nodeSizeType', { 
    默认: 'default',
    蛇: 'snake'
}).name('节点样式').onChange(reNodes);
nodeFolder.addColor(data, 'nodeColor').name('节点颜色').onChange(draw);

const constraintFolder = gui.addFolder('约束选项');
constraintFolder.add(data, 'showNodeStroke').name('是否显示约束边框').onChange(draw);
constraintFolder.add(data, 'showLine').name('是否显示线条').onChange(draw);
constraintFolder.add(data, 'nodeRadius', 10, 150).step(1).name('节点间隔').onChange(reNodes);
constraintFolder.addColor(data, 'strokeColor').name('边框颜色').onChange(draw);
constraintFolder.addColor(data, 'lineColor').name('线条颜色').onChange(draw);
</script>

<style lang="scss" scoped></style>