import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import FengUI from 'yc-feng-ui/es/index.js'
import 'yc-feng-ui/umd/style.css';

const app = createApp(App)
app.use(FengUI)
app.use(router)
app.mount('#app')
