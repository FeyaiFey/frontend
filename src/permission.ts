import router from './router'
import { useAppStore } from '@/stores/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/useTitle'
import { useNProgress } from '@/hooks/useNProgress'
import { usePermissionStore } from '@/stores/permission'
import { usePageLoading } from '@/hooks/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStore } from '@/stores/user'
import { authApi } from './api/login'


export interface PermissionState {
    routers: AppRouteRecordRaw[]
    addRouters: AppRouteRecordRaw[]
    isAddRouters: boolean
    menuTabRouters: AppRouteRecordRaw[]
  }

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStore()
  const appStore = useAppStore()
  const userStore = useUserStore()
  if (userStore.getUserInfo) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }

      // **向后端验证token的逻辑**
      try{
        const res = await authApi()
        // 如果验证失败，重定向到登录页
        if (!res.data) {
          userStore.logout()
          next(`/login?redirect=${to.path}`)
          return
        }
      }catch(error){
        userStore.logout()
        console.error('Token 验证失败:', error)
        next(`/login?redirect=${to.path}`)
        return
      }
      
      // 开发者可根据实际情况进行修改
      const roleRouters = userStore.getRoleRouters || []

      // 是否使用动态路由
      if (appStore.getDynamicRouter) {
        appStore.serverDynamicRouter
          ? await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])
          : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
      } else {
        await permissionStore.generateRoutes('static')
      }

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})