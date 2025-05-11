<template>
    <div class="container">
        <el-form label-width="auto" style="padding: 20px;height: 100vh;overflow: auto;"
            label-position="left">
            <el-form-item label="版本">
                <el-input-number v-model="VERSION" :min="1" :max="40" @change="draw" controls-position="right" />
            </el-form-item>
            <el-form-item label="纠错级别">
                <el-select v-model="errorCorrectionLevel" placeholder="请选择纠错级别" @change="changeErrorCorrectionLevel">
                    <el-option v-for="item in errorCorrectionLevelArray" :key="item.vlaue" :label="item.label"
                        :value="item.vlaue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="掩膜类型">
                <el-input-number v-model="maskPatternReference" :min="0" :max="7" @change="draw"
                    controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item label="文本内容">
                <el-input v-model="text" type="textarea" :row="2" placeholder="请输入内容" @change="draw"></el-input>
            </el-form-item>
            <el-form-item label="是否显示分区颜色">
                <el-switch v-model="showColor" @change="draw"></el-switch>
            </el-form-item>
            <el-form-item label="是否显示网格">
                <el-switch v-model="showGrid" @change="draw"></el-switch>
            </el-form-item>
            <el-form-item label="绘制数据线（未占用格子）">
                <el-switch v-model="showDataLine" @change="draw"></el-switch>
            </el-form-item>
            <el-form-item label="方块颜色">
                <div class="color-picker">
                    <el-popover placement="bottom" :width="400" trigger="click">
                        <template #reference>
                            <canvas ref="colorPickerCanvas" width="80" height="30"
                                style="border: 1px solid #999;border-radius: 5px;cursor: pointer;"></canvas>
                        </template>
                        <Colorpicker :change="setColor"></Colorpicker>
                    </el-popover>
                </div>
            </el-form-item>
            <el-form-item label="透明度">
                <el-slider v-model="alpha" :min="0" :max="100" @change="draw"></el-slider>
            </el-form-item>
            <el-collapse>
                <el-collapse-item>
                    <template #title>
                        <el-text size="large">绘制过程</el-text>
                    </template>
                    <el-form-item label="定位图案">
                        <el-switch v-model="locationStep" @change="draw"></el-switch>
                    </el-form-item>
                    <el-form-item label="对齐图案">
                        <el-switch v-model="alignmentStep" @change="draw"></el-switch>
                    </el-form-item>
                    <el-form-item label="时序图案">
                        <el-switch v-model="timelineStep" @change="draw"></el-switch>
                    </el-form-item>
                    <el-form-item label="格式信息">
                        <el-switch v-model="formatInfoStep" @change="draw"></el-switch>
                    </el-form-item>
                    <el-form-item label="版本信息">
                        <el-switch v-model="versionInfoStep" @change="draw"></el-switch>
                    </el-form-item>
                    <el-form-item label="数据信息">
                        <el-switch v-model="dataStep" @change="draw"></el-switch>
                    </el-form-item>
                    <el-form-item label="掩膜">
                        <el-switch v-model="maskStep" @change="draw"></el-switch>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item>
                    <template #title>
                        <el-text size="large">绘制效果</el-text>
                    </template>
                    <el-form-item label="单位图形">
                        <el-select v-model="drawType" placeholder="请选择单位图形" @change="draw">
                            <el-option v-for="item in drawTypeArray" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <div ref="canvasContainerRef" class="canvas-container">
            <canvas ref="canvasRef"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { Painter } from "./painter.js"
import Colorpicker from "../../Colorpicker/index.vue"
import { drawColor } from './utils.js';

const colorPickerCanvas = ref(null);

const errorCorrectionLevelArray = [
    {
        label: "L （容错率:7%）",
        vlaue: "L"
    },
    {
        label: "M （容错率:15%）",
        vlaue: "M"
    },
    {
        label: "Q （容错率:25%）",
        vlaue: "Q"
    },
    {
        label: "H （容错率:30%）",
        vlaue: "H"
    }
]
const drawTypeArray = [
    {
        value: "rect",
        label: "矩形"
    },
    {
        value: "circle",
        label: "圆形"
    },
    {
        value: "diamond",
        label: "菱形"
    },
    {
        value: "rounded-rectangle",
        label: "圆角矩形"
    },
    {
        value: "chess",
        label: "棋子"
    }
]
const canvasRef = ref(null);
const canvasContainerRef = ref(null);
const errorCorrectionLevel = ref("M");
const maskPatternReference = ref(0);
const text = ref("");
const showColor = ref(false);
const showGrid = ref(false);
const showDataLine = ref(false);
const rectColor = ref("#000000");
const alpha = ref(100);
// 绘制过程
const locationStep = ref(true);
const alignmentStep = ref(true);
const timelineStep = ref(true);
const formatInfoStep = ref(true);
const versionInfoStep = ref(true);
const dataStep = ref(true);
const maskStep = ref(true);
// 绘制样式
const drawType = ref("rect");

// 版本
const VERSION = ref(7);

function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function draw() {
    const canvas = canvasRef.value;
    const SIZE = canvasContainerRef.value.clientWidth / 5 * 3;
    canvas.width = SIZE;
    canvas.height = SIZE;

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const painter = new Painter(canvas, "2d", Number(VERSION.value), errorCorrectionLevel.value, Number(maskPatternReference.value));

    // 添加定位图案
    if (locationStep.value) {
        painter.addLocation(showColor.value ? "#ff0000bb" : void 0);
    }
    // 添加对齐图案
    if (alignmentStep.value) {
        painter.addAlignment(showColor.value ? "#00ff00bb" : void 0);
    }
    // 添加时序图
    if (timelineStep.value) {
        painter.addTimeline(showColor.value ? "#0000ffbb" : void 0);
    }
    // 添加格式信息
    if (formatInfoStep.value) {
        painter.addFormatInfo(showColor.value ? "#ffff00bb" : void 0);
    }
    // 添加版本信息
    if (versionInfoStep.value) {
        painter.addVersionInfo(showColor.value ? "#ff00ffbb" : void 0);
    }
    // 添加数据
    if (dataStep.value) {
        painter.addData(showColor.value ? "#ff7007bb" : void 0, toUtf8(text.value), 0b0100);
    }
    // 添加掩膜
    if (maskStep.value) {
        painter.addMask();
    }
    // 绘制
    let color_alpha = Math.floor(255 * alpha.value / 100);
    let color = rectColor.value;
    painter.drawCode(color, color_alpha, drawType.value);
    if (showDataLine.value) {
        painter.drawDataLine();
    }
    // 绘制网格
    if (showGrid.value) {
        painter.drawGrid();
    }
    // 绘制分区
    painter.drawPartition();
}
onMounted(() => {
    draw();
});
function setColor(type, color) {
    rectColor.value = {
        type: type,
        color: color
    };

    nextTick(() => {
        draw();
    });
}
function changeErrorCorrectionLevel(value) {
    errorCorrectionLevel.value = value;
    draw();
}

watch(() => rectColor.value, () => {
    nextTick(() => {
        drawColor(rectColor.value.type, rectColor.value.color, colorPickerCanvas.value);
    })
})
</script>

<style scoped>
.container {
    display: flex;
    height: 100%;
}

.canvas-container {
    flex: 1;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.activate-box {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    overflow-y: auto;
    padding: 15px 20px;
}

.activate-box .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

@media screen and (max-width: 768px) {
    .container {
        flex-direction: column;
    }

    .activate-box {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: auto;
    }
}
</style>