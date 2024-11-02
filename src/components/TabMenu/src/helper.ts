import { getAllParentPath } from '@/components/Menu/src/helper'
import { isUrl } from '@/utils/is'
import { cloneDeep } from 'lodash-es'
import { reactive } from 'vue'
import type {  RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'


type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

type Recordable<T = any, K extends string | number | symbol = string> = Record<K extends null | undefined ? string : K, T>

type Nullable<T> = T | null

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

export type TabMapTypes = {
  [key: string]: string[]
}

export const tabPathMap = reactive<TabMapTypes>({})

export const initTabMap = (routes: AppRouteRecordRaw[]) => {
  for (const v of routes) {
    const meta = v.meta ?? {}
    if (!meta?.hidden) {
      tabPathMap[v.path] = []
    }
  }
}

export const filterMenusPath = (
  routes: AppRouteRecordRaw[],
  allRoutes: AppRouteRecordRaw[]
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []
  for (const v of routes) {
    let data: Nullable<AppRouteRecordRaw> = null
    const meta = v.meta ?? {}
    if (!meta.hidden || meta.canTo) {
      const allParentPath = getAllParentPath<AppRouteRecordRaw>(allRoutes, v.path)

      const fullPath = isUrl(v.path) ? v.path : allParentPath.join('/')

      data = cloneDeep(v)
      data.path = fullPath
      if (v.children && data) {
        data.children = filterMenusPath(v.children, allRoutes)
      }

      if (data) {
        res.push(data)
      }

      if (allParentPath.length && Reflect.has(tabPathMap, allParentPath[0])) {
        tabPathMap[allParentPath[0]].push(fullPath)
      }
    }
  }

  return res
}
