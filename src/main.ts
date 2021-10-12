import { createApp } from 'vue'
import axios from "axios";
import App from './App.vue'
import store from "@/store";
import router from "@/router";

axios.defaults.baseURL = 'http://apis.imooc.com/api/'

axios.interceptors.request.use(config => {
  config.params = {...config.params, icode: 'B6967281BC50E354'}
  return config
})

//  请求拦截器
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})

//  响应拦截器
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
