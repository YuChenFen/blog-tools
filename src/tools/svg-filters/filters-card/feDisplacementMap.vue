<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feDisplacementMap</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="in">
                <el-input v-model="attrs.in.value" />
            </el-form-item>
            <el-form-item label="in2">
                <el-input v-model="attrs.in2.value" />
            </el-form-item>
            <el-form-item label="scale">
                <el-input-number style="width: 120px;" v-model="attrs.scale.value" />
            </el-form-item>
            <el-form-item label="xChannelSelector">
                <el-select v-model="attrs.xChannelSelector.value" style="width: 60px;">
                    <el-option value="R">R</el-option>
                    <el-option value="G">G</el-option>
                    <el-option value="B">B</el-option>
                    <el-option value="A">A</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="yChannelSelector">
                <el-select v-model="attrs.yChannelSelector.value" style="width: 60px;">
                    <el-option value="R">R</el-option>
                    <el-option value="G">G</el-option>
                    <el-option value="B">B</el-option>
                    <el-option value="A">A</el-option>
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

</script>

<style scoped>
.card {
    :deep(.el-form-item) {
        margin-right: 10px;
        margin-bottom: 5px;
    }
}
</style>