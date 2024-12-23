import { useTagsViewStore } from '@/stores/tagsView'
import { type RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import { computed, nextTick, unref } from 'vue'

interface Fn<T = any> {
  (...arg: T[]): T
}

export const useTagsView = () => {
  const tagsViewStore = useTagsViewStore()

  const { replace, currentRoute } = useRouter()

  const selectedTag = computed(() => tagsViewStore.getSelectedTag)

  const closeAll = (callback?: Fn) => {
    tagsViewStore.delAllViews()
    callback?.()
  }

  const closeLeft = (callback?: Fn) => {
    tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
    callback?.()
  }

  const closeRight = (callback?: Fn) => {
    tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
    callback?.()
  }

  const closeOther = (callback?: Fn) => {
    tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
    callback?.()
  }

  const closeCurrent = (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
    if (view?.meta?.affix) return
    tagsViewStore.delView(view || unref(currentRoute))

    callback?.()
  }

  const refreshPage = async (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
    tagsViewStore.delCachedView()
    const { path, query } = view || unref(currentRoute)
    await nextTick()
    replace({
      path: '/redirect' + path,
      query: query
    })
    callback?.()
  }

  const setTitle = (title: string, path?: string) => {
    tagsViewStore.setTitle(title, path)
  }

  return {
    closeAll,
    closeLeft,
    closeRight,
    closeOther,
    closeCurrent,
    refreshPage,
    setTitle
  }
}
