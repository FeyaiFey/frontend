import request from '@/axios'



export const testapi = (data:any): Promise<IResponse> => {
    return request.post({ url: '/test/send', data})
  }