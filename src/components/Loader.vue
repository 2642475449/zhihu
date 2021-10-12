<template>
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
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
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
      }
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
