import request from '@/axios'

interface RoleParams {
  email: string
}

interface LoginType {
  email: string
  password:string
}

interface RegisterType {
  username:string
  email: string
  password:string
  code?:number | string
}

interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
    total?:number
    tokeninfo?:T extends any ? T : T & any
}

export const loginApi = (data: LoginType): Promise<IResponse> => {
  return request.post({ url: '/auth/login', data})
}

export const registerApi = (data: RegisterType): Promise<IResponse> => {
  return request.post({ url: '/auth/register', data})
}


export const getRouteApi = (params: RoleParams): Promise<IResponse> => {
  return request.get({ url: '/user/role', params})
}