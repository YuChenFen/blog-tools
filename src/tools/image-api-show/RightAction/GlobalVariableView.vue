<template>
    <h3>全局变量</h3>
    <span class="tip" v-text="'加入 {{变量名}} 即可调用，内置 {{$time}} 为当前时间戳加上随机数'"></span>
    <el-table :data="globalVariables" border style="width: 100%">
        <el-table-column v-for="item in inputData" :key="item.key">
            <template #header>
                <el-text style="font-weight: 500;" type="info">{{ item.title }}</el-text>
            </template>
            <template #default="scope">
                <div style="height: 20px;"></div>
                <div class="table-item">
                    <input class="table-input" type="text" v-model="scope.row[item.key]">
                    <Delete v-if="item.key === 'docs'" class="delete-icon" @click="deleteItem(scope.row)" />
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { useImageApiShowStore } from '../store';
import { storeToRefs } from 'pinia'

const { globalVariables } = storeToRefs(useImageApiShowStore())

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
globalVariables.value.push({
    key: '',
    value: '',
    docs: ''
})
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

onBeforeUnmount(() => {
    globalVariables.value = globalVariables.value.filter(item => item.key !== '')
})
</script>

<style scoped>
h3 {
    margin-bottom: 0.5rem;
}

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

    &:hover .table-input {
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