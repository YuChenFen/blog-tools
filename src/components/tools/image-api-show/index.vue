<template>
    <div class="container">
        <div class="left">
            <el-form label-position="top">
                <el-form-item label="列数">
                    <el-slider v-model="cols" :min="1" :max="7" />
                </el-form-item>
                <el-form-item label="并发请求数量">
                    <el-slider v-model="concurrency" :min="1" :max="10" />
                </el-form-item>
                <div style="margin-bottom: 20px">
                    <el-button plain :icon="Plus" @click="addLink()">添加地址</el-button>
                    <el-button type="primary" @click="load">加载图片</el-button>
                </div>
                <div v-for="(link, index) in links" :key="index" class="link-item">
                    <div
                        style="font-weight: 500;margin-bottom: 10px;display: flex;justify-content: space-between;align-items: center;">
                        <p>链接地址</p>
                        <el-button type="danger" :icon="Minus" circle @click="() => { links.splice(index, 1) }" />
                    </div>
                    <el-form-item label="API地址">
                        <el-input v-model="link.url" placeholder="请输入API地址" />
                    </el-form-item>
                    <el-form-item label="图片地址（值 / 数组）字段名">
                        <el-input v-model="link.data" placeholder="如:data、url等" />
                    </el-form-item>
                </div>
            </el-form>

        </div>
        <div class="right">
            <wc-waterfall :gap="10" :cols="cols">
                <el-image v-for="(url, index) in urls" :preview-src-list="urls" :initial-index="index"
                    :hide-on-click-modal="true" :key="index" :src="url" lazy style="border-radius: 5px;" />
            </wc-waterfall>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import 'wc-waterfall'
import { Plus, Minus } from '@element-plus/icons-vue'

const cols = ref(4)
const concurrency = ref(1)
const urls = ref([])
const links = ref([])
let loadTimeout = null;

const load = () => {
    if (loadTimeout) {
        clearTimeout(loadTimeout);
    }
    loadTimeout = setTimeout(() => {
        console.log('load');
        getImage()
    }, 1000);
}

function addLink() {
    links.value.push({
        url: "",
        data: ""
    })
}

async function pushUrl(data) {
    if (data instanceof Array) {
        for (let j = 0; j < data.length; j++) {
            urls.value.push(data[j]);
        }
    } else {
        urls.value.push(data);
    }
}

async function fetchImage() {
    for (let i = 0; i < links.value.length; i++) {
        const url = links.value[i].url;
        if (!url) {
            continue;
        }
        try {
            const response = await fetch(url, { method: 'GET', redirect: 'follow' });
            // 如果是重定向，直接将重定向地址添加到urls中
            // if (response.redirected) {
            //     urls.value.push(response.url);
            //     continue;
            // }
            const jsonData = await response.json();
            if (jsonData instanceof Array) {
                for (let j = 0; j < jsonData.length; j++) {
                    const data = jsonData[j][links.value[i].data];
                    pushUrl(data);
                }
            } else {
                const data = jsonData[links.value[i].data];
                pushUrl(data);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// 异步获取图片
async function getImage() {
    const workers = Array.from({ length: concurrency.value }, () => fetchImage());
    await Promise.all(workers);

}
</script>

<style scoped>
.container {
    display: flex;
    height: 100vh;
}

.left {
    flex: 0 0 300px;
    padding: 10px 20px;
    border-right: 1px solid #bebebe;
    height: 100%;
    overflow-y: auto;
}

.right {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
}

.link-item {
    margin-bottom: 10px;
    border: 1px solid #ccc;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
}

wc-waterfall :deep(.el-image) {
    position: absolute;
}

@media screen and (max-width: 768px) {
    .container {
        flex-direction: column;
    }

    .left {
        flex: 0 0 300px;
        padding: 10px 20px;
        border-right: 0px solid #bebebe;
        border-bottom: 1px solid #bebebe;
        overflow-y: auto;
    }
}
</style>