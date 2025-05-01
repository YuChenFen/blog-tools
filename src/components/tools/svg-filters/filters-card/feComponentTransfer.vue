<template>
    <div class="card">
        <div style="margin-bottom: 10px;">
            <el-text tag="b" style="font-size: 1rem;">feComponentTransfer</el-text>
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
            <el-form-item label="in">
                <el-input v-model="attrs.in.value" />
            </el-form-item>
            <el-form-item label="result">
                <el-input v-model="attrs.result.value" />
            </el-form-item>
            <el-collapse>
                <el-collapse-item title="feFuncR">
                    <el-form-item label="type">
                        <el-select v-model="attrs.feFuncRType.value" style="width: 100px;">
                            <el-option value="identity">identity</el-option>
                            <el-option value="table">table</el-option>
                            <el-option value="discrete">discrete</el-option>
                            <el-option value="linear">linear</el-option>
                            <el-option value="gamma">gamma</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'table'" label="tableValues">
                        <el-input v-model="attrs.feFuncRTableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'discrete'" label="tableValues">
                        <el-input v-model="attrs.feFuncRTableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'linear'" label="slope">
                        <el-input-number v-model="attrs.feFuncRSlope.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'linear'" label="intercept">
                        <el-input-number v-model="attrs.feFuncRIntercept.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'gamma'" label="amplitude">
                        <el-input-number v-model="attrs.feFuncRAmplitude.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'gamma'" label="exponent">
                        <el-input-number v-model="attrs.feFuncRExponent.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncRType.value === 'gamma'" label="offset">
                        <el-input-number v-model="attrs.feFuncROffset.value" style="width: 120px;" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <el-collapse>
                <el-collapse-item title="feFuncG">
                    <el-form-item label="type">
                        <el-select v-model="attrs.feFuncGType.value" style="width: 100px;">
                            <el-option value="identity">identity</el-option>
                            <el-option value="table">table</el-option>
                            <el-option value="discrete">discrete</el-option>
                            <el-option value="linear">linear</el-option>
                            <el-option value="gamma">gamma</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'table'" label="tableValues">
                        <el-input v-model="attrs.feFuncGTableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'discrete'" label="tableValues">
                        <el-input v-model="attrs.feFuncGTableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'linear'" label="slope">
                        <el-input-number v-model="attrs.feFuncGSlope.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'linear'" label="intercept">
                        <el-input-number v-model="attrs.feFuncGIntercept.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'gamma'" label="amplitude">
                        <el-input-number v-model="attrs.feFuncGAmplitude.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'gamma'" label="exponent">
                        <el-input-number v-model="attrs.feFuncGExponent.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncGType.value === 'gamma'" label="offset">
                        <el-input-number v-model="attrs.feFuncGOffset.value" style="width: 120px;" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <el-collapse> 
                <el-collapse-item title="feFuncB">
                    <el-form-item label="type">
                        <el-select v-model="attrs.feFuncBType.value" style="width: 100px;">
                            <el-option value="identity">identity</el-option>
                            <el-option value="table">table</el-option>
                            <el-option value="discrete">discrete</el-option>
                            <el-option value="linear">linear</el-option>
                            <el-option value="gamma">gamma</el-option>
                        </el-select>
                    </el-form-item> 
                    <el-form-item v-if="attrs.feFuncBType.value === 'table'" label="tableValues">
                        <el-input v-model="attrs.feFuncBTableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncBType.value === 'discrete'" label="tableValues">
                        <el-input v-model="attrs.feFuncBTableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncBType.value === 'linear'" label="slope">
                        <el-input-number v-model="attrs.feFuncBSlope.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncBType.value === 'linear'" label="intercept">
                        <el-input-number v-model="attrs.feFuncBIntercept.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncBType.value === 'gamma'" label="amplitude">
                        <el-input-number v-model="attrs.feFuncBAmplitude.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncBType.value === 'gamma'" label="exponent">
                        <el-input-number v-model="attrs.feFuncBExponent.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncBType.value === 'gamma'" label="offset">
                        <el-input-number v-model="attrs.feFuncBOffset.value" style="width: 120px;" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <el-collapse>
                <el-collapse-item title="feFuncA">
                    <el-form-item label="type">
                        <el-select v-model="attrs.feFuncAType.value" style="width: 100px;">
                            <el-option value="identity">identity</el-option>
                            <el-option value="table">table</el-option>
                            <el-option value="discrete">discrete</el-option>
                            <el-option value="linear">linear</el-option>
                            <el-option value="gamma">gamma</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'table'" label="tableValues">
                        <el-input v-model="attrs.feFuncATableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'discrete'" label="tableValues">
                        <el-input v-model="attrs.feFuncATableValues.value" style="width: 80px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'linear'" label="slope">
                        <el-input-number v-model="attrs.feFuncASlope.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'linear'" label="intercept">
                        <el-input-number v-model="attrs.feFuncAIntercept.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'gamma'" label="amplitude">
                        <el-input-number v-model="attrs.feFuncAAmplitude.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'gamma'" label="exponent">
                        <el-input-number v-model="attrs.feFuncAExponent.value" style="width: 120px;" />
                    </el-form-item>
                    <el-form-item v-if="attrs.feFuncAType.value === 'gamma'" label="offset">
                        <el-input-number v-model="attrs.feFuncAOffset.value" style="width: 120px;" />
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
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