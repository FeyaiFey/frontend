import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import type { RouteRecordRaw,RouteLocationNormalized } from 'vue-router'
import { Layout } from '@/utils/routerHelper'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/index', // '/assy/assyhistory'
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path:'/',
    component:Layout,
    name:'index',
    meta:{},
    children:[
      {
        path:'index',
        component: () => import('@/views/Welcome/Welcome.vue'),
        name:'welcome',
        meta:{
          title:'概况',
          noCache:true,
          affix: false,
          icon:'vi-mdi:human-welcome'
        }
      }
    ]
  },
  {
    path: '/assy',
    component: Layout,
    redirect: '/assy/assyhistory',
    name: 'assy',
    meta: {
      title: '封装',
      icon: 'vi-mdi:assembly',
      alwaysShow: true
    },
    children: [
      {
        path: 'assyhistory',
        component: () => import('@/views/AssyHistory/AssyHistory.vue'),
        name: 'assyHistory',
        meta: {
          title: '封装历史记录',
          noCache: true,
          affix: true,  // 固定tagview
          icon: 'vi-mdi:clipboard-text-history',
        }
      },
      {
        path: 'test',
        component: () => import('@/views/AssyHistory/Test.vue'),
        name: 'test',
        meta: {
          title: '测试',
          icon: 'vi-fluent:laser-tool-20-filled',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/files',
    component: Layout,
    name: 'files',
    meta: {
      title: '对外文件',
      icon: 'vi-solar:folder-with-files-bold'
    },
    children: [
      {
        path: 'bonding',
        component: () => import('@/views/FileBrowser/FileBrowser.vue'),
        name: 'bonding_file',
        meta: {
          title: '键合图',
          noCache: true,
          icon: 'vi-icon-park-solid:chip',
        }
      },
      {
        // 动态路由：匹配文件名参数
        path: 'bonding/:filename',
        component: () => import('@/views/FileBrowser/components/FilePreview.vue'),  // 预览文件的组件
        name: 'bonding_file_preview',
        meta: {
          title: '键合图预览',
          noCache: true,
          hidden: true,  // 可选：隐藏此路由在侧边栏的显示
        },
        props: (route:RouteLocationNormalized) => ({ file_name: route.params.filename }) // 将路由参数作为组件的 props 传入
      },
      {
        path: 'wire',
        component: () => import('@/views/FileBrowser/FileBrowser.vue'),
        name: 'wire_files',
        meta: {
          title: '打线图',
          icon: 'vi-arcticons:chipdefense',
          noCache: true
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !['Redirect', 'Login', 'NoFind', 'Root'].includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
