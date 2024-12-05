import request from '@/axios'

interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
    total?:number
}

export const packageListApi = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package', params})
  }

export const cpListApi = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/cp', params})
}

export const bomListApi = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/bom', params})
}

export const selectPackageDownload = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package/selectDownload', params,responseType:'blob'})
}

export const queryPackageDownload = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/package/queryDownload', params,responseType:'blob'})
}

export const selectCpDownload = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/cp/selectDownload', params,responseType:'blob'})
}

export const queryCpDownload = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/mo/cp/queryDownload', params,responseType:'blob'})
}