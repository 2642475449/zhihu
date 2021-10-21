import {createApp} from 'vue'
import axios from "axios";
import App from './App.vue'
import store from "@/store";
import router from "@/router";

axios.defaults.baseURL = 'http://apis.imooc.com/api/';



//  请求拦截器
axios.interceptors.request.use(config => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: 'B6967281BC50E354' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'B6967281BC50E354')
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: 'B6967281BC50E354' }

  }
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: ''})

  return config
})




//  响应拦截器
axios.interceptors.response.use(config => {
  setTimeout(() => {
    store.commit('setLoading', false)
  })

  return config
},e => {
  const {error} = e.response.data
  console.log("error",error)
  store.commit('setError', { status: true, message: error})
  store.commit('setLoading',false)
  return Promise.reject(error)
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
