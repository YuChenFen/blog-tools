<script setup>
import card from '../components/card.vue';
import { ref, computed } from 'vue';

const data = [
    {
        label: '图片和BASE64转换',
        description: '图片和Base64编码互相转换工具',
        path: '/tool/image-to-base64'
    },
    {
        label: 'svg滤镜',
        description: 'SVG滤镜设计',
        path: '/tool/svg-filters'
    },
    {
        label: '二维码生成',
        description: '二维码生成工具',
        path: '/tool/qr-code'
    },
    {
        label: '颜色对比度',
        description: '颜色对比度计算',
        path: '/tool/color-contrast'
    },
    {
        label: '图片API浏览',
        description: '根据图片API地址浏览图片',
        path: '/tool/image-api-show'
    },
    {
        label: 'GitHub Release 下载分析',
        description: 'GitHub Release 下载分析工具',
        path: '/tool/github-release-statistics'
    }
]
const search = ref('')
const showData = computed(() => {
    return data.filter(item => {
        return item.label.toLowerCase().includes(search.value.toLowerCase()) || item.description.toLowerCase().includes(search.value.toLowerCase())
    })
})
</script>

<template>
    <div style="min-height: 100vh;position: relative;">
        <header>
            <div class="container">
                <h1>工具集合</h1>
                <!-- <p class="subtitle">雨辰枫司的小栈 | 工具集合</p> -->

                <div class="search-bar">
                    <input type="text" placeholder="搜索工具..." v-model="search" />
                </div>
            </div>
        </header>

        <div class="container">
            <div class="tools-container">
                <card v-for="item in showData" :key="item.path" :title="item.label" :description="item.description"
                    :path="item.path"></card>
            </div>
        </div>

        <footer>
            <div class="container">
                <p>© 2025 雨辰枫司的小栈 | 工具集合</p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
header {
    background-color: white;
    padding: 1.5rem 0;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 10;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #1e293b;
}

/* .subtitle {
    color: #64748b;
    font-size: 0.95rem;
} */

.search-bar {
    max-width: 500px;
    margin: 20px auto;
}

.search-bar input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: #f8fafc;
    transition: all 0.2s ease;
}

.search-bar input:focus {
    outline: none;
    border-color: #94a3b8;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.tools-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin: 30px 0;
}

footer {
    text-align: center;
    padding: 20px;
    background-color: white;
    margin-top: 50px;
    border-top: 1px solid #f1f5f9;
    color: #64748b;
    font-size: 0.85rem;
    position: absolute;
    bottom: 0px;
    width: 100%;
}

@media (max-width: 768px) {
    .tools-container {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
    }
}
</style>