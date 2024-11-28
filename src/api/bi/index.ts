import request from '@/axios'

export const caiwuApi = (): Promise<IResponse> => {
    return request.get({ url: 'bi/caiwu'})
  }