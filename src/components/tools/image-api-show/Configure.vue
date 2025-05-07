<template>
    <div style="padding: 10px 0;width: 100%;height: 100%;overflow: auto;">
        <el-form label-position="top" style="padding: 0 20px;">
            <el-form-item label="列数">
                <el-slider v-model="cols" :min="1" :max="7" />
            </el-form-item>
            <el-form-item label="并发请求数量">
                <el-slider v-model="concurrency" :min="1" :max="10" />
            </el-form-item>
            <div style="margin-bottom: 20px">
                <el-button type="primary" @click="load">加载图片</el-button>
                <el-button circle :icon="Upload" type="primary" @click="uploadLinks"></el-button>
                <el-button circle :icon="Download" type="primary" @click="downloadLinks"></el-button>
                <el-button circle :icon="Notebook" type="primary" @click="saveLinks"></el-button>
            </div>
            <!-- <div v-for="(link, index) in links" :key="index" class="link-item">
                <div
                    style="font-weight: 500;margin-bottom: 10px;display: flex;justify-content: space-between;align-items: center;">
                    <p>链接地址</p>
                    <el-button type="danger" :icon="Minus" circle @click="() => { links.splice(index, 1) }" />
                </div>
                <el-form-item label="API地址">
                    <el-input v-model="link.url" placeholder="请输入API地址" />
                </el-form-item>
                <el-form-item label="图片地址（值 / 数组）字段名">
                    <el-input v-model="link.data" placeholder="如:data、data.url等" />
                </el-form-item>
            </div> -->
        </el-form>
        <el-tree :data="links" :props="defaultProps" node-key="id" :default-expanded-keys="getExpandedKeys(links)"
            draggable :allow-drop="isFolder" empty-text="暂无数据" @node-click="handleNodeClick"
            @node-expand="(node) => { node.isOpen = true }" @node-collapse="(node) => { node.isOpen = false }">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <div style="display: flex;align-items: center;gap: 5px;">
                        <el-icon v-if="data.hasOwnProperty('children')">
                            <FolderOpened v-if="data.isOpen" />
                            <Folder v-else />
                        </el-icon>
                        <el-icon v-else>
                            <Link />
                        </el-icon>
                        <el-input v-if="node.isEdit" v-model="folderData.label" size="small" placeholder="请输入文件夹名称"
                            v-focus @blur="() => { node.isEdit = false }" @click.stop="" />
                        <span v-else>{{ node.label }}</span>
                    </div>
                    <div>
                        <span v-if="data.hasOwnProperty('children')">
                            <el-button type="primary" link @click.stop="editFolder(node, data)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                            </el-button>
                            <el-button type="primary" style="margin-left: 4px" link @click.stop="addLink(node, data)">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-button>
                            <el-button type="primary" style="margin-left: 4px" link @click.stop="addFolder(node, data)">
                                <el-icon>
                                    <FolderAdd />
                                </el-icon>
                            </el-button>
                        </span>
                        <span v-else>
                            <el-button v-if="data.enable" type="primary" link @click.stop="data.enable = false">
                                <el-icon>
                                    <View />
                                </el-icon>
                            </el-button>
                            <el-button v-else type="warning" link @click.stop="data.enable = true">
                                <el-icon>
                                    <Hide />
                                </el-icon>
                            </el-button>
                        </span>
                        <el-button style="margin-left: 4px" type="danger" link @click.stop="remove(node, data)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
            </template>
        </el-tree>
        <div style="padding: 10px;">
            <el-button plain :icon="Plus" style="width: 100%;" @click="() => {
                links.push({
                    id: generateRandomString(8),
                    label: '新建文件夹',
                    isOpen: false,
                    children: []
                })
            }">新建</el-button>
        </div>
        <el-dialog v-model="dialogFormVisible" title="API地址" width="80%">
            <el-form label-position="top">
                <el-form-item label="名称">
                    <el-input v-model="link.label" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="API地址">
                    <el-input v-model="link.url" placeholder="请输入API地址，可添加{{time}}占位符作为随机字符串" />
                </el-form-item>
                <el-form-item label="图片地址（值 / 数组）字段名">
                    <el-input v-model="link.data" placeholder="如:data、data.url等，若API为图片地址则留空" />
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { Plus, Notebook, Folder, FolderOpened, Link, Delete, FolderAdd, Edit, View, Hide, Download, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { generateRandomString } from './utils'
import { useImageApiShowStore } from './store'
import { storeToRefs } from 'pinia'

const vFocus = {
    mounted: function (el) {
        el.querySelector("input").focus();
    }
}

const imageApiShowStore = useImageApiShowStore()
const { links, cols, concurrency } = storeToRefs(imageApiShowStore)
const { load, saveLinks } = imageApiShowStore
const dialogFormVisible = ref(false)
const link = ref({
    label: "",
    url: "",
    data: ""
})
const folderData = ref({
    label: ""
})

const defaultProps = {
    children: 'children',
    label: 'label',
}

const handleNodeClick = (data) => {
    if (!data.hasOwnProperty('children')) {
        link.value = data
        dialogFormVisible.value = true
    }
}

const getExpandedKeys = (data) => {
    const expandedKeys = []
    data.forEach(item => {
        if (item.hasOwnProperty('children') && item.isOpen) {
            expandedKeys.push(item.id)
            const childrenExpandedKeys = getExpandedKeys(item.children)
            if (childrenExpandedKeys.length > 0) {
                expandedKeys.push(...childrenExpandedKeys)
            }
        }
    })
    return expandedKeys
}

const editFolder = (node, data) => {
    folderData.value = data
    node.isEdit = true
}
const addLink = (node, data) => {
    data.isOpen = true
    const newNode = {
        id: generateRandomString(8),
        label: '新链接',
        enable: true,
        url: '',
        data: ''
    }
    data.children.push(newNode)
    links.value = [...links.value]
    handleNodeClick(newNode)
}

const addFolder = (node, data) => {
    data.isOpen = true
    data.children.push({
        id: generateRandomString(8),
        label: '新建文件夹',
        isOpen: false,
        children: []
    })
    links.value = [...links.value]
}

const remove = (node, data) => {
    data.isOpen = true
    const parent = node.parent
    const children = parent.data.children || parent.data
    const index = children.findIndex((d) => d.id === data.id)
    children.splice(index, 1)
    links.value = [...links.value]
}

const isFolder = (_, node) => {
    return node.data.hasOwnProperty('children')
}

const uploadLinks = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result)
            links.value = data
            saveLinks()
        }
        reader.readAsText(file)
    }
    input.click()
}
const downloadLinks = () => {
    const data = JSON.stringify(links.value)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'links.json'
    link.click()
    URL.revokeObjectURL(url)
}
</script>

<style scoped>
.link-item {
    margin-bottom: 10px;
    border: 1px solid #ccc;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>