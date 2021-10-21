<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">降蓝专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my2">登陆</router-link> </li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my2">注册</router-link> </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`你好 ${user.nickName}`">
          <dropdown-item><router-link to="/create" class="dropdown-item">新建文章</router-link> </dropdown-item>
          <dropdown-item disabled><a href="#" class="dropdown-item">编辑资料</a> </dropdown-item>
          <dropdown-item><a href="#" @click="loginOut" class="dropdown-item">退出登陆</a> </dropdown-item>
        </dropdown>
      </li>
    </ul>

  </nav>

</template>

<script lang="ts">
  import {computed, defineComponent, PropType} from 'vue'
  import Dropdown from "@/components/Dropdown.vue";
  import DropdownItem from "@/components/DropdownItem.vue";
  import createMessage from "@/components/createMessage";
  import store, {GlobalDataProps, UserProps} from "@/store";
  import axios from "axios";
  import router from "@/router";
  import {useStore} from "vuex";


  export default defineComponent({
    name: 'ClobalHeader',
    components: {
      Dropdown,
      DropdownItem
    },
    props: {
      user: {
        type: Object as PropType<UserProps>,
        required: true
      }
    },


    setup () {
      const store = useStore();
      const loginOut = () => {
        store.commit('logout')
      }
      return {
        loginOut
      }
    }
  })
</script>

