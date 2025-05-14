<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feMerge</el-text>
        </div>
        <el-form label-position="left" :inline="true">
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
            <div style="margin-bottom: 20px">
                <el-button type="primary" :icon="Plus" circle
                    @click="() => { attrs.in.value.push(ref('SourceGraphic')) }" />
            </div>
            <div v-for="(item, index) in attrs.in.value" :key="index"
                style="margin-bottom: 10px;border: 1px solid #ccc;width: 100%;padding: 10px;border-radius: 5px;">
                <div
                    style="font-weight: 800;margin-bottom: 20px;display: flex;justify-content: space-between;align-items: center;">
                    <p> feMergeNode</p>
                    <el-button type="danger" :icon="Minus" circle @click="() => { attrs.in.value.splice(index, 1) }" />
                </div>
                <div>
                    <el-form-item label="in">
                        <el-input type="text" v-model="item.value" />
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { ref, useAttrs } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
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