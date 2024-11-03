<template>
    <div w:w="lg:400px md:4/5 sm:11/12">
        <el-form :model="loginForm" ref="loginFormRef" :rules="rules" size="large">
            <h1 style="width: 100%;text-align: center;margin-bottom: 30px;font-size: 2rem;font-weight: bolder;">登录</h1>
  
            <el-form-item prop="email">
                <el-input v-model="loginForm.email" placeholder="邮箱账号" prefix-icon="Message" size="large"/>
            </el-form-item>
  
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password size="large" />
            </el-form-item>
  
            <div class="func" >
                <el-form-item>
                    <el-checkbox v-model='rememberMe'>记住我</el-checkbox>
                </el-form-item>
  
                <el-form-item>
                    <el-link>忘记密码</el-link>
                </el-form-item>
            </div>
            
            <el-form-item  size="large">
                <el-button type="primary" @click="login" :loading="isloading" style="width: 100%;font-size: 1.2rem;">登录</el-button>
            </el-form-item>
  
            <el-form-item  size="large">
                <el-button @click="$emit('toRegister')" style="width: 100%;font-size: 1.2rem;">注册</el-button>
            </el-form-item>
  
        </el-form>
    </div>
  
  </template>

<script setup lang="ts">
    import { ref,reactive,onMounted, watch,defineProps, unref } from 'vue';
    import { ElMessage } from 'element-plus';
    import type { FormInstance, FormRules } from 'element-plus';
    import { useUserStore } from '@/stores/user';
    import { useRouter } from 'vue-router';
    import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';
    import { loginApi,getRouteApi } from '@/api/login';
    import { usePermissionStore } from '@/stores/permission';


    const user = useUserStore()
    const permissionStore = usePermissionStore()

    const { currentRoute, addRoute, push } = useRouter()

    // 定义响应式变量
    const loginForm = reactive({email:"",password:""});
    const loginFormRef = ref<FormInstance>();
    const rememberMe = ref(user.rememberMe);
    const isloading = ref(false);

    // 挂载时候检查是否存在账户密码
    onMounted(()=>{
        const savedUser = user.getLoginInfo;
        if(savedUser){
            const {email,password} = savedUser;
            loginForm.email = email;
            loginForm.password = password;
        }
    })

    // 邮箱验证器
    const checkEmail =(rule:any,value: any, callback: any) => {
        if (!value) {
            return callback(new Error('请输入邮箱账号！'))
        }else {
            callback(); // 验证通过
        }
    };

    // 密码验证是否为空
    const checkPassword = (rule:any,value: any, callback: any) => {
        if (!value) {
            return callback(new Error('请输入密码！'))
        }else {
            callback(); // 验证通过
        }
    };

    // 定义验证规则
    const rules = reactive<FormRules<typeof loginForm>>({
        email:[{validator:checkEmail,trigger: 'blur'}],
        password:[{validator:checkPassword,trigger: 'blur'}]
    })

    // 监听注册数据更新
    const props = defineProps(['registerData']);
    watch(() => props.registerData, (newVal) => {
    if (newVal) {
        loginForm.email = newVal.email;
        loginForm.password = newVal.password;
    }
    });

    const redirect = ref<string>('')

    watch(
        () => currentRoute.value,
        (route: RouteLocationNormalizedLoaded) => {
            redirect.value = route?.query?.redirect as string
        },
        {
            immediate: true
        }
    )


    // 登录按钮
    async function login(){
        if (!loginFormRef.value) return
        // 使用 Promise 封装 validate
        const validateLoginForm = () => {
            return new Promise<boolean>((resolve, reject) => {
              loginFormRef.value!.validate((valid, fields) => {
                  if (valid) {
                      resolve(true);  // 验证通过
                  } else {
                      reject(fields);  // 验证不通过，传递错误信息
                  }
             });
            });
        };

        try{
          const valid = await validateLoginForm();
          // const valid = true;
          if (valid) {
              isloading.value = true;              
              try{
                  const response = await loginApi({"email":loginForm.email,"password":loginForm.password})
                  if(response){
                    // 是否记住我
                    if(unref(rememberMe)){
                      user.setLoginInfo({
                        email: loginForm.email,
                        password: loginForm.password
                      })
                      user.setRememberMe(unref(rememberMe))
                      user.setToken(response.tokeninfo.access_token)
                      user.setUserInfo(response.data)
                    }else {
                      user.reset()
                    }
                    
                    getRole()
                    ElMessage.success(`登录成功！欢迎：${response.data.username}`);
                    isloading.value = false;
                  }
              }catch(error:any){
                  isloading.value = false;
                  ElMessage.error(error.response.data.detail)  // 
              }
          }
        }catch(errorFields){
            ElMessage.error('表单内容有误，请检查输入！');
            const fields = errorFields as Record<string, any[]>;

            Object.keys(fields).forEach(field => {
                const errorMessage = fields[field][0].message;  // 取每个字段的第一条错误信息
                ElMessage.error(`${errorMessage}`);
                console.log(field)  // 显示具体的字段错误信息
            });
        }
    }

    // 获取角色路由信息

    const getRole = async () => {
        const params = {
            email: loginForm.email
        }
        const res = await getRouteApi(params)
        if (res) {
            const routers = res.data
            user.setRoleRouters(routers)
            await permissionStore.generateRoutes(routers).catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
                addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
            push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
    }

    
</script>

<style scoped>

.login-container {
max-width: 50vh;
width: 300px;
margin: 100px auto;
border: 1px solid #ddd;
border-radius: 4px;
box-shadow:0px 4px 12px rgba(0, 0, 0, 0.6);
}

.func {
display: flex;                  /* 使用 Flexbox 布局 */
justify-content: space-between; /* 两端对齐 */
align-items: center;            /* 垂直居中 */
margin-top: 10px;
margin-bottom: 20px;
}

/* 默认主题（light）下的 box-shadow */
:root {
--login-bg-color: #fff;
--login-box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 浅色阴影 */
}

/* 暗色模式下的 box-shadow */
.dark .login-form {
--login-bg-color: #333; /* 暗色背景 */
--login-box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.6); /* 深色阴影 */
}
</style>