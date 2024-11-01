import request from '@/axios'

interface RoleParams {
    email: string
  }

interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
    total?:number
}

export const getRouteApi = (params: RoleParams): Promise<IResponse> => {
    return request.get({ url: '/user/role', params})
  }