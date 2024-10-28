import { defineStore } from 'pinia'
import type { UserInfo , UserLoginType } from '@/api/login/types'

export interface UserState{
  userInfo?:UserInfo
  token:string
  rememberMe:boolean
  loginInfo:UserLoginType
  roleRouters:string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({   // 需要管理状态的内容
    userInfo:undefined as UserInfo| undefined,
    token: '',
    rememberMe:true,
    loginInfo:undefined as UserLoginType| undefined,    // 登录的账密
    roleRouters:undefined as string[] | undefined
  }),
  getters:{         // 获取状态属性的方法 类似 computer
    gerUserInfo():UserInfo | undefined {
      return this.userInfo
    },
    getToken():string {
      return this.token
    },
    getRememberMe():boolean{
      return this.rememberMe
    },
    getLoginInfo():UserLoginType | undefined{
      return this.loginInfo
    },
    getRoleRouters():string[] | undefined {
      return this.roleRouters
    },
  },
  actions:{          // 设置状态的方法 类似 function
    setToken(token:string){
      this.token = token;
    },
    clearToken(){
      this.setToken("")
    },
    setUserInfo(userInfo?:UserInfo){
      this.userInfo = userInfo
    },
    setLoginInfo(loginInfo?:UserLoginType){
      this.loginInfo = loginInfo
    },
    setRememberMe(rememberMe:boolean){
      this.rememberMe = rememberMe
    },
    setRoleRouters(roleRouters:string[]){
      this.roleRouters = roleRouters
    },
    reset(){
      this.setToken("")
      this.setUserInfo(undefined)
      this.setRoleRouters([])
    }
  },
  persist:true
})