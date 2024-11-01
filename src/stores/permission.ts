import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import { generateRoutesByServer,flatMultiLevelRoutes } from '@/utils/routerHelper'
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
        generateRoutes(routes: AppCustomRouteRecordRaw[]): Promise<unknown>{
            return new Promise<void>((resolve) => {
                let routerMap: AppRouteRecordRaw[] = generateRoutesByServer(routes as AppCustomRouteRecordRaw[])
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