import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateRandomString } from './utils'

export const useImageApiShowStore = defineStore('image-api-show', () => {
    const cols = ref(4)
    const concurrency = ref(1)
    const urls = ref([])
    const links = ref([])
    let loadTimeout = null;
    let info = null;
    const globalVariables = ref([{}])

    const load = () => {
        if (!info) {
            info = ElMessage({
                message: '正在加载中...',
                type: 'info',
                duration: 0,
            })
        }
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
        loadTimeout = setTimeout(async () => {
            await getImage();
            ElMessage({
                message: '加载完成',
                type: 'success',
            })
            info.close();
            loadTimeout = null;
            info = null;
        }, 1000);
    }

    async function pushUrl(data, urlArgu, i) {
        if (i < urlArgu.length) {
            if (data instanceof Array) {
                for (let j = 0; j < data.length; j++) {
                    pushUrl(data[j][urlArgu[i]], urlArgu, i + 1);
                }
            } else {
                pushUrl(data[urlArgu[i]], urlArgu, i + 1);
            }
        } else {
            if (data instanceof Array) {
                for (let j = 0; j < data.length; j++) {
                    urls.value.push(data[j]);
                }
            } else {
                urls.value.push(data);
            }
        }
    }

    async function fetchImage(links) {
        for (let i = 0; i < links.length; i++) {
            if (links[i].hasOwnProperty('children')) {
                fetchImage(links[i].children);
                continue;
            }
            if (!links[i].enable) {
                continue;
            }
            let url = links[i].url;
            if (!url) {
                continue;
            }
            // 替换变量
            url = url.replace("{{time}}", new String(Date.now()) + generateRandomString(12));
            for (let j = 0; j < globalVariables.value.length; j++) {
                url = url.replace(`{{${globalVariables.value[j].key}}}`, globalVariables.value[j].value);
            }
            if (links[i].data === "") {
                urls.value.push(url);
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
                pushUrl(jsonData, links[i].data.split("."), 0);
            } catch (error) {
                console.log(error);
            }
        }
    }

    // 异步获取图片
    async function getImage() {
        const workers = Array.from({ length: concurrency.value }, () => fetchImage(links.value));
        await Promise.all(workers);
    }

    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links.value))
        localStorage.setItem('global-variables', JSON.stringify(globalVariables.value))
        ElMessage({
            message: '保存成功',
            type: 'success',
        })
    }

    function initLinks() {
        links.value = []
        globalVariables.value = []
        try {
            links.value = JSON.parse(localStorage.getItem('links')) || []
            globalVariables.value = JSON.parse(localStorage.getItem('global-variables')) || []
        } catch (e) {
            console.log(e)
        }
    }

    return {
        cols,
        concurrency,
        urls,
        links,
        globalVariables,
        load,
        saveLinks,
        initLinks
    }
})