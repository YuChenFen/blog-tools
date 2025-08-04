<template>
    <div style="display: flex;flex-direction: column;align-items: center;gap: 10px;height: 100%;">
        <div class="input-group">
            <div class="input-group-item">
                <p>width</p>
                <el-input-number v-model="width" :step="25" size="small" />
            </div>
            <div class="input-group-item">
                <p>height</p>
                <el-input-number v-model="height" :step="25" size="small" />
            </div>
        </div>
        <div class="canvas-container">
            <canvas ref="canvasRef"></canvas>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useWgslEditorStore } from './store';
import { storeToRefs } from 'pinia'

const wgslEditorStore = useWgslEditorStore();
const { vertexShader, fragmentShader } = storeToRefs(wgslEditorStore);
let adapter, device, ctx;
const dpr = window.devicePixelRatio || 1;
const canvasRef = ref(null);
const width = ref(450);
const height = ref(450);
let frame = 0;
let animationFrame = null;

onMounted(async () => {
    adapter = await navigator.gpu?.requestAdapter();
    device = await adapter?.requestDevice();
    setCanvasSize(450, 450);

    let canvas = canvasRef.value; // canvas画布
    ctx = canvas.getContext('webgpu');
    draw()
})

function draw() {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    ctx.configure({
        device: device,
        format: presentationFormat,
    });

    // 顶点数据
    const vertexArray = new Float32Array([
        -1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
    ]);
    // 顶点缓冲区
    const vertexBuffer = device.createBuffer({
        size: vertexArray.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    // 将顶点数据写入顶点缓冲区
    device.queue.writeBuffer(vertexBuffer, 0, vertexArray);


    // 渲染管线
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            // 顶点缓冲区
            buffers: [{
                arrayStride: 3 * 4, //一个顶点数据占用的字节长度
                attributes: [{
                    shaderLocation: 0,  //GPU显存上顶点缓冲区标记存储位置
                    format: "float32x3",    //格式：loat32x3表示一个顶点数据包含3个32位浮点数
                    offset: 0   //顶点缓冲区中顶点数据在显存中的偏移量
                }]
            }],
            // 顶点着色器
            module: device.createShaderModule({
                code: vertexShader.value,   //顶点着色器代码
            }),
            entryPoint: "main", //顶点着色器入口函数

        },
        fragment: {
            // 片元着色器
            module: device.createShaderModule({
                code: fragmentShader.value, //片元着色器代码
            }),
            entryPoint: "main", //片元着色器入口函数
            targets: [{
                format: presentationFormat, //渲染通道的像素格式
                blend: { // 启用 Alpha 混合
                    color: {
                        srcFactor: "src-alpha",
                        dstFactor: "one-minus-src-alpha",
                        operation: "add",
                    },
                    alpha: {
                        srcFactor: "one",
                        dstFactor: "one-minus-src-alpha",
                        operation: "add",
                    },
                },
            }]
        },
        primitive: {
            topology: "triangle-list"   //顶点绘制方式
        }
    });

    // 创建帧uniform缓冲区
    const frameUniformBuffer = device.createBuffer({
        size: 4, // 只需要一个int32表示帧
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    // 在渲染循环中更新时间
    function updateFrame() {
        frame++;
        device.queue.writeBuffer(frameUniformBuffer, 0, new Float32Array([frame]));
    }

    // 创建绑定组
    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: { buffer: frameUniformBuffer }
        }]
    });

    // 创建GPU命令编码器对象
    const commandEncoder = device.createCommandEncoder();

    const renderPass = commandEncoder.beginRenderPass({
        // 给渲染通道指定颜色缓冲区，配置指定的缓冲区
        colorAttachments: [{
            view: ctx.getCurrentTexture().createView(),
            storeOp: 'store',   //像素数据写入颜色缓冲区
            loadOp: 'clear',
            clearValue: { r: 1, g: 1, b: 1, a: 1.0 }, //背景颜色
        }]
    });

    // 设置渲染管线
    renderPass.setPipeline(pipeline);
    // 设置uniform数据
    renderPass.setBindGroup(0, bindGroup);
    // 设置顶点缓冲区
    renderPass.setVertexBuffer(0, vertexBuffer);
    // 绘制命令
    renderPass.draw(6);
    // 结束绘制
    renderPass.end();
    // 完成并提交命令
    device.queue.submit([commandEncoder.finish()]);

    function render() {
        updateFrame(); // 更新时间uniform

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass({
            // 给渲染通道指定颜色缓冲区，配置指定的缓冲区
            colorAttachments: [{
                view: ctx.getCurrentTexture().createView(),
                storeOp: 'store',   //像素数据写入颜色缓冲区
                loadOp: 'clear',
                clearValue: { r: 1, g: 1, b: 1, a: 1.0 }, //背景颜色
            }]
        });

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        // 设置顶点缓冲区
        passEncoder.setVertexBuffer(0, vertexBuffer);
        // 绘制命令
        passEncoder.draw(6);

        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);

        animationFrame = requestAnimationFrame(render);
    }

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    render();
}

function setCanvasSize(width, height) {
    canvasRef.value.width = width * dpr;
    canvasRef.value.height = height * dpr;
    canvasRef.value.style.width = width + 'px';
    canvasRef.value.style.height = height + 'px';
}

watch(() => [vertexShader.value, fragmentShader.value], () => {
    draw()
})
watch(() => [width.value, height.value], () => {
    setCanvasSize(width.value, height.value)
})
</script>

<style scoped>
.canvas-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 0;
}

.input-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 10px;
}

.input-group-item {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>