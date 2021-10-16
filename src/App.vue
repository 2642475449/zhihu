<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <loader v-if="isLoading" text="读取中请稍后..." ></loader>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted} from 'vue'
  // vuex是全局状态
  import { useStore } from 'vuex'
  import 'bootstrap/dist/css/bootstrap.min.css'
  import GlobalHeader from './components/GlobalHeader.vue'
  import GlobalFooter from "@/components/GlobalFooter.vue";
  import Loader from "@/components/Loader.vue";
  import { GlobalDataProps } from "@/store";
  import axios from "axios";

  export default defineComponent({
    name: 'App',
    components: {
      GlobalHeader,
      GlobalFooter,
      Loader
    },

    setup() {
      const store = useStore<GlobalDataProps>();
      const currentUser = computed(() => store.state.user)
      const  isLoading  = computed(() => store.state.loading)
      const token = computed( () => store.state.token)
      onMounted(()=> {
        if (!currentUser.value.isLogin && token.value) {
          axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
          store.dispatch('fetchCurrentUser')
        }
      })
      return {
        currentUser,
        isLoading
      }
    }
  })
</script>

<style>

</style>
