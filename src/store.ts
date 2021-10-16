import { createStore, Commit} from 'vuex'
import axios from "axios";


export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?:string;
  image?: ImageProps;
  column: string;
  createdAt: number;
}
export interface GlobalDataProps {
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

/**
 * 抽象 actions 方法
 * @param url 链接
 * @param mutationName mutation的名称
 * @param commit
 * async异步方法 await
 */
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}

/**
 *
 * @param url 链接
 * @param mutationName mutation的名称
 * @param commit
 * @param payload 参数
 * @constructor
 */
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data;
}


const store = createStore<GlobalDataProps>({
  // 应用层级状态
  state: {
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  // 更改 Vuex 的 store 中的状态的唯一方法
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'viking' }
    // },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    /**
     * 得到全部专栏信息
     * @param state 全局状态
     * @param rawData 请求后的结果
     */
    fetchColumns(state, rawData) {
      console.log('rawData',rawData)
      state.columns = rawData.data.list
    },
    /**
     * 输入专栏id得到专栏信息
     * @param state 全局状态
     * @param rawData 请求后的结果
     */
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    /**
     * 输入帖子id得到帖子信息
     * @param state 全局状态
     * @param rawData 请求后的结果
     */
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list

    },
    setLoading(state,status) {
      state.loading = status
    },
    /**
     * 登录
     * @param state
     * @param rawData
     */
    login: function (state, rawData) {
      const {token} = rawData.data
      state.token = token
      //  配置持久化
      localStorage.setItem('token',token)
      // 登录时配置全局默认设置 token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    /**
     * 得到用户信息
     * @param state
     * @param rawData
     */
    fetchCurrentUser(state, rawData) {
      state.user = {isLogin: true, ...rawData.data}
    }
  },

  actions: {
    fetchColumns({commit}) {
      console.log('commit:',commit)
      getAndCommit('/columns','fetchColumns',commit)
    },
    fetchColumn({ commit },columnId) {
      getAndCommit(`/columns/${columnId}`,'fetchColumn',commit)

    },
    /**
     * 得到用户信息
     * @param commit
     */
    fetchCurrentUser({commit}) {
      getAndCommit('/user/current','fetchCurrentUser', commit)
    },
    fetchPosts({ commit },columnId) {
      getAndCommit(`/columns/${columnId}/posts`,'fetchPosts',commit)
    },
    /**
     * 登录
     * @param commit
     * @param payload
     */
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return  dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {

      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
