import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/utils/routerHelper'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/assy/assyhistory',
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
    path: '/assy',
    component: Layout,
    redirect: '/assy/assyhistory',
    name: 'assy',
    meta: {
      title: '封装',
      icon: 'vi-ant-design:dashboard-filled',
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
          affix: true
        }
      },
      {
        path: 'test',
        component: () => import('@/views/AssyHistory/AssyHistory.vue'),
        name: 'test',
        meta: {
          title: '测试',
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
