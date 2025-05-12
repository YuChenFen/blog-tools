<template>
    <div class="github-release-analyzer">
        <div class="hero-section">
            <div class="hero-content">
                <h1>GitHub Release 分析工具</h1>

                <div class="search-container">
                    <div class="search-box">
                        <svg class="search-icon" viewBox="0 0 24 24">
                            <path
                                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <input v-model="repoUrl" type="text" class="search-input"
                            placeholder="输入GitHub仓库地址，例如：https://github.com/用户名/仓库名" @keyup.enter="analyzeReleases" />
                        <button class="search-btn" :disabled="loading" @click="analyzeReleases">
                            <span v-if="!loading">分析</span>
                            <span v-else class="loading-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </span>
                        </button>
                    </div>
                    <p v-if="error" class="error-message">{{ error }}</p>
                </div>
            </div>
        </div>

        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>正在获取仓库数据...</p>
        </div>

        <div v-if="resultsVisible" class="results-container">
            <div class="chart-container">
                <div ref="chartRef" class="main-chart"></div>
            </div>

            <div class="releases-grid">

                <div class="release-card">
                    <div class="release-header">
                        <h3 class="release-title one-line">所有版本</h3>
                        <div class="release-meta">
                            <span class="release-downloads  one-line">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                </svg>
                                {{releases.reduce((total, release) => total + release.totalDownloads,
                                    0).toLocaleString()}}
                                次下载
                            </span>
                        </div>
                    </div>
                    <div class="assets-list">
                        <div v-for="release in releases" :key="release.id" class="asset-item">
                            <div class="asset-info">
                                <svg class="icon" style="flex-shrink: 0;" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M512.1 958.4c-123.6 0-230.1-43.9-316.7-130.5-87.8-87.8-130.5-191.3-130.5-316.7s42.7-228.9 130.5-316.7c67.5-71.1 156.8-115.2 257.7-126.8 43.8-3.7 63.8-3.8 113-0.1h0.1c6.7 0 64.4 8.4 112.5 26.1 17.8 6.5 27 26.3 20.4 44.1-6.5 17.9-26.3 27-44.1 20.4-40.1-14.7-87.7-21.5-93.5-22-46.3-3.4-62.4-3.3-101.6-0.1-83.5 9.7-158.3 46.5-215.2 106.4-74.9 74.8-110.9 162.5-110.9 268.7 0 106.1 36.1 193.8 110.3 268s161.9 110.3 268 110.3c102.9 0 190.7-36.2 268.6-110.8 73.5-76.8 109.8-164.7 109.8-267.5 0-41.3-7.3-84.4-21.6-128-2.8-5.9-5.2-11.8-7.4-17.4-2.3-5.8-4.5-11.4-6.5-14.3-0.8-1.2-1.5-2.5-2.2-3.8 0 0-17.5-28.5-62.5-29.1h-0.6c-40.5 0-53 19.2-57.7 26.5-0.2 0.4-0.5 0.8-0.9 1.2l-157 331c-15.9 34.4-36.9 52.4-62.5 53.2-25.7 0.1-48.7-16.6-67.6-51.6L288.2 343.4c-8-17.2-0.5-37.7 16.7-45.7 17.3-8 37.7-0.5 45.7 16.7L505.4 648c1.2 2.2 2.4 4.2 3.5 5.9 1-1.9 2-3.8 2.9-5.8l158.4-334c1.1-2.2 2.4-4.4 3.9-6.3 31.9-48.4 82.7-57.7 116.8-58 69.6 0.9 109.7 41.8 122.4 65.2 5.4 8.5 8.8 17.2 12.2 25.6 1.8 4.6 3.7 9.4 6.1 14.2 0.7 1.5 1.4 3 1.9 4.5 17.2 51.4 25.9 102.5 25.9 151.9 0 119.8-43.7 226.2-130 316.1-91.2 87.3-197.6 131.1-317.3 131.1z">
                                    </path>
                                </svg>
                                <a :href="release.html_url" target="_blank" rel="noopener" class="asset-name">
                                    {{ release.name || release.tag_name }}
                                </a>
                            </div>
                            <span class="download-count one-line">{{ release.totalDownloads.toLocaleString() }}
                                次下载</span>
                        </div>
                    </div>
                </div>
                <div v-for="release in releases" :key="release.id" class="release-card">
                    <div class="release-header">
                        <h3 class="release-title">
                            <a :href="release.html_url" target="_blank" rel="noopener">
                                {{ release.name || release.tag_name }}
                            </a>
                        </h3>
                        <div class="release-meta">
                            <div class="release-author">
                                <img :src="release.author.avatar_url" :alt="release.author.login" class="author-avatar">
                                <a :href="release.author.html_url" target="_blank" rel="noopener" class="author-name">
                                    @{{ release.author.login }}
                                </a>
                            </div>
                            <span class="release-date one-line">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path
                                        d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                                </svg>
                                {{ formatDate(release.published_at) }}
                            </span>

                            <span class="release-downloads one-line">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                </svg>
                                {{ release.totalDownloads.toLocaleString() }} 次下载
                            </span>
                        </div>
                    </div>

                    <div v-if="release.assets.length > 0" class="assets-list">
                        <div v-for="asset in release.assets" :key="asset.id" class="asset-item">
                            <div class="asset-info">
                                <svg class="file-icon" viewBox="0 0 24 24">
                                    <path
                                        d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                                </svg>
                                <a :href="asset.browser_download_url" target="_blank" rel="noopener" class="asset-name">
                                    {{ asset.name }}
                                </a>
                            </div>
                            <div class="download-count one-line">
                                {{ asset.download_count.toLocaleString() }} 次下载
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-assets">
                        此版本没有包含任何文件
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const repoUrl = ref('')
const loading = ref(false)
const error = ref('')
const releases = ref([])
const resultsVisible = ref(false)
const chartRef = ref(null)
let chartInstance = null

// 解析GitHub仓库URL
const parseRepoUrl = (url) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match || match.length < 3) {
        throw new Error('请输入有效的GitHub仓库地址，例如: https://github.com/用户名/仓库名')
    }
    return {
        owner: match[1],
        repo: match[2].replace(/\/$/, '').split('/')[0]
    }
}

// 获取Release数据
const fetchReleases = async (owner, repo) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('仓库未找到，请检查地址是否正确')
        } else if (response.status === 403) {
            throw new Error('API请求受限，请稍后再试')
        } else {
            throw new Error(`获取数据失败: ${response.statusText}`)
        }
    }

    const data = await response.json()

    if (data.length === 0) {
        throw new Error('该仓库没有发布任何Release')
    }

    return data.map(release => ({
        ...release,
        totalDownloads: release.assets.reduce((sum, asset) => sum + asset.download_count, 0),
        published_at: new Date(release.published_at)
    }))
}

// 格式化日期
const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// 初始化图表
const initChart = () => {
    if (chartInstance) {
        chartInstance.dispose()
    }

    chartInstance = echarts.init(chartRef.value)

    // 按版本排序
    const sortedReleases = releases.value.sort((a, b) => {
        const aVersion = a.name || a.tag_name
        const bVersion = b.name || b.tag_name
        return bVersion.localeCompare(aVersion)
    })

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: params => {
                return `${params[0].name}<br/>
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#6a5acd;"></span>
                下载量: <strong>${params[0].value.toLocaleString()}</strong> 次`
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            name: '版本',
            nameLocation: 'middle',
            nameGap: 30,
            axisTick: {
                show: false
            },
            data: sortedReleases.map(r => r.name || r.tag_name),
            axisLabel: {
                interval: 0,
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            name: '下载量',
            nameTextStyle: {
                padding: [0, 0, 0, 40]
            },
            axisLine: {
                show: true,
            },
            splitLine: {
                lineStyle: {
                    color: '#f6f8fa'
                }
            }
        },
        series: [{
            name: '下载量',
            type: 'bar',
            barWidth: '60%',
            data: sortedReleases.map(r => r.totalDownloads),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#8a63d2' },
                    { offset: 1, color: '#6a5acd' }
                ]),
                borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#9d76e3' },
                        { offset: 1, color: '#7d6ae6' }
                    ])
                }
            }
        }]
    }

    chartInstance.setOption(option)

    // 响应式调整
    window.addEventListener('resize', handleResize)
}

const handleResize = () => {
    chartInstance?.resize()
}

// 分析Release
const analyzeReleases = async () => {
    if (!repoUrl.value.trim()) {
        error.value = '请输入GitHub仓库地址'
        return
    }

    try {
        loading.value = true
        error.value = ''
        resultsVisible.value = false

        const { owner, repo } = parseRepoUrl(repoUrl.value)
        releases.value = await fetchReleases(owner, repo)
        resultsVisible.value = true

        await nextTick()
        initChart()
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

// 组件卸载时销毁图表
onBeforeUnmount(() => {
    if (chartInstance) {
        window.removeEventListener('resize', handleResize)
        chartInstance.dispose()
    }
})
</script>

<style scoped>
.github-release-analyzer {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #24292f;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.hero-section {
    padding: 4rem 1rem 1rem 1rem;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #2d2d57 0%, #6a5acd 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.search-container {
    max-width: 700px;
    margin: 0 auto;
}

.search-box {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #d0d7de;
    transition: all 0.3s ease;
}

.search-box:focus-within {
    box-shadow: 0 4px 16px rgba(106, 90, 205, 0.2);
    border-color: #6a5acd;
}

.search-icon {
    width: 20px;
    height: 20px;
    margin-left: 16px;
    fill: #57606a;
}

.search-input {
    flex: 1;
    padding: 10px;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #24292f;
}

.search-input::placeholder {
    color: #959da5;
}

.search-btn {
    padding: 0 24px;
    height: 40px;
    background: linear-gradient(90deg, #6a5acd 0%, #8a63d2 100%);
    color: white;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.search-btn:hover {
    background: linear-gradient(90deg, #5a4ab5 0%, #7a53c2 100%);
}

.search-btn:disabled {
    background: #959da5;
    cursor: not-allowed;
}

.loading-dots span {
    animation: blink 1.4s infinite;
    animation-fill-mode: both;
}

.loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes blink {
    0% {
        opacity: 0.2;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: 0.2;
    }
}

.error-message {
    color: #cf222e;
    margin-top: 12px;
    font-size: 0.9rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(106, 90, 205, 0.2);
    border-radius: 50%;
    border-top-color: #6a5acd;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.results-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
    flex: 1;
}

.chart-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #d0d7de;
    margin-bottom: 2rem;
}

.main-chart {
    width: 100%;
    aspect-ratio: 24 / 9;
}

.releases-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
}

.release-card {
    background: white;
    border-radius: 8px;
    border: 1px solid #d0d7de;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.release-header {
    padding: 1rem;
    border-bottom: 1px solid #f6f8fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.release-title {
    font-size: 1.1rem;
    font-weight: 600;
}

.release-title a {
    color: #2d2d57;
    text-decoration: none;
}

.release-title a:hover {
    color: #6a5acd;
    text-decoration: underline;
}

.release-author {
    display: flex;
    align-items: center;
    gap: 8px;
}

.author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.author-name {
    font-size: 0.85rem;
    color: #57606a;
    text-decoration: none;
}

.author-name:hover {
    color: #6a5acd;
    text-decoration: underline;
}

.release-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    color: #57606a;
}

.release-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
}

.assets-list {
    padding: 0.5rem;
}

.asset-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-radius: 6px;
    transition: background-color 0.2s;
}

.asset-item:hover {
    background-color: #f6f8fa;
}

.asset-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
}

.file-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    fill: #57606a;
}

.asset-name {
    font-size: 0.9rem;
    color: #24292f;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.asset-name:hover {
    color: #6a5acd;
    text-decoration: underline;
}

.download-count {
    font-size: 0.8rem;
    color: #2da44e;
    font-weight: 500;
    white-space: nowrap;
    margin-left: 8px;
}

.empty-assets {
    padding: 1rem;
    text-align: center;
    color: #57606a;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }

    .search-box {
        flex-direction: column;
        align-items: stretch;
    }

    .search-icon {
        display: none;
    }

    .search-input {
        padding: 10px 16px;
    }

    .search-btn {
        border-radius: 0 0 8px 8px;
    }
}
</style>