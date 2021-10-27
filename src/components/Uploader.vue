<template>
    <div class="file-upload">
      <div class="file-upload-container" @click="triggerUpload" v-bind="$attrs">
<!--        具名插槽-->
        <slot v-if="fileStatus == 'loading'" name="loading">
        </slot>
<!--        作用域插槽:访问子组件中才有的数据-->
        <slot v-else-if="fileStatus == 'success'" name="uploaded" :uploadedData="uploadedData"></slot>
        <slot v-else name="default">
          <button class="btn btn-primary">点击上传</button>
        </slot>

      </div>
      <input
        type="file"
        class="file-input d-none"

        ref="fileInput"
        @change="handleFileChange"
      >
    </div>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, watch} from 'vue'
  import axios from "axios";
  import {PostProps} from "@/store";

  type UploaderStatus = 'ready' | 'loading' | 'success' | 'error'
  type CheckFunction = (file: File) => boolean;
  export default defineComponent({
    name: 'Uploader',
    //  定义父组件传递给子组件数据类型
    props: {
      action: {
        type: String,
        required: true
      },
      beforeUpload: {
        type: Function as PropType<CheckFunction>
      },
      uploaded: {
        type: Object
      }

    },
    inheritAttrs: false,
    //  事件
    emits: ['file-uploaded', 'file-uploaded-error'],
    //  props是一个对象，包含父组件传递给子组件的所有数据
    setup(props, context) {
      const fileInput = ref<null | HTMLInputElement>(null)
      const fileStatus = ref<UploaderStatus>(props.uploaded ? 'success' : 'ready')
      const uploadedData = ref(props.uploaded)
      watch(() => props.uploaded, (newValue) => {
        if (newValue) {
          fileStatus.value = 'success'
          uploadedData.value = newValue
        }
      })
      // trigger(触发) input 中绑定 fileInput
      const triggerUpload = () => {
        if (fileInput.value) {
          fileInput.value.click()
        }
      }

      /**
       *  图片上传事件
       */
      const handleFileChange = (e: Event) => {
        const currentTarget = e.target as HTMLInputElement
        if (currentTarget.files) {
          const files = Array.from(currentTarget.files)
          if (props.beforeUpload) {
            const result = props.beforeUpload(files[0]);
            if (!result) {
              return
            }
          }
          fileStatus.value = 'loading'


          const formData = new FormData()
          formData.append('file', files[0])
          axios.post(props.action, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((resp: any)  => {
            fileStatus.value = "success"
            console.log('resp.data',resp.data)
            uploadedData.value = resp.data
            context.emit('file-uploaded', resp.data)
          }).catch((error) => {
            fileStatus.value = 'error'
            context.emit('file-uploaded-error', {error})
          }).finally(() => {
            if (fileInput.value) {
              fileInput.value.value = ''
            }
          })
        }
      }

      //  删除
      const deleted = () => {
        fileStatus.value = 'ready'
      }


      return {
        fileInput,
        triggerUpload,
        fileStatus,
        handleFileChange,
        uploadedData,
        deleted,
      }
    }
  })
</script>

<style scoped>

</style>
