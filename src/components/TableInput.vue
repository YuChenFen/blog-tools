<template>
    <el-table :data="tableData" border style="width: 100%;height: max-content;">
        <el-table-column v-for="item in header" :key="item.key">
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
import { onBeforeUnmount, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
    header: {
        type: Array,
        default: () => []
    }
})
const tableData = defineModel('data')
const emptyData = {}
props.header.forEach(item => {
    emptyData[item.key] = ''
})
tableData.value.push({ ...emptyData })
watch(() => tableData.value, (newValue, oldValue) => {
    const lastItem = newValue[newValue.length - 1]
    if (lastItem) {
        let flag = false
        for (let i = 0; i < props.header.length; i++) {
            if (lastItem[props.header[i].key] != '') {
                flag = true
            }
        }
        if (!flag) {
            return
        }
    }
    tableData.value.push({ ...emptyData })
}, { deep: true })

function deleteItem(row) {
    const index = tableData.value.indexOf(row)
    tableData.value.splice(index, 1)
}

onBeforeUnmount(() => {
    tableData.value = tableData.value.filter(item => item.key !== '')
})

</script>

<style scoped>
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

:deep(.el-table__body-wrapper) {
    padding-bottom: 1px;
}
</style>