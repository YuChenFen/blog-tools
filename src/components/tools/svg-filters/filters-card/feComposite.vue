<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feComposite</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="operator">
                <el-select v-model="attrs.operator.value" style="width: 110px">
                    <el-option v-for="item in ['over', 'in', 'out', 'atop', 'xor', 'lighter', 'arithmetic']" :key="item"
                        :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="attrs.operator.value === 'arithmetic'" label="k1">
                <el-input-number :step="0.1" style="width: 120px;" v-model="attrs.k1.value" />
            </el-form-item>
            <el-form-item v-if="attrs.operator.value === 'arithmetic'" label="k2">
                <el-input-number :step="0.1" style="width: 120px;" v-model="attrs.k2.value" />
            </el-form-item>
            <el-form-item v-if="attrs.operator.value === 'arithmetic'" label="k3">
                <el-input-number :step="0.1" style="width: 120px;" v-model="attrs.k3.value" />
            </el-form-item>
            <el-form-item v-if="attrs.operator.value === 'arithmetic'" label="k4">
                <el-input-number :step="0.1" style="width: 120px;" v-model="attrs.k4.value" />
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
            <el-form-item label="in2">
                <el-input v-model="attrs.in2.value" />
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