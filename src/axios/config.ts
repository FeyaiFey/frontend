import type { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { useUserStore } from '@/stores/user'

function objToFormData(obj: Recordable) {
    const formData = new FormData()
    Object.keys(obj).forEach((key) => {
      formData.append(key, obj[key])
    })
    return formData
  }

const defaultRequestInterceptors = (config:InternalAxiosRequestConfig) =>{
    if (
        config.method === 'post' &&
        config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ){
        config.data = qs.stringify(config.data)
    }else if(
        config.method === 'post' &&
        config.headers['Content-Type'] === 'multipart/form-data' &&
        !(config.data instanceof FormData)
    ){
        config.data = objToFormData(config.data)
    }
    if (config.method === 'get' && config.params) {
        let url = config.url as string
        url += '?'
        const keys = Object.keys(config.params)
        for (const key of keys) {
            if (config.params[key] !== void 0 && config.params[key] !== null) {
                url += `${key}=${encodeURIComponent(config.params[key])}&`
            }
        }
        url = url.substring(0, url.length - 1)
        config.params = {}
        config.url = url
    }
    return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
    if (response?.config?.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else if (response.data.code === 0) {
      return response.data
    } else {
      ElMessage.error(response?.data?.message)
      if (response?.data?.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
      }
    }
  }

export { defaultResponseInterceptors, defaultRequestInterceptors }