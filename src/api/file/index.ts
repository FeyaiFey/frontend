import request from '@/axios'

export const foldersApi = (): Promise<IResponse> => {
  return request.get({ url: 'files/'})
}

export const filesApi = (params?: any): Promise<IResponse> => {
  return request.get({ url: `files/${params}`, responseType:'blob'})
}