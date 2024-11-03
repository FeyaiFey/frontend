import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import { defineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/utils/routerHelper'

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

type Recordable<T = any, K extends string | number | symbol = string> = Record<K extends null | undefined ? string : K, T>

interface RouteMetaCustom extends Record<string | number | symbol, unknown> {
    hidden?: boolean
    alwaysShow?: boolean
    title?: string
    icon?: string
    noCache?: boolean
    breadcrumb?: boolean
    affix?: boolean
    activeMenu?: string
    noTagsView?: boolean
    canTo?: boolean
    permission?: string[]
  }

interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
}

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
  // {
  //   path: '/personal',
  //   component: Layout,
  //   redirect: '/personal/personal-center',
  //   name: 'Personal',
  //   meta: {
  //     title: '个人',
  //     hidden: true,
  //     canTo: true
  //   },
  //   children: [
  //     {
  //       path: 'personal-center',
  //       component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'),
  //       name: 'PersonalCenter',
  //       meta: {
  //         title: '个人中心',
  //         hidden: true,
  //         canTo: true
  //       }
  //     }
  //   ]
  // },
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
