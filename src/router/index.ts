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
          affix: true,
          icon:'vi-mdi:human-welcome'
        }
      }
    ]
  },
  {
    path: '/wip',
    component: Layout,
    redirect: '/wip/package',
    name: 'process',
    meta: {
      title: '进度查询',
      icon: 'vi-tabler:percentage-66',
      alwaysShow: true
    },
    children: [
      {
        path: 'purchase',
        component: () => import('@/views/AssyHistory/AssyHistory.vue'),
        name: 'purchase',
        meta: {
          title: '采购在途',
          noCache: true,
          affix: false,  // 固定tagview
          icon: 'vi-bxs:purchase-tag',
        }
      },
      {
        path: 'package',
        component: () => import('@/views/AssyHistory/Test.vue'),
        name: 'package',
        meta: {
          title: '委外封装',
          icon: 'vi-mdi:assembly',
          noCache: true
        }
      },
      {
        path: 'wafertest',
        component: () => import('@/views/AssyHistory/Test.vue'),
        name: 'wafertest',
        meta: {
          title: '委外中测',
          icon: 'vi-gg:smartphone-chip',
          noCache: true
        }
      },
      {
        path: 'mo',
        component: () => import('@/views/AssyHistory/Test.vue'),
        name: 'mo',
        meta: {
          title: '二次委外',
          icon: 'vi-ic:twotone-reply-all',
          noCache: true
        }
      },
    ]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/package',
    name: 'package',
    meta: {
      title: '信息查询',
      icon: 'vi-icon-park-solid:view-list',
      alwaysShow: true
    },
    children: [
      {
        path: 'package',
        component: () => import('@/views/AssyHistory/AssyHistory.vue'),
        name: 'assyHistory',
        meta: {
          title: '封装信息',
          noCache: true,
          affix: false,  // 固定tagview
          icon: 'vi-mdi:clipboard-text-history',
        }
      },
      {
        path: 'wafertest',
        component: () => import('@/views/AssyHistory/Test.vue'),
        name: 'test',
        meta: {
          title: '中测信息',
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
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/FileBrowser/FileBrowser.vue'),
        name: 'files',
        meta: {
          title: '图纸文档',
          noCache: true,
          icon: 'vi-vaadin:open-book',
        }
      }
    ]
  }
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
