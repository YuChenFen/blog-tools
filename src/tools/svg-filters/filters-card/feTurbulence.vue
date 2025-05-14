<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feTurbulence</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="type">
                <el-select v-model="attrs.type.value" style="width: 120px;">
                    <el-option value="turbulence">turbulence</el-option>
                    <el-option value="fractalNoise">fractalNoise</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="baseFrequencyX">
                <el-input-number v-model="attrs.baseFrequencyX.value" style="width: 120px;" :step="0.01" />
            </el-form-item>
            <el-form-item label="baseFrequencyY">
                <el-input-number v-model="attrs.baseFrequencyY.value" style="width: 120px;" :step="0.01" />
            </el-form-item>
            <el-form-item label="numOctaves">
                <el-input-number v-model="attrs.numOctaves.value" style="width: 120px;" :step="1" />
            </el-form-item>
            <el-form-item label="seed">
                <el-input-number v-model="attrs.seed.value" style="width: 120px;" :step="1" />
            </el-form-item>
            <el-form-item label="stitchTiles">
                <el-select v-model="attrs.stitchTiles.value" style="width: 100px;">
                    <el-option value="stitch">stitch</el-option>
                    <el-option value="noStitch">noStitch</el-option>
                </el-select>
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