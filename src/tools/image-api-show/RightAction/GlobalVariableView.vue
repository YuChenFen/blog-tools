<template>
    <h3>全局变量</h3>
    <span class="tip" v-text="'加入 {{变量名}} 即可调用，内置 {{$time}} 为当前时间戳加上随机数'"></span>
    <TableInput v-model:data="globalVariables" :header="inputData"></TableInput>
</template>

<script setup>
import TableInput from '../../../components/TableInput.vue';
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