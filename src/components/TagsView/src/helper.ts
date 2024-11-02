import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { pathResolve } from '@/utils/routerHelper'
import { defineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

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

export const filterAffixTags = (routes: AppRouteRecordRaw[], parentPath = '') => {
  let tags: RouteLocationNormalizedLoaded[] = []
  routes.forEach((route) => {
    const meta = route.meta ?? {}
    const tagPath = pathResolve(parentPath, route.path)
    if (meta?.affix) {
      tags.push({ ...route, path: tagPath, fullPath: tagPath } as RouteLocationNormalizedLoaded)
    }
    if (route.children) {
      const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })

  return tags
}
