import { useAppStore } from '@/stores/app'

export const usePageLoading = () => {
  const loadStart = () => {
    const appStore = useAppStore()

    appStore.setPageLoading(true)
  }

  const loadDone = () => {
    const appStore = useAppStore()

    appStore.setPageLoading(false)
  }

  return {
    loadStart,
    loadDone
  }
}
