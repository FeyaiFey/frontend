import request from '@/axios'

export const foldersApi = (): Promise<IResponse> => {
  return request.get({ url: 'files/folder'})
}

export const filesApi = (params?:any): Promise<IResponse> => {
  return request.get({ url: 'files/filelists',params})
}

export const filesPreviewApi = (params?:any): Promise<IResponse> => {
  return request.get({ url: 'files/preview',params,responseType:'blob'})
}


export const filesDownloadApi = (params?:any): Promise<IResponse> => {
  return request.get({ url: 'files/download',params,responseType:'blob'})
}