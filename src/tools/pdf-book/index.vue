<template>
    <div
        style="width: 100%;height: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;overflow: hidden;">
        <div v-if="pdfNumPages === 0" class="active" @click="uploadPdf">
            <h2>点击上传PDF文件</h2>
        </div>
        <div id="flipbook"></div>
    </div>
</template>

<script setup>
import $ from 'jquery'
import turn from '../../assets/js/turn.min.js'
import * as pdfjs from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url'
import { nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'

function isMobile() {
    // 用户代理检测
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 触摸设备检测
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 屏幕尺寸检测
    const isSmallScreen = window.innerWidth <= 768;

    // 综合判断：满足其中两个条件即认为是移动设备
    return (isMobileUA && isTouchDevice) || (isTouchDevice && isSmallScreen) || (isMobileUA && isSmallScreen);
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

let pdfNumPages = ref(0)
const pageObj = {
    width: 0,
    height: 0
}

async function pdfInit(data) {
    // 获取元素
    const pdfContainer = document.querySelector('#flipbook')
    pdfContainer.innerHTML = ''
    pdfContainer.style.display = 'none'
    if (!pdfContainer) {
        ElMessage({
            message: '未找到pdf容器元素',
            type: 'warning',
            duration: 1000
        })
        return
    }

    const loadingTask = pdfjs.getDocument({
        data: data,
    })
    const pdf = await loadingTask.promise

    // 计算最佳缩放
    const dpr = window.devicePixelRatio || 1;
    const outputScale = 2; // 额外缩放因子，可根据需要调整

    pdfNumPages.value = pdf.numPages
    for (let index = 0; index < pdfNumPages.value; index++) {
        const page = await pdf.getPage(index + 1)
        const viewport = page.getViewport({ scale: 1.0 })
        const scale = Math.min(
            (document.body.clientWidth - 20) / viewport.width,
            (document.body.clientHeight - 20) / viewport.height
        ) * outputScale * dpr;
        const scaledViewport = viewport.clone({
            scale: scale
        });
        pageObj.width = Math.max(pageObj.width, scaledViewport.width / outputScale / dpr);
        pageObj.height = Math.max(pageObj.height, scaledViewport.height / outputScale / dpr);

        const divPage = document.createElement('div');
        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = `${scaledViewport.width / outputScale / dpr}px`;
        canvas.style.height = `${scaledViewport.height / outputScale / dpr}px`;
        const context = canvas.getContext('2d')
        if (!context) {
            return
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
            intent: 'print'
        }
        await page.render(renderContext).promise
        if (!(index === 0 || (index === pdfNumPages.value - 1 && pdfNumPages.value % 2 === 0))) {
            const gradient = document.createElement('div');
            gradient.className = 'gradient';
            divPage.appendChild(gradient)
        }
        divPage.appendChild(canvas)
        pdfContainer.appendChild(divPage)
    }
    pdfContainer.style.display = 'block'
}

async function changeFile(file) {
    if (file.type != 'application/pdf') {
        ElMessage({
            message: '请选择上传pdf文件',
            type: 'warning',
            duration: 1000
        })
        return
    }
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)//读取文件
    reader.onload = async function (e) {
        try {
            const pdfData = new Uint8Array(e.target.result);
            let elm = ElMessage({
                message: '正在加载中...',
                type: 'info',
                duration: 0,
            })
            await pdfInit(pdfData)
            ElMessage({
                message: '加载完成',
                type: 'success',
            })
            elm.close()

            nextTick(() => {
                const _isMobile = isMobile()
                $('#flipbook').turn({
                    acceleration: true, // 是否启动硬件加速 如果为触摸设备必须为true
                    pages: pdfNumPages.value, // 页码总数
                    elevation: 50,
                    width: _isMobile ? pageObj.width : pageObj.width * 2,
                    height: pageObj.height,
                    gradients: true, // 是否显示翻页阴影效果
                    display: _isMobile ? 'single' : 'double', //设置单页还是双页
                    // autoCenter: true, // 是否自动居中
                    when: {
                        first: function () {
                            ElMessage({
                                message: '不能往前翻了',
                                type: 'error'
                            })
                        },
                        last: function () {
                            ElMessage({
                                message: '已经是最后一页了',
                                type: 'error'
                            })
                        }
                    }
                });
            })
        } catch (e) {
            ElMessage({
                message: '上传失败' + e,
                type: 'error'
            })
        }
    }
}

async function uploadPdf() {
    try {
        let file
        if (window.showOpenFilePicker) {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'PDF文件',
                    accept: { 'application/pdf': ['.pdf'] }
                }],
                excludeAcceptAllOption: true
            });
            file = await fileHandle.getFile();
            changeFile(file);
        } else {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf';
            input.onchange = async function () {
                file = input.files[0];
                changeFile(file);
            };
            input.click();
        }
    } catch (err) {
        // 用户取消了选择或浏览器不支持
        ElMessage({
            message: '文件选择取消或出错:' + err,
            type: 'warning',
            duration: 1000
        })
    }
}

</script>

<style scoped>
#flipbook {
    max-width: 100%;
    max-height: 100%;
    border: 1px solid #ccc;
}

#flipbook :deep(.even .gradient) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: -webkit-gradient(linear, left top, right top, color-stop(0.95, rgba(0, 0, 0, 0)), color-stop(1, rgba(0, 0, 0, 0.2)));
    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background-image: -moz-linear-gradient(left, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background-image: -ms-linear-gradient(left, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background-image: linear-gradient(left, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
}

#flipbook :deep(.odd .gradient) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: -webkit-gradient(linear, right top, left top, color-stop(0.95, rgba(0, 0, 0, 0)), color-stop(1, rgba(0, 0, 0, 0.15)));
    background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
    background-image: -moz-linear-gradient(right, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
    background-image: -ms-linear-gradient(right, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
    background-image: -o-linear-gradient(right, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
    background-image: linear-gradient(right, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
}

.active {
    width: calc(100dvw - 40px);
    height: calc(100dvh - 40px);
    border: 2px dashed rgb(96, 96, 96);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
        border-color: rgb(105, 176, 74);
    }
}
</style>