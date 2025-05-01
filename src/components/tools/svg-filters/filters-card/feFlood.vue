<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feFlood</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="flood-color">
                <el-color-picker show-alpha v-model="attrs.floodColor.value"
                    @active-change="(v) => attrs.floodColor.value = v" />
            </el-form-item>
            <el-form-item label="flood-opacity">
                <el-input-number :step="0.1" style="width: 120px;" v-model="attrs.floodOpacity.value" />
            </el-form-item>
            <el-form-item label="x">
                <el-input style="width: 120px;" v-model="attrs.x.value" />
            </el-form-item>
            <el-form-item label="y">
                <el-input style="width: 120px;" v-model="attrs.y.value" />
            </el-form-item>
            <el-form-item label="width">
                <el-input style="width: 120px;" v-model="attrs.width.value" />
            </el-form-item>
            <el-form-item label="height">
                <el-input style="width: 120px;" v-model="attrs.height.value" />
            </el-form-item>
            <el-form-item label="result">
                <el-input v-model="attrs.result.value" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs();

const inputName = Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36);
</script>

<style scoped>
.card {
    :deep(.el-form-item) {
        margin-right: 10px;
        margin-bottom: 5px;
    }
}
</style>