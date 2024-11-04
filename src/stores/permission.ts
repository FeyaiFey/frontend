import { defineStore } from 'pinia'
import { constantRouterMap,asyncRouterMap } from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import { generateRoutesByServer,generateRoutesByFrontEnd,flatMultiLevelRoutes } from '@/utils/routerHelper'
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash-es'

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

interface AppCustomRouteRecordRaw
    extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
    name: string
    meta: RouteMetaCustom
    component: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
  }

export interface PermissionState {
    routers: AppRouteRecordRaw[]
    addRouters: AppRouteRecordRaw[]
    isAddRouters: boolean
    menuTabRouters: AppRouteRecordRaw[]
  }

export const usePermissionStore = defineStore('permission', {
    state: (): PermissionState => ({
      routers: [],
      addRouters: [],
      isAddRouters: false,
      menuTabRouters: []
    }),
    getters: {
      getRouters(): AppRouteRecordRaw[] {
        return this.routers
      },
      getAddRouters(): AppRouteRecordRaw[] {
        return flatMultiLevelRoutes(cloneDeep(this.addRouters))
      },
      getIsAddRouters(): boolean {
        return this.isAddRouters
      },
      getMenuTabRouters(): AppRouteRecordRaw[] {
        return this.menuTabRouters
      }
    },
    actions: {
      generateRoutes(
          type: 'server' | 'frontEnd' | 'static',
          routers?: AppCustomRouteRecordRaw[] | string[]
        ): Promise<unknown> {
          return new Promise<void>((resolve) => {
            let routerMap: AppRouteRecordRaw[] = []
            if (type === 'server') {
              // 模拟后端过滤菜单
              routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
            } else if (type === 'frontEnd') {
              // 模拟前端过滤菜单
              routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
            } else {
              // 直接读取静态路由表
              routerMap = cloneDeep(asyncRouterMap)
            }
            // 动态路由，404一定要放到最后面
            this.addRouters = routerMap.concat([
              {
                path: '/:path(.*)*',
                redirect: '/404',
                name: '404Page',
                meta: {
                  hidden: true,
                  breadcrumb: false
                }
              }
            ])
            // 渲染菜单的所有路由
            this.routers = cloneDeep(constantRouterMap).concat(routerMap)
            resolve()
          })
        },
        setIsAddRouters(state: boolean): void {
            this.isAddRouters = state
        },
        setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
            this.menuTabRouters = routers
        }
    },
    persist: true
})