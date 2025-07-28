<template>
    <div id="action" :class="{ hide: actionHide }">
        <input type="file" id="file-input" @change="upload($event)">
        <div>
            <span>圆圈个数</span>
            <input type="number" id="circle-num" v-model="circleCounts" @change="reRender">
        </div>
        <div>
            <span>采样间隔</span>
            <input type="number" id="path-delta" step="0.01" min="0.001" v-model="pathDelta" @change="reRender">
        </div>
        <div>
            <span>路径缩放</span>
            <input type="number" id="path-scale" v-model="scale" @change="reRender"></input>
        </div>
        <div>
            <span>显示原点集</span>
            <input type="checkbox" id="show-path-points" v-model="showPathPoints"></input>
        </div>
        <div>
            <span>显示圆圈</span>
            <input type="checkbox" id="show-circles" v-model="showCircles"></input>
        </div>
        <div>
            <span>显示向量集</span>
            <input type="checkbox" id="show-vector" v-model="showVector"></input>
        </div>
        <div>
            <span>显示轨迹线</span>
            <input type="checkbox" id="show-points" v-model="showPoints"></input>
        </div>
        <div>
            <span>显示时域图</span>
            <input type="checkbox" id="show-pssine" v-model="showPssine"></input>
        </div>
        <div>
            <span>隐藏工具栏</span>
            <input type="checkbox" id="show-pssine" v-model="actionHide"></input>
        </div>
    </div>
    <canvas ref="canvasRef" id="canvas"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getPathPoints } from './svg';
import { Complex, FourierSeries } from './math';
import { getRandomColor } from './utils';
import { drawAxis, drawCircle, drawLink, drawSolve, drawVector } from './draw';

const actionHide = ref(false);
const canvasRef = ref(null);
const dpr = window.devicePixelRatio;
let ctx2d = null;
let drawable = false;
const points = [];  // 轨迹线
const pssine = [];  // 摆线
const pssineColors = [];    // 摆线颜色
let circleCounts = ref(30);    // 圆圈个数
let pathDelta = ref(0.5);  // 采样间隔
let scale = ref(20);   // 图片缩放
let showPathPoints = ref(true); // 是否显示源点集
let showCircles = ref(true); // 是否显示圆圈
let showVector = ref(true);  // 是否显示向量
let showPoints = ref(true);  // 是否显示轨迹线
let showPssine = ref(true);
const pathCircles = [];
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.09 10.91"><path class="cls-1" d="M9.24,.04c-.61,.11-1.12,.3-1.55,.59l-.44,.36-.69,.69C5.56,.92,5.13,0,3.29,.02l-.78,.13c-.66,.2-1.3,.59-1.68,1.07-.23,.28-.45,.63-.59,.99-.84,2.12,.61,3.45,1.6,4.43l1.72,1.7,2.12,2.1c.26,.21,.45,.56,1.01,.46,.67-.12,1.37-1.1,1.81-1.53,.83-.83,1.67-1.65,2.5-2.48,.77-.77,1.64-1.41,1.97-2.62C13.61,1.97,11.48-.35,9.24,.04h0"></path></svg>`;
let pathPoints = getPathPoints(svg, scale.value, pathDelta.value);
let animationId = null;

function windowResize() {
    canvasRef.value.width = window.innerWidth * dpr;
    canvasRef.value.height = window.innerHeight * dpr;
    canvasRef.value.style.width = window.innerWidth + 'px';
    canvasRef.value.style.height = window.innerHeight + 'px';
    initCtx(ctx2d);
}

onMounted(() => {
    canvasRef.value.width = window.innerWidth * dpr;
    canvasRef.value.height = window.innerHeight * dpr;
    canvasRef.value.style.width = window.innerWidth + 'px';
    canvasRef.value.style.height = window.innerHeight + 'px';
    ctx2d = canvas.getContext('2d');
    initCtx(ctx2d);
    getCircles();
    // 绘制
    let i = 0;
    (function run() {
        if (drawable) {
            drawAxis(ctx2d);
            if (showPathPoints.value) {
                for (let i = 0; i < pathPoints.length; i++) {
                    for (let j = 0; j < pathPoints[i].length; j++) {
                        drawCircle(ctx2d, -pathPoints[i][j].x, -pathPoints[i][j].y, 1, "pink");
                    }
                }
            }
            draw(ctx2d, i);
            i += 1;
        }
        animationId = requestAnimationFrame(run);
    })();

    window.addEventListener("resize", windowResize);
})
onBeforeUnmount(() => {
    window.removeEventListener("resize", windowResize);
    cancelAnimationFrame(animationId);
})

function initCtx(ctx) {
    if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1, -1);
        drawable = true;
    }
};

function draw(ctx, idx = 0) {
    if (!ctx) {
        return;
    }
    for (let i = 0; i < pathCircles.length; i++) {
        let delta = window.innerWidth / 2 - 500;
        let x = 0;
        let y = 0;
        pathCircles[i].forEach((c) => {
            if (showCircles.value) {
                drawCircle(ctx, x, y, c.r);
            }
            const st = { x, y };
            x += c.r * Math.cos(((c.omega * idx * Math.PI) / 180) + c.varphi);
            y += c.r * Math.sin(((c.omega * idx * Math.PI) / 180) + c.varphi);
            const sp = { x, y };
            if (showVector.value) {
                drawVector(ctx, st, sp);
            }
        });
        points[i].push(x);
        points[i].push(y);
        if (points[i].length > canvas.height * canvas.width * 2) {
            points[i].shift();
            points[i].shift();
        }
        if (showPoints.value) {
            drawSolve(ctx, points[i]);
        }
        pssine[i].unshift(y);
        if (pssine[i].length > canvas.height * canvas.width) {
            pssine[i].pop();
        }
        const pp = [];
        pssine[i].forEach((p, i) => {
            pp.push(i / 2 + delta);
            pp.push(p);
        });
        if (showPssine.value) {
            drawSolve(ctx, pp, null, pssineColors[i]);
            drawLink(ctx, { x, y }, { x: delta, y });
        }
    }
}

function cleanCanvas() {
    points.length = 0;
    pssine.length = 0;
    pssineColors.length = 0;
    pathCircles.length = 0;
}
function getCircles() {
    cleanCanvas();
    let fx = [];
    for (let i = 0; i < pathPoints.length; i++) {
        let x = [];
        for (let j = 0; j < pathPoints[i].length; j++) {
            x.push(new Complex(pathPoints[i][j].x, pathPoints[i][j].y));
        }
        fx.push(x);
    }
    let fourierSeries = new FourierSeries();
    let ak = [];
    for (let i = 0; i < fx.length; i++) {
        ak.push(fourierSeries.get_ak(fx[i], circleCounts.value, 1));
    }
    for (let i = 0; i < ak.length; i++) {
        let circles = [];
        for (let j = 0; j < ak[i].length; j++) {
            let r = Math.hypot(ak[i][j].real, ak[i][j].imag);
            let omega = (1 + j >> 1) * (j & 1 ? -1 : 1);
            let varphi = Math.atan2(ak[i][j].imag, ak[i][j].real);
            circles.push({ r, omega, varphi });
        }
        circles.sort((a, b) => b.r - a.r);
        pathCircles.push(circles);
        points.push([]);
        pssine.push([]);
        pssineColors.push(getRandomColor());
    }
}

function upload(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            svg = e.target.result;
            pathPoints = getPathPoints(svg, scale.value, pathDelta.value);
            getCircles();
        }
        reader.readAsText(file);
    }
}

function reRender() {
    pathPoints = getPathPoints(svg, scale.value, pathDelta.value);
    getCircles();
}
</script>

<style scoped>
#canvas {
    background-color: #202020;
}

input {
    outline: none;
}

#action {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    color: #fff;
    transition: opacity 0.5s;
}

#action.hide {
    opacity: 0;
}

#action:hover {
    opacity: 1;
}

#action div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    font-size: 0.9em;
}
</style>