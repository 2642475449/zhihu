<template>
  <uploader action="/upload" :before-upload="beforeUpload" @file-uploaded="onFileUploaded">

    <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" width="500">
    </template>
  </uploader>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import {GlobalDataProps, ResponseType, ImageProps, ColumnProps} from '../store'
  import Uploader from "@/components/Uploader.vue";
  import ColumnList from '../components/ColumnList.vue'
  import createMessage from "@/components/createMessage";

  export default defineComponent({
    name: 'Home',
    components: {
      ColumnList,
      Uploader
    },
    setup() {
      const store = useStore<GlobalDataProps>()
      onMounted(() => {
        store.dispatch('fetchColumns')
      })

      // const list = computed(() => store.state.columns)
      const list = computed(() => store.getters.getColumns)

      //上传检查
      const beforeUpload = (file: File) => {
        const isImage = file.type == 'image/jpeg' || file.type == 'image/png'
        if (!isImage) {
          createMessage('上传图片只能是 JPG 与 PNG 格式','error')
        }
        return isImage
      }

      const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
        createMessage(`上传图片ID ${rawData.data._id}`,'success')
      }


      return {
        list,
        beforeUpload,
        onFileUploaded
      }
    }
  })
</script>
