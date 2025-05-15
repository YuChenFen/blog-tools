import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import resizeBar from './components/directive/resizeBar'

// sober.js
import 'sober/icon'
import 'sober/button'
import 'sober/checkbox'

// highlight.js
import 'highlight.js/styles/stackoverflow-light.css';
import hljs from 'highlight.js/lib/core';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xml);

const app = createApp(App)
app.use(hljsVuePlugin)
app.use(router)
app.use(createPinia())

app.directive("resize-bar", resizeBar);  // 侧边栏修改

app.mount('#app')
