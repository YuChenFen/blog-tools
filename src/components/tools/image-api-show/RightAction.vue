<template>
    <div class="right-action">
        <el-button color="#626aef" size="small" plain round @click="dialogFormVisible = true">环境变量</el-button>
        <el-dialog v-model="dialogFormVisible" width="60%" :show-close="false">
            <div style="display: flex;height: 60vh;">
                <div class="right">
                    <div class="item active">
                        <div class="icon" style="background-color:rgba(175, 113, 255, 0.1)">
                            <svg t="1746794622373" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3833" width="1em" height="1em">
                                <path
                                    d="M187.684571 841.142857h38.144v-43.556571H208.091429c-38.802286 0-49.005714-17.042286-49.005715-64.694857 0-44.251429 4.059429-83.748571 4.059429-134.107429 0-51.712-14.262857-76.214857-49.700572-85.065143v-3.437714c35.401143-8.850286 49.737143-32.658286 49.737143-85.065143 0-50.395429-4.096-89.856-4.096-134.107429 0-47.652571 10.203429-65.353143 49.005715-65.353142h17.700571V182.857143H187.684571c-63.268571 0-91.904 23.808-91.904 104.155428 0 55.149714 6.838857 91.904 6.838858 142.957715 0 27.904-14.299429 57.197714-66.048 57.856v47.652571c51.748571 0.694857 66.048 29.988571 66.048 59.245714 0 50.358857-6.838857 87.113143-6.838858 142.262858 0 80.347429 28.598857 104.155429 91.904 104.155428z m173.202286-116.406857h77.604572v-265.508571c33.353143-33.353143 57.197714-51.053714 91.904-51.053715 44.251429 0 63.305143 25.892571 63.305142 90.550857v226.011429h78.299429v-235.52c0-95.341714-35.401143-148.406857-115.053714-148.406857-51.053714 0-89.161143 27.904-123.904 61.257143h-2.011429l-6.144-51.748572h-64v374.418286zM802.304 841.142857v-43.556571h17.700571c38.802286 0 49.005714-17.042286 49.005715-64.694857 0-44.251429-3.364571-83.748571-3.364572-134.107429 0-51.712 13.604571-76.214857 49.005715-85.065143v-3.437714c-35.401143-8.850286-49.005714-32.658286-49.005715-85.065143 0-50.395429 3.401143-89.856 3.401143-134.107429 0-47.652571-10.24-65.353143-49.005714-65.353142h-17.737143V182.857143h38.144c63.268571 0 92.562286 23.808 92.562286 104.155428 0 55.149714-6.802286 91.904-6.802286 142.957715 0 27.904 14.299429 57.197714 65.353143 57.856v47.652571c-51.053714 0.694857-65.353143 29.988571-65.353143 59.245714 0 50.358857 6.802286 87.113143 6.802286 142.262858 0 80.347429-29.257143 104.155429-92.562286 104.155428h-38.144z"
                                    fill="#b071ff" p-id="3834"></path>
                            </svg>
                        </div>
                        <div>全局变量</div>
                    </div>
                </div>
                <div class="left">
                    <h3>全局变量</h3>
                    <span class="tip" v-text="'加入 {{变量名}} 即可调用，内置 {{time}} 为当前时间戳加上随机数'"></span>
                    <el-table :data="globalVariables" border style="width: 100%">
                        <el-table-column v-for="item in inputData" :key="item.key">
                            <template #header>
                                <el-text style="font-weight: 500;" type="info">{{ item.title }}</el-text>
                            </template>
                            <template #default="scope">
                                <div style="height: 20px;"></div>
                                <div class="table-item">
                                    <input class="table-input" type="text" v-model="scope.row[item.key]">
                                    <Delete v-if="item.key === 'docs'" class="delete-icon"
                                        @click="deleteItem(scope.row)" />
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { useImageApiShowStore } from './store';
import { storeToRefs } from 'pinia'

const { globalVariables } = storeToRefs(useImageApiShowStore())

const dialogFormVisible = ref(false)
const inputData = [
    {
        title: '变量名',
        key: 'key'
    },
    {
        title: '值',
        key: 'value'
    },
    {
        title: '描述',
        key: 'docs'
    }
]

watch(() => globalVariables.value, (newValue, oldValue) => {
    const lastItem = newValue[newValue.length - 1]
    if (lastItem && lastItem.key === '' && lastItem.value === '' && lastItem.docs === '') {
        return  // 如果是新添加的空元素，不处理
    }
    globalVariables.value.push({
        key: '',
        value: '',
        docs: ''
    })
}, { deep: true })
function deleteItem(row) {
    const index = globalVariables.value.indexOf(row)
    globalVariables.value.splice(index, 1)
}
</script>

<style scoped>
.right-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    width: 100%;
    height: 100%;
}

.right-action :deep(.el-dialog) {
    padding: 0;
}

.right-action :deep(.el-dialog__header) {
    padding: 0;
}

.right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 16px;
    border-radius: 4px 0px 0px 4px;
    background-color: #F6F8FA;

    & .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-radius: 5px;
        padding: 5px 10px;
        margin-bottom: 10px;
        min-width: 180px;
        gap: 10px;
        cursor: pointer;
        user-select: none;

        &:hover {
            color: #fa8c16;
            background-color: rgba(250, 140, 22, 0.05);
        }

        &.active {
            color: #fa8c16;
            background-color: rgba(250, 140, 22, 0.05);
        }
    }

    & .icon {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        display: flex;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        padding: 1px;
    }
}

.left {
    padding: 20px 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    overflow-y: auto;

    & .tip {
        padding: 8px 16px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-size: 12px;
        font-weight: 400;
        color: rgba(51, 54, 57, 0.9);
        background-color: #F6F8FA;
    }
}

.table-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 5px 10px;
    border: none;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0);
    background-color: #0000;

    &:hover {
        border: 1px solid #fa8c16;
    }
}

.table-item {
    position: absolute;
    top: 0;
    left: 1px;
    width: calc(100% - 2px);
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &:hover .table-input{
        background-color: #fff;
    }
}

.delete-icon {
    width: 1em;
    height: 1em;
    margin: 0 8px;
    cursor: pointer;
    display: none;

    &:hover {
        color: #fa8c16;
    }
}

:deep(.el-table__row):hover .delete-icon {
    display: block;
}
</style>