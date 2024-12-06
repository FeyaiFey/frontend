import request from '@/axios'

interface RoleParams {
  email: string | undefined
}

interface LoginType {
  email: string | undefined
  password:string | undefined
}

interface RegisterType {
  username:string
  email: string
  password:string
  code?:number | string
}

export const loginApi = (data: LoginType): Promise<IResponse> => {
  return request.post({ url: '/auth/login', data})
}

export const registerApi = (data: RegisterType): Promise<IResponse> => {
  return request.post({ url: '/auth/register', data})
}

export const getRouteApi = (params: RoleParams): Promise<IResponse> => {
  return request.get({ url: '/auth/route', params})
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/auth/logout'})
}

export const authApi = ():Promise<IResponse> => {
  return request.get({ url: '/users/me'})
}

// 获取头像api
// export const getAvatarApi = (params?:any):Promise<IResponse> => {
//   return request.get({ url: '/users/get-avatar',params})
// }


// 上传头像api
export const saveAvatarApi = (data?:any):Promise<IResponse> => {
  return request.post({ url: '/users/upload-avatar',data})
}

//