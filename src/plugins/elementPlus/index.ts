import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export const setupElementPlus = (app: App<Element>) => {
  app.use(ElementPlus)
  import('element-plus/dist/index.css')

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
