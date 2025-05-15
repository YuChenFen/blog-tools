// 随机字符串
export function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let time = Date.now();
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return time.toString() + result;
}

// 获取get请求的参数
export function getUrlParams(url) {
    if (URLSearchParams) {
        const queryString = url.split('?')[1] || '';
        const params = new URLSearchParams(queryString);
        const result = {};

        // 转换为普通对象
        for (const [key, value] of params) {
            result[key] = value;
        }

        return result;
    } else {
        const queryString = url.split('?')[1] || '';
        const params = {};

        queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });

        return params;
    }
}

// 由url和get参数获取地址
export function getUrlWithParams(url, params) {
    if (Object.keys(params).length === 0) {
        return url;
    }
    if (URLSearchParams) {
        const urlParams = new URLSearchParams(params);
        return `${url}?${urlParams.toString()}`;
    } else {
        let urlWithParams = url;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                urlWithParams += `${urlWithParams.includes('?') ? '&' : '?'}${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
            }
        }
        return urlWithParams;
    }
}
