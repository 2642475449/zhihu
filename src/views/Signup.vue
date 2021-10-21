<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">用户名</label>
        <validate-input
          v-model="formData.nickName"
          placeholder="请输入昵称"
          :rules="nameRules"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          placeholder="请输入密码"
          v-model="formData.password"
          :rules="passWordRules"
          type="password"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">确定密码</label>
        <validate-input
          placeholder="请输入确定密码"
          v-model="formData.repeatPassword"
          :rules="repeatPasswordRules"
          type="password"
        ></validate-input>
      </div>

    </validate-form>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, reactive} from 'vue'
  import ValidateForm from "@/components/ValidateForm.vue";
  import ValidateInput, {RulesProp} from "@/components/ValidateInput.vue";

  import { useStore } from 'vuex'
  import axios from "axios";
  import router from "@/router";
  import createMessage from "@/components/createMessage";


  export default defineComponent({
    components:{
      ValidateForm,
      ValidateInput
    },
    setup() {

      const store = useStore();
      /**
       *  FormType
       *  PS：If there is a large amount of data in a form, replace the `ref` definition with `reactive`
        */
      const formData = reactive({
        email: '',
        nickName: '',
        password: '',
        repeatPassword: ''
      })

      /**
       *  FormRules
        */
      const emailRules: RulesProp = [
        { type: 'required', message:'电子邮箱地址不能为空' },
        { type: 'email', message:'请输入正确的电子邮箱格式' }
      ]
      const nameRules: RulesProp = [
        {type: 'required', message: '昵称不能为空'}
      ]
      const passWordRules: RulesProp = [
        { type: 'required', message: '密码不能为空'}
      ]
      const repeatPasswordRules: RulesProp = [
        { type: 'required', message: '重复密码不能为空'},
        { type: 'custom',
          validator: () => {
          return formData.password == formData.repeatPassword
          },
          message: '密码不相同'
        }
      ]

      /**
       * formSubmit
       */
      const onFormSubmit = async (result: boolean) => {
        if (result) {
          //  user SignUp form
          const payload = {
            email: formData.email,
            nickName: formData.nickName,
            password: formData.password
          }
          axios.post('/users', payload).then(data => {
            createMessage('注册成功 正在跳转登录页面', 'success')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          }).catch(e => {
            console.log(e)
          })
        }
      }

      return{
        formData,

        //  Rules
        emailRules,
        nameRules,
        passWordRules,
        repeatPasswordRules,

        //  formSubmit
        onFormSubmit
      }
    }



  })

</script>

<style>
  .w-330 {
    max-width: 330px;
  }
</style>
