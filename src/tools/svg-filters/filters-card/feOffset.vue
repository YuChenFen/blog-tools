<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feOffset</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="dx">
                <el-input-number style="width: 120px;" v-model="attrs.dx.value" />
            </el-form-item>
            <el-form-item label="dy">
                <el-input-number style="width: 120px;" v-model="attrs.dy.value" />
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