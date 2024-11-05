import 'vue/jsx'

import 'virtual:windi.css'
import 'animate.css'
// 引入全局样式
import '@/styles/index.less'



// 引入状态管理
import { setupStore } from '@/stores'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  await app.use(ElementPlus)
  
  setupStore(app)

  setupGlobCom(app)

  setupRouter(app)

  setupPermission(app)

  app.mount('#app')
}

setupAll()