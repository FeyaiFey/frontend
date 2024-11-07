import request from '@/axios'

interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
    total?:number
}

export const assyHistoryApi = (params?: any): Promise<IResponse> => {
    return request.get({ url: '/assyhistory', params})
  }