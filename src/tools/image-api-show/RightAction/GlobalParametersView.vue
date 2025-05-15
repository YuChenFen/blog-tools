<template>
    <h3>全局参数</h3>
    <span class="tip" v-text="'设置全局请求参数，支持使用全局变量，目前只支持GET请求，发送请求时当前项目下接口自动携带参数。'"></span>
    <TableInput v-model:data="globalParameters" :header="inputData"></TableInput>
</template>

<script setup>
import TableInput from '../../../components/TableInput.vue';
import { useImageApiShowStore } from '../store';
import { storeToRefs } from 'pinia'

const { globalParameters } = storeToRefs(useImageApiShowStore())

const inputData = [
    {
        title: '参数名',
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

</style>