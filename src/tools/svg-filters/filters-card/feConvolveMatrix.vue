<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feConvolveMatrix</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="orderX">
                <el-input-number style="width: 120px;" v-model="attrs.orderX.value" />
            </el-form-item>
            <el-form-item label="orderY">
                <el-input-number style="width: 120px;" v-model="attrs.orderY.value" />
            </el-form-item>
            <el-form-item label="kernelMatrix">
                <el-input type="textarea" :rows="3" style="width: 100px;" v-model="attrs.kernelMatrix.value" />
            </el-form-item>
            <el-form-item label="divisor">
                <el-input-number style="width: 120px;" v-model="attrs.divisor.value" />
            </el-form-item>
            <el-form-item label="bias">
                <el-input-number style="width: 120px;" v-model="attrs.bias.value" />
            </el-form-item>
            <el-form-item label="targetX">
                <el-input-number style="width: 120px;" v-model="attrs.targetX.value" />
            </el-form-item>
            <el-form-item label="targetY">
                <el-input-number style="width: 120px;" v-model="attrs.targetY.value" />
            </el-form-item>
            <el-form-item label="edgeMode">
                <el-select v-model="attrs.edgeMode.value" style="width: 105px;">
                    <el-option label="duplicate" value="duplicate"></el-option>
                    <el-option label="wrap" value="wrap"></el-option>
                    <el-option label="none" value="none"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="preserveAlpha">
                <el-select v-model="attrs.preserveAlpha.value" style="width: 80px;">
                    <el-option label="true" value="true"></el-option>
                    <el-option label="false" value="false"></el-option>
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

</script>

<style scoped>
.card {
    :deep(.el-form-item) {
        margin-right: 10px;
        margin-bottom: 5px;
    }
}
</style>