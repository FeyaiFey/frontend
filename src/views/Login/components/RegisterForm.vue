<template>
    <el-form :model="registerForm" ref="registerFormRef" :rules="rules" size="large" class="dark:(border-1 border-[var(--el-border-color)] border-solid) w-[100%]">
        <h1 style="width: 100%;text-align: center;margin-bottom: 30px;font-size: 2rem;font-weight: bolder;">账号注册</h1>
        <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名(昵称)" prefix-icon="User" size="large"/>
        </el-form-item>

        <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="邮箱账号" prefix-icon="Message" size="large"/>
        </el-form-item>

        <el-form-item prop="pass">
            <el-input v-model="registerForm.pass" type="password" placeholder="输入密码" prefix-icon="Lock" show-password size="large" />
        </el-form-item>

        <el-form-item prop="word">
            <el-input v-model="registerForm.word" type="password" placeholder="确认密码" prefix-icon="Lock" show-password size="large" />
        </el-form-item>

        <el-form-item prop="role_number">
            <el-input v-model="registerForm.role_number" placeholder="权限码(非必填)" prefix-icon="Bell" size="large" />
        </el-form-item>
        
        <el-form-item  size="large">
            <el-button type="primary" @click="register" :loading="isloading" style="width: 100%;font-size: 1.2rem;">注册</el-button>
        </el-form-item>

        <el-form-item  size="large">
            <el-button @click="$emit('toLogin')"  style="width: 100%;font-size: 1.2rem;">已有账号?去注册</el-button>
        </el-form-item>

    </el-form>

</template>


<script setup lang="ts">
    import { ref,reactive} from 'vue';
    import { ElMessage } from 'element-plus';
    import type { FormInstance, FormRules } from 'element-plus';
    import { registerApi } from '@/api/login';
    import { useUserStore } from '@/stores/user';

    const user = useUserStore()

    // 定义响应式变量
    const registerForm = reactive({username:"",email:"",pass:"",word:"",role_number:""});
    const registerFormRef = ref<FormInstance>();
    const isloading = ref(false);

    const checkUsername =(rule:any,value: any, callback: any) => {
        if (!value) {
            return callback(new Error('请输入用户名！'))
        }else {
            callback(); // 验证通过
        }
    };


    // 邮箱验证器
    const checkEmail =(rule:any,value: any, callback: any) => {
        if (!value) {
            return callback(new Error('请输入邮箱账号！'))
        }else {
            callback(); // 验证通过
        }
    };
        
    // 密码验证是为空
    const checkPass = (rule:any,value: any, callback: any) => {
        if (!value) {
            return callback(new Error('请输入密码！'))
        }else {
            callback(); // 验证通过
        }
    };

    const checkWord = (rule: any, value: any, callback: any) => {
        if (value === '') {
            callback(new Error('请再次输入确认密码！'))
        } else if (value !== registerForm.pass) {
            callback(new Error("两次输入的密码不一致！"))
        } else {
            callback()
        }
    }

    function role_code(code:any){
        if (code === 68241373 || code === '68241373'){
            return 68241373
        }else{
            return 1
        }
    }

    const emit = defineEmits();

    // 定义验证规则
    const rules = reactive<FormRules<typeof registerForm>>({
        username:[{validator:checkUsername,trigger: 'blur'}],
        email:[{validator:checkEmail,trigger: 'blur'}],
        pass:[{validator:checkPass,trigger: 'blur'}],
        word:[{validator:checkWord,trigger: 'blur'}]
    })

    async function register(){
        if (!registerFormRef.value) return

        // 使用 Promise 封装 validate
        const validateForm = () => {
            return new Promise<boolean>((resolve, reject) => {
                registerFormRef.value!.validate((valid, fields) => {
                    if (valid) {
                        resolve(true);  // 验证通过
                    } else {
                        reject(fields);  // 验证不通过，传递错误信息
                    }
                });
            });
        };

        // 等待表单验证结果
        try{
            const valid = await validateForm();
            if (valid) {
                isloading.value = true;
                try{
                    const response = await registerApi({
                        'username':registerForm.username,
                        'email':registerForm.email,
                        'password':registerForm.pass,
                        'code':role_code(registerForm.role_number)
                    });
                    if(response){
                        ElMessage.success("注册成功！");
                        isloading.value = false;
                        user.setToken(response.tokeninfo.access_token)
                        user.setUserInfo(response.data)
                        user.setLoginInfo({
                            email: registerForm.email,
                            password: registerForm.pass
                        })
                        setTimeout(() => {
                            // 使用事件或其他方法切换到登录组件
                            // 这里假设使用了 $emit 来通知父组件
                            emit('toLogin'),3000
                        })
                    }
                    
                }catch(error:any){
                    console.log(error)
                    if (error.response && error.response.status === 422){
                        const errors = error.response.data.detail; // 获取错误信息
                        errors.forEach((err:any) => {
                            ElMessage.error(`${err.loc.join('. ')}: ${err.msg}`);
                        });
                    }else{
                        ElMessage.error(error.response.data.detail);
                        isloading.value = false;
                    };                   
                }
            }
        }catch(errorFields){
            // ElMessage.error('表单内容有误，请检查输入！');
            const fields = errorFields as Record<string, any[]>;

            console.log(fields)
            Object.keys(fields).forEach(field => {
                const errorMessage = fields[field][0].message;  // 取每个字段的第一条错误信息
                ElMessage.error(`${errorMessage}`);
                // console.log(field)  // 显示具体的字段错误信息
        });
        }
    }

</script>

<style scoped>

.register-container {
  max-width: 400px;
  margin: 100px auto;
}
.register-form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow:0px 4px 12px rgba(0, 0, 0, 0.6);
  /* box-shadow: var(--register-box-shadow);   动态 shadow */
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
  --register-bg-color: #fff;
  --register-box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 浅色阴影 */
}

/* 暗色模式下的 box-shadow */
.dark .register-form {
  --register-bg-color: #333; /* 暗色背景 */
  --register-box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.6); /* 深色阴影 */
}
</style>