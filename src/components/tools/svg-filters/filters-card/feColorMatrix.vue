<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feColorMatrix</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="type">
                <el-select v-model="attrs.type.value" placeholder="请选择" style="width: 160px;" @change="change">
                    <el-option v-for="item in ['saturate', 'hueRotate', 'matrix', 'luminanceToAlpha']" :value="item"
                        :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="values">
                <el-input v-if="attrs.type.value === 'matrix'" type="textarea" :rows="4" style="width: 100px;"
                    v-model="attrs.values.value" class="input-width-100" />
                <el-input-number style="width: 120px;"
                    v-if="attrs.type.value === 'saturate' || attrs.type.value === 'hueRotate'"
                    v-model="attrs.values.value"></el-input-number>
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
            <el-form-item label="in">
                <el-input v-model="attrs.in.value" />
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

function change() {
    if (attrs.type.value === 'luminanceToAlpha') {
        attrs.values.value = '';
    } else if (attrs.type.value === 'matrix') {
        attrs.values.value = '1 0 0 0 0 \n0 1 0 0 0 \n0 0 1 0 0 \n0 0 0 1 0';
    } else if (attrs.type.value === 'hueRotate') {
        attrs.values.value = '180';
    } else if (attrs.type.value === 'saturate') {
        attrs.values.value = '5';
    }
}
</script>

<style scoped>
.card {
    :deep(.el-form-item) {
        margin-right: 10px;
        margin-bottom: 5px;
    }
}
</style>