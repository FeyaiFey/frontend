import { watch, ref } from 'vue'
import { isString } from '@/utils/is'
import { useAppStore } from '@/stores/app'

export const useTitle = (newTitle?: string) => {
  const appStore = useAppStore()

  const title = ref(
    newTitle ? `${appStore.getTitle} - ${newTitle as string}` : appStore.getTitle
  )

  watch(
    title,
    (n, o) => {
      if (isString(n) && n !== o && document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}
