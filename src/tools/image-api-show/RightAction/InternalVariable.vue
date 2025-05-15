<template>
    <h3>内置变量</h3>
    <span class="tip" v-text="'系统内置的变量，可直接使用{{变量名}}作为变量'"></span>
    <el-table :data="tableData" border style="width: 100%;height: max-content;">
        <el-table-column v-for="(item, index) in header" :key="item.key">
            <template #header>
                <el-text style="font-weight: 500;" type="info">{{ item.title }}</el-text>
            </template>
            <template #default="scope">
                <div style="height: 20px;"></div>
                <div class="table-item">
                    <span class="table-span">{{ scope.row[item.key] }}</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
const tableData = [
    {
        key: '$time',
        docs: '当前时间戳'
    },
    {
        key: '$random(a,b)',
        docs: 'a 到 b 之间的随机数'
    }
]
const header = [
    {
        title: '变量名',
        key: 'key'
    },
    {
        title: '描述',
        key: 'docs'
    }
]
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


.table-span {
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

    &:hover .table-span {
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