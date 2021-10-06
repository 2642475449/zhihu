<template>
  <div class="login-page">
    <h4>新建文章</h4>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="emailRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref} from 'vue'
  import {useRouter} from 'vue-router'
  import {useStore} from 'vuex'
  import {GlobalDataProps, PostProps} from "@/store";
  import ValidateInput, {RulesProp} from '../components/ValidateInput.vue'
  import ValidateForm from '../components/ValidateForm.vue'
  import router from "@/router";

  export default defineComponent({
    name: 'CreatePost',
    components: {
      ValidateInput,
      ValidateForm
    },
    setup() {
      const titleVal = ref('')
      const store = useStore<GlobalDataProps>();
      const emailRules: RulesProp = [
        {type: 'required', message: '文章标题不能为空'},
      ]
      const contentVal = ref('')
      const contentRules: RulesProp = [
        {type: 'required', message: '文章详情不能为空'}
      ]
      const onFormSubmit = (result: boolean) => {
        if (result) {
          const {columnId} = store.state.user
          const newPost: PostProps = {
            id: new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            columnId,
            createdAt: new Date().toLocaleString()
          }
          //  提交
          store.commit('createPost', newPost)
          //  跳转到详情页
          router.push({name: 'column', params: {id: columnId}})
        }
      }
      return {
        emailRules,
        titleVal,
        contentVal,
        contentRules,
        onFormSubmit
      }
    }
  })
</script>

