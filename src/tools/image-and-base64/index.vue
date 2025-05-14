<template>
    <div style="padding: 20px;text-align: center;">
        <h2>图片和BASE64转换工具</h2>
    </div>
    <div style="padding: 20px;display: flex;flex-direction: column;gap: 25px;height: calc(100% - 92px);">
        <div style="border: 2px dashed #606060;position: relative;flex: 1;">
            <input class="base64-img-input" type="file" @change="handleFileChange">
            <img ref="imgRef" class="base64-img">
            <div v-show="!base64Value"
                style="width: 100%;text-align: center;font-size: 2em;font-weight: 800;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">
                请选择或者拖入图片</div>
        </div>
        <textarea class="base64-textarea" v-model="base64Value" @change="base64Change(base64Value)"
            placeholder="base64字符串"></textarea>
    </div>
</template>

<script setup>
import { ref } from "vue"

const base64Value = ref("");
const imgRef = ref(void 0);

function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        // 转base64
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            base64Value.value = e.target.result;
            imgRef.value.src = base64Value.value;
        }
    }
}

function base64Change(base64) {
    imgRef.value.src = base64;
} 
</script>

<style scoped>
.base64-img-input {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
}

.base64-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.base64-textarea {
    width: 100%;
    flex: 1;
    height: 100%;
    border-radius: 5px;
    font-size: 1.2em;
    padding: 5px 10px;
    resize: none;
    border: 2px solid #999;
    outline: none;

    &:focus {
        border-color: #4C616B;
    }
}
</style>