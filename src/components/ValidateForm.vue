<template>
  <form class="validate-form-container">
    <!--      插槽-->
    <slot name="default"></slot>
    <!--      按钮-->
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
  import {defineComponent, onUnmounted} from 'vue'
  import mitt from 'mitt'
  import ValidateInput from "@/components/ValidateInput.vue";

  type ValidateFunc = () => boolean
  // 监听器
  // 第一步 定义一个 events 类型
  // 这个定义是让事件和对应的 callback 一一对应
  type Events = { 'form-item-created': ValidateFunc }
  // 第二步 实例化 mitt 的时候，作为泛型传递进去
  export const emitter = mitt<Events>()
  export default defineComponent({
    name: 'ValidateForm',
    emits: ['form-submit'],
    setup(props, context) {
      let funcArr: ValidateFunc[] = []
      const submitForm = () => {
        const result = funcArr.map(func => func()).every(result => result)
        context.emit('form-submit', result)
      }
      // 解释：这个 string 和 callback 里面的参数是对应的，callback 是这样的
      const callback = (func: ValidateFunc) => {
        if (func) {
          funcArr.push(func)
        }
      }
      //  接收
      //  定义一个 events 类型
      //  这个定义是让事件和对应的 callback 一一对应
      emitter.on('form-item-created', callback)
      onUnmounted(() => {
        emitter.off('form-item-created', callback)
        funcArr = []
      })
      return {
        submitForm
      }
    }
  })
</script>
