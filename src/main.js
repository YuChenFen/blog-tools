import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'


// sober.js
import 'sober/icon'
import 'sober/button'
import 'sober/checkbox'
import 'sober/text-field'
import 'sober/field'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
