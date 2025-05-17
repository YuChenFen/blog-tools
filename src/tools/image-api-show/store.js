import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateRandomString, getUrlParams, getUrlWithParams } from './utils'

export const useImageApiShowStore = defineStore('image-api-show', () => {
    const cols = ref(4)
    const concurrency = ref(1)
    const urls = ref([])
    const links = ref([])
    let loadTimeout = null;
    let info = null;
    let dockviewApi = null;
    const globalVariables = ref([{}])
    const globalParameters = ref([{}])

    const load = (callBack) => {
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
            callBack && callBack();
            info.close();
            loadTimeout = null;
            info = null;
        }, 1000);
    }

    function pushUrl(data, urlArgu, i, isReturn = false) {
        if (i < urlArgu.length) {
            if (data instanceof Array) {
                for (let j = 0; j < data.length; j++) {
                    if (isReturn) {
                        return pushUrl(data[j][urlArgu[i]], urlArgu, i + 1, isReturn);
                    }
                    pushUrl(data[j][urlArgu[i]], urlArgu, i + 1, isReturn);
                }
            } else {
                if (isReturn) {
                    return pushUrl(data[urlArgu[i]], urlArgu, i + 1, isReturn);
                }
                pushUrl(data[urlArgu[i]], urlArgu, i + 1, isReturn);
            }
        } else {
            if (data instanceof Array) {
                for (let j = 0; j < data.length; j++) {
                    if (isReturn) {
                        return data[j];
                    }
                    urls.value.push(data[j]);
                }
            } else {
                if (isReturn) {
                    return data;
                }
                urls.value.push(data);
            }
        }
    }

    function pretreatmentUrl(url) {
        let _url = url.split('?')[0];
        const urlParams = getUrlParams(url);
        const globalVariablesKV = [
            (text) => {
                if (text.match(/{{\$time}}/)) {
                    return text.replaceAll(/\{\{\$time\}\}/g, (match, p1) => {
                        return new String(Date.now());
                    });
                }
                return text;
            },
            (text) => {
                if (text.match(/\{\{\s*\$randomInt\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*\}\}/)) {
                    return text.replaceAll(/\{\{\s*\$randomInt\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*\}\}/g, (match, p1, p2) => {
                        let a = p1, b = p2;
                        if (a > b) {
                            [a, b] = [b, a];
                        }
                        return Math.floor(Math.random() * (b - a + 1) + a);
                    });
                }
                return text;
            }
        ]
        for (let j = 0; j < globalVariables.value.length; j++) {
            globalVariablesKV.push((text) => {
                let re = new RegExp(`{{${globalVariables.value[j].key}}}`, 'g');
                if (re.test(text)) {
                    return text.replaceAll(re, (match, p1) => {
                        return globalVariables.value[j].value | match;
                    });
                }
                return text;
            })
        }

        // 处理全局参数/全局变量
        // url处理
        function pretreatmentText(text) {
            for (let i = 0; i < globalVariablesKV.length; i++) {
                text = globalVariablesKV[i](text);
            }
            return text;
        }
        _url = pretreatmentText(_url);
        let newUrlParams = {};
        for (let j = 0; j < globalParameters.value.length; j++) {
            let key = globalParameters.value[j].key;
            let value = globalParameters.value[j].value;
            key = pretreatmentText(key);
            value = pretreatmentText(value);
            if (!newUrlParams[key]) {
                newUrlParams[key] = value;
            }
        }

        for (let j in urlParams) {
            let key = j;
            let value = pretreatmentText(urlParams[j]);
            if (!newUrlParams[key]) {
                newUrlParams[key] = value;
            }
        }
        return getUrlWithParams(_url, newUrlParams);
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

            url = pretreatmentUrl(url);

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

    async function getImageUrl(link, fetchCallback) {
        let url = link.url;
        url = pretreatmentUrl(url);

        if (link.data === "") {
            if (fetchCallback) {
                fetchCallback("未填写data");
            }
            return url;
        }
        try {
            const response = await fetch(url, { method: 'GET', redirect: 'follow' });
            let text = await response.text();
            if (fetchCallback) {
                fetchCallback(text)
            }
            // 如果是重定向，直接将重定向地址添加到urls中
            // if (response.redirected) {
            //     urls.value.push(response.url);
            //     continue;
            // }
            const jsonData = JSON.parse(text);
            return pushUrl(jsonData, link.data.split("."), 0, true);
        } catch (error) {
            console.log(error);
            ElMessage({
                message: error,
                type: 'error',
                duration: 1000
            })
        }
    }

    // 异步获取图片
    async function getImage() {
        const workers = Array.from({ length: concurrency.value }, () => fetchImage(links.value));
        await Promise.all(workers);
    }

    function saveLinks() {
        globalParameters.value = globalParameters.value.filter(item => item.key !== '')
        globalVariables.value = globalVariables.value.filter(item => item.key !== '')
        localStorage.setItem('links', JSON.stringify(links.value))
        localStorage.setItem('global-variables', JSON.stringify(globalVariables.value))
        localStorage.setItem('global-parameters', JSON.stringify(globalParameters.value))
        ElMessage({
            message: '保存成功',
            type: 'success',
        })
    }

    function initLinks() {
        links.value = []
        globalVariables.value = []
        globalParameters.value = []
        try {
            links.value = JSON.parse(localStorage.getItem('links')) || []
            globalVariables.value = JSON.parse(localStorage.getItem('global-variables')) || []
            globalParameters.value = JSON.parse(localStorage.getItem('global-parameters')) || []
        } catch (e) {
            console.log(e)
        }
    }

    function setDockviewApi(api) {
        dockviewApi = api
    }
    function changeLink(data) {
        const imageGroup = dockviewApi.groups[1]
        for (let i = 0; i < imageGroup.panels.length; i++) {
            if (imageGroup.panels[i].id === data.id) {
                imageGroup.panels[i].focus()
                return;
            }
        }
        dockviewApi.addPanel({
            id: data.id,
            component: 'HttpView',
            title: data.label,
            position: {
                referencePanel: '图像',
                direction: 'within'
            },
            params: {
                data
            }
        });
    }

    return {
        cols,
        concurrency,
        urls,
        links,
        globalVariables,
        globalParameters,
        load,
        saveLinks,
        initLinks,
        getImageUrl,
        setDockviewApi,
        changeLink
    }
})