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
    path: '/personal',
    component: Layout,
    redirect: '/personal/personal-center',
    name: 'Personal',
    meta: {
      title: "我",
      hidden: true,
      canTo: true
    },
    children: [
      {
        path: 'personal-center',
        component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'),
        name: 'PersonalCenter',
        meta: {
          title: '个人中心',
          hidden: true,
          canTo: true
        }
      }
    ]
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
        name:'Welcome',
        meta:{
          title:'概况',
          noCache:true,
          affix: true,  // 固定tag
          icon:'vi-mdi:human-welcome'
        }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/coordination',
    name: 'Report',
    meta: {
      title: '报表',
      icon: 'vi-iconoir:reports',
      alwaysShow: true
    },
    children: [
      {
        path: 'coordination',
        component: () => import('@/views/Report/Coordination.vue'),
        name: 'Coordination',
        meta: {
          title: '产销协调',
          icon: 'vi-tdesign:cooperate-filled',
        }
      },
      {
        path: 'finances',
        component: () => import('@/views/Report/Finances.vue'),
        name: 'Finances',
        meta: {
          title: '财务Report',
          icon: 'vi-carbon:purchase',
        }
      },
    ]
  },
  {
    path: '/wip',
    component: Layout,
    redirect: '/wip/package-wip',
    name: 'process',
    meta: {
      title: '进度查询',
      icon: 'vi-tabler:percentage-66',
      alwaysShow: true
    },
    children: [
      {
        path: 'purchase-wip',
        component: () => import('@/views/Wip/PurchaseWip.vue'),
        name: 'PurchaseWip',
        meta: {
          title: '采购在途',
          icon: 'vi-bxs:purchase-tag',
        }
      },
      {
        path: 'package-wip',
        component: () => import('@/views/Wip/PackageWip.vue'),
        name: 'PackageWip',
        meta: {
          title: '委外封装',
          icon: 'vi-mdi:assembly',
        }
      },
      {
        path: 'wafertest-wip',
        component: () => import('@/views/Wip/WaferTestWip.vue'),
        name: 'WaferTestWip',
        meta: {
          title: '委外中测',
          icon: 'vi-gg:smartphone-chip',
        }
      },
      {
        path: 'redaction-wip',
        component: () => import('@/views/Wip/RedactionWip.vue'),
        name: 'Redaction',
        meta: {
          title: '二次委外',
          icon: 'vi-ic:twotone-reply-all',
        }
      },
    ]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/package-info',
    name: 'package_info',
    meta: {
      title: '信息查询',
      icon: 'vi-icon-park-solid:view-list',
      alwaysShow: true
    },
    children: [
      {
        path: 'package-info',
        component: () => import('@/views/Info/PackageInfo.vue'),
        name: 'PackageInfo',
        meta: {
          title: '封装信息',
          icon: 'vi-eos-icons:hardware-circuit',
        }
      },
      {
        path: 'wafertest-info',
        component: () => import('@/views/Info/WaferTestInfo.vue'),
        name: 'WaferTestInfo',
        meta: {
          title: '中测信息',
          icon: 'vi-fluent:laser-tool-20-filled',
        }
      },
      {
        path: 'receipt-info',
        component: () => import('@/views/Info/ReceiptInfo.vue'),
        name: 'ReceiptInfo',
        meta: {
          title: '入库信息',
          icon: 'vi-material-symbols:warehouse'
        }
      },
      {
        path: 'stock-info',
        component: () => import('@/views/Info/StockInfo.vue'),
        name: 'StockInfo',
        meta: {
          title: '库存信息',
          icon: 'vi-vaadin:stock',
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
        name: 'FileBrowser',
        meta: {
          title: '图纸文档',
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
