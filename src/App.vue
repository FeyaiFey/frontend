<script setup lang="ts">
import { useUserStore } from './stores/user';
import { ref } from 'vue';

const user = useUserStore()


const token = ref(user.token)
const userInfo = ref(user.userInfo)
const userRouter = ref(user.roleRouters)

function ab(){
  user.setToken("dasdasdasdasd")
  token.value = "dasdasdasdasd"
}

function bc(){
  user.clearToken()
  token.value = ""
}

function cd(){
  user.setUserInfo({"username":"dadsa","rolename":"dsad"})
  userInfo.value = user.userInfo
}

function de(){
  enum routers {
    Router1 = "abcs",
    Router2 = "123"
  }
  user.setRoleRouters(routers)
  userRouter.value = user.roleRouters
}

</script>

<template>
  <h1>{{ token }}</h1>
  <h1>{{ userInfo }}</h1>
  <h1>{{ userRouter }}</h1>
  <button v-on:click="ab"> 点击我设置状态 </button>
  <button v-on:click="bc"> 点击我设置状态 </button>
  <button v-on:click="cd"> 点击我设置状态 </button>
  <button v-on:click="de"> 点击我设置状态 </button>

</template>

<style scoped>

</style>
