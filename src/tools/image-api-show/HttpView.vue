<template>
    <div style="height: 100%;" class="user-select-none">
        <div style="padding: 10px 10px 0px 10px;display: flex;">
            <input v-model="data.label" class="borter-bi" type="text" placeholder="输入API名称">
        </div>
        <div class="request-container user-select-none">
            <div class="request-header">
                <el-select v-model="requestType" placeholder="请求类型" style="width: 110px">
                    <template #label>
                        <span :class="requestType" style="float: left;">{{ requestType }}</span>
                    </template>
                    <el-option v-for="item in requestTypeArray" :key="item" :label="item" :value="item">
                        <span style="float: left">{{ item }}</span>
                    </el-option>
                </el-select>
                <el-input v-model="data.url" style="width: 100%" placeholder="请输入URL" @blur="changeUrl" />
            </div>
            <el-button color="#fa8c16" style="color: #fff; width: 80px;height: 35px;"
                @click="sendRequest">发送</el-button>
        </div>
        <div style="display: flex;flex-direction: column;height: calc(100% - 95.8px)">
            <div style="overflow: auto;flex: 1;">
                <el-tabs v-model="parameterTab" style="padding: 0 15px;">
                    <el-tab-pane label="Query" name="Query" style="overflow: auto;">
                        <TableInput v-model:data="parameter" :header="parameterHeader"></TableInput>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div style="position: relative;height: 30vh;"
                v-resize-bar="{ position: 'top', size: '3px', backgroundColor: '#fa8c16' }">
                <div style="width: 100%;height: 3px;background-color: #dddddddd;"></div>
                <el-tabs v-model="responseTab" style="padding: 0 15px;height: 100%;">
                    <el-tab-pane label="实时响应" name="实时响应" style="overflow: auto;height: 100%;padding-bottom: 10px;">
                        <div style="height: 100%;display: flex;flex-direction: column;">
                            <div style="margin-bottom: 5px;display: flex;gap: 10px;">
                                <el-select v-model="responseLanguage" placeholder="格式类型" style="width: 100px">
                                    <el-option v-for="item in ['HTML', 'JSON']" :key="item" :label="item" :value="item">
                                        <span style="float: left">{{ item }}</span>
                                    </el-option>
                                </el-select>
                                <input v-model="data.data" class="borter-bi" type="text"
                                    placeholder="图片地址（值 / 数组）字段名，（忽略数组）如:data、data.url等，若API为图片地址则留空">
                            </div>
                            <div style="flex: 1;">
                                <CodeMirrorEdit v-model="responseText" :disabled="true" :language="responseLanguage">
                                </CodeMirrorEdit>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="预览" name="预览" style="height: 100%;padding: 5px 10px 10px 10px;">
                        <el-image :src="imageUrl" style="width: 100%;height: 100%;" fit="contain"></el-image>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import TableInput from '../../components/TableInput.vue'
import CodeMirrorEdit from '../../components/CodeMirrorEdit.vue'
import { ref, useAttrs, watch } from 'vue'
import { getUrlParams, getUrlWithParams } from './utils'
import { useImageApiShowStore } from './store'
import { html, js } from "js-beautify";

const attrs = useAttrs()
const { getImageUrl } = useImageApiShowStore()

const data = ref(attrs.params.params.data)
const requestTypeArray = ['GET'] // ['GET', 'POST']
const requestType = ref(requestTypeArray[0])
const parameterTab = ref('Query')
const parameter = ref([])
const parameterHeader = [
    { title: '参数名', key: 'name' },
    { title: '参数值', key: 'value' },
    // { title: '参数描述', key: 'description' }
]
const responseTab = ref('实时响应')
const responseLanguage = ref('JSON')
const responseText = ref('')
function changeUrl() {
    let params = getUrlParams(data.value.url)
    parameter.value = []
    for (let key in params) {
        parameter.value.push({
            name: key,
            value: params[key]
        })
    }
}
const imageUrl = ref('')
changeUrl()
watch(() => parameter.value, () => {
    let params = {}
    for (let i = 0; i < parameter.value.length; i++) {
        if (parameter.value[i].name == '' || parameter.value[i].value == '') {
            continue
        }
        params[parameter.value[i].name] = parameter.value[i].value
    }
    data.value.url = getUrlWithParams(data.value.url.split('?')[0], params)
}, {
    deep: true
})

async function sendRequest() {
    imageUrl.value = await getImageUrl({
        url: data.value.url,
        data: data.value.data
    }, (res) => {
        if (responseLanguage.value === 'JSON') {
            responseText.value = js(res, {
                "wrap_line_length": "10"
            })
        } else {
            responseText.value = html(res)
        }
    })
    if (imageUrl.value) {
        ElMessage({
            message: '已发送',
            type: 'success',
            duration: 1000
        })
    }
}

</script>

<style scoped>
.borter-bi {
    width: 100%;
    font-size: 16px;
    color: #333;
    line-height: 1.5;
    border: none;
    border-bottom: 1px solid #dddddd;
    outline: none;
}

.request-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px;
    gap: 5px;
}

.request-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px;
    border-radius: 5px;
    background-color: #f2f4f7;
    gap: 5px;
}

.GET {
    color: #26cea4;
}

.POST {
    color: #E6A23C;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focused) {
    box-shadow: 0 0 0 1px #fa8c16 inset;
}

:deep(.el-tabs__item.is-active, .el-tabs__item:hover) {
    color: #fa8c16;
}

:deep(.el-tabs__active-bar) {
    height: 3px;
    border-radius: 2px;
    background-color: #fa8c16;
}
</style>