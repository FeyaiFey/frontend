export interface UserLoginType {
    email:string | undefined
    password:string | undefined
}

export interface UserInfo {
    id:string
    email:string
    username:string
    role_id:number
}