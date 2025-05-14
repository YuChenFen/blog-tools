<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feSpecularLighting</el-text>
        </div>
        <el-form label-position="left" :inline="true">
            <el-form-item label="surfaceScale">
                <el-input-number style="width: 120px;" v-model="attrs.surfaceScale.value" />
            </el-form-item>
            <el-form-item label="specularConstant">
                <el-input-number style="width: 120px;" :step="0.01" v-model="attrs.specularConstant.value" />
            </el-form-item>
            <el-form-item label="specularExponent">
                <el-input-number style="width: 120px;" v-model="attrs.specularExponent.value" />
            </el-form-item>
            <el-form-item label="lighting-color">
                <el-color-picker show-alpha v-model="attrs.lightingColor.value"
                    @active-change="(v) => attrs.lightingColor.value = v" />
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
            <div style="border: 1px solid #ccc;padding: 10px;margin: 5px;border-radius: 5px;">
                <el-radio-group v-model="attrs.type.value">
                    <el-radio value="feDistantLight">feDistantLight</el-radio>
                </el-radio-group>
                <div>
                    <el-form-item label="azimuth">
                        <el-input-number style="width: 120px;" v-model="attrs.azimuth.value" />
                    </el-form-item>
                    <el-form-item label="elevation">
                        <el-input-number style="width: 120px;" v-model="attrs.elevation.value" />
                    </el-form-item>
                </div>
            </div>
            <div style="border: 1px solid #ccc;padding: 10px;margin: 5px;border-radius: 5px;">
                <el-radio-group v-model="attrs.type.value">
                    <el-radio value="fePointLight">fePointLight</el-radio>
                </el-radio-group>
                <div>
                    <el-form-item label="x">
                        <el-input-number style="width: 120px;" v-model="attrs.lightX.value" />
                    </el-form-item>
                    <el-form-item label="y">
                        <el-input-number style="width: 120px;" v-model="attrs.lightY.value" />
                    </el-form-item>
                    <el-form-item label="z">
                        <el-input-number style="width: 120px;" v-model="attrs.lightZ.value" />
                    </el-form-item>
                </div>
            </div>
            <div style="border: 1px solid #ccc;padding: 10px;margin: 5px;border-radius: 5px;">
                <el-radio-group v-model="attrs.type.value">
                    <el-radio value="feSpotLight">feSpotLight</el-radio>
                </el-radio-group>
                <div>
                    <el-form-item label="x">
                        <el-input-number style="width: 120px;" v-model="attrs.lightX.value" />
                    </el-form-item>
                    <el-form-item label="y">
                        <el-input-number style="width: 120px;" v-model="attrs.lightY.value" />
                    </el-form-item>
                    <el-form-item label="z">
                        <el-input-number style="width: 120px;" v-model="attrs.lightZ.value" />
                    </el-form-item>
                    <el-form-item label="pointsAtX">
                        <el-input-number style="width: 120px;" v-model="attrs.pointsAtX.value" />
                    </el-form-item>
                    <el-form-item label="pointsAtY">
                        <el-input-number style="width: 120px;" v-model="attrs.pointsAtY.value" />
                    </el-form-item>
                    <el-form-item label="pointsAtZ">
                        <el-input-number style="width: 120px;" v-model="attrs.pointsAtZ.value" />
                    </el-form-item>
                    <el-form-item label="specularExponent">
                        <el-input-number style="width: 120px;" v-model="attrs.specularExponent.value" />
                    </el-form-item>
                    <el-form-item label="limitingConeAngle">
                        <el-input-number style="width: 120px;" v-model="attrs.limitingConeAngle.value" />
                    </el-form-item>
                </div>
            </div>
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