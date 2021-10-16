<template>
  <teleport to="#back">
  <div
    class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
    :style="{backgroundColor: background || ''}"
  >
    <div class="loading-content">
      <div class="spinner-border text-primary" role="status">
      </div>
      <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
  </div>
  </teleport>
</template>

<script lang="ts">
  import { defineComponent, onUnmounted } from 'vue'
  export default defineComponent({
    name: 'Loader',
    props: {
      text: {
        type:String,
        required: true
      },
      background: {
        type:String,
        required: true
      },
    },
    setup()  {
      // document 功能可以将 teleport 中的内容添加在根标签中和在 index.html 中添加类似
      const node = document.createElement('div');
      node.id = 'back'
      document.body.appendChild(node);
      onUnmounted(() => {
        //  删除节点
        document.body.removeChild(node)
      } )
    }
  })
</script>

<style scoped>
.loading-container  {
  background: rgba(255,255,255, .5);
  z-index: 100;
  position: fixed;

  top:0;
  left: 0;
}
  .loading-container{
    text-align: center;
  }
</style>
