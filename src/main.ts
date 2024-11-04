import 'virtual:windi.css'
import 'animate.css'
// 引入全局样式
import '@/styles/index.less'

// 全局组件
import { setupGlobCom } from '@/components'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './permission'




const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(setupGlobCom)

app.mount('#app')
