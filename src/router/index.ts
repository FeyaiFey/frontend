import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/AssyHistory/AssyHistory.vue')
    },

  ]
})

export default router




// import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import { useAuthStore } from '@/stores/auth';
// import Layout from '@/views/Layout.vue';
// import Login from '@/views/Login.vue';
// import Home from '@/views/Home.vue';

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/',
//     component: Layout,
//     children: [
//       {
//         path: '',
//         name: 'Home',
//         component: Home
//       }
//     ],
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login
//   }
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// // 路由守卫，检查 token
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   if (to.meta.requiresAuth && !authStore.isTokenValid()) {
//     next({ name: 'Login' });  // 没有 token 则重定向到 Login 页面
//   } else if (to.name === 'Login' && authStore.isTokenValid()) {
//     next({ name: 'Home' });  // 如果已登录，重定向到首页
//   } else {
//     next();  // 否则正常进入目标路由
//   }
// });

// export default router;
