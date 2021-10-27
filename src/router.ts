import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from "@/components/ColumnDetail.vue";
import CreatePost from "@/views/CreatePost.vue";
import Signup from "@/views/Signup.vue";
import PostDetail from "@/views/PostDetail.vue";
import store from "@/store";
import axios from "axios";

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
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'posts',
      component: PostDetail,
      meta: {
        requiredLogin: false
      }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        requiredLogin: false
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // // 没有登录的人访问部分页面将会跳转到 login 页面
  // if (to.meta.requiredLogin && !store.state.user.isLogin) {
  //   next({name: 'login'})
  //   // 已经登录的人访问部分页面将会跳转到 / 页面
  // } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
  //   next('/')
  // } else {
  //   // 直接访问
  //   next()
  // }

  const { user, token} = store.state;
  /**
   * requiredLogin=true指的是访问此路由的前提是已登陆，比如访问新建文章页面时，如果未登录将跳转到登录页面
   * redirectAlreadyLogin=true指得是当前状态是已登陆状态的时候，访问此路由时需要重定向到其他路由，比如当前已经登陆，再访问登录页面需要重定向到首页
   */
  const { requiredLogin, redirectAlreadyLogin} = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        localStorage.removeItem('token')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }

  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }

})
export default router
