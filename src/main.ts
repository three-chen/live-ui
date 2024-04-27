import './assets/main.css'

import Antd from 'ant-design-vue'
import { createApp } from 'vue'
import { Pinia } from './stores/index'

import App from './App.vue'
import router from './router'

import 'ant-design-vue/dist/reset.css'
import './root.css'

const app = createApp(App)

app.use(Pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
