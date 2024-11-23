import request from '@/axios'

interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
    total?:number
}

export const packageListApi = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package', params})
  }

export const bomListApi = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package/bom', params})
}

export const selectDownload = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package/selectDownload', params,responseType:'blob'})
}

export const queryDownload = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package/queryDownload', params,responseType:'blob'})
}