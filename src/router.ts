import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from "@/components/ColumnDetail.vue";
import CreatePost from "@/views/CreatePost.vue";
import store from "@/store";

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        redirectAlreadyLogin:true
      }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 没有登录的人访问部分页面将会跳转到 login 页面
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({name:'login'})
  // 已经登录的人访问部分页面将会跳转到 / 页面
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin){
    next('/')
  }else {
    // 直接访问
    next()
  }
})
export default router
