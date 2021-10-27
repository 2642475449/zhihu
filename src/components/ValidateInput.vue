<template>
  <div class="validate-input-container pb-3">
<!--    @blur 是当元素失去焦点时触发的事件-->
    <input
      v-if="tag != 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs">

    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback position-absolute mt-1">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
  import {defineComponent, reactive, PropType, onMounted, watch, computed} from 'vue'
  import {emitter} from "@/components/ValidateForm.vue";

  // 校验规则是组件内置的，外部只输入一个符合RulesProp的数据，其他工作交给组件内部处理
  const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  /**
   *  RuleProp Rules can be extended in type
   *  PS： `validator` is can customize
   */
  interface RuleProp {
    type: 'required' | 'email' | 'custom'
    message?: string,
    validator?: () => boolean;
  }

  // 这里导出RulesProp，因为外部在使用该组件的时候要提交符合RulesProp的数据，所以把接口规范导出
  export type RulesProp = RuleProp[]
  export type TagType = 'input' | 'textarea'
  export default defineComponent({
    name: 'ValidateInput',
    props: {
      rules: Array as PropType<RulesProp>,
      modelValue: String,
      tag: {
        type: String as PropType<TagType>,
        default: 'input'
      }
    },

    inheritAttrs: false,
    setup(props, context) {
      const inputRef = reactive({
        val: computed({
          get: () => props.modelValue || '',
          set: val => {
            context.emit('update:modelValue',val)
          }
        }),
        error: false,
        message: ''
      })



      //  input格式验证
      const validateInput = () => {
        if (props.rules) {
          console.log("props.rules",props.rules)
          const allPassed = props.rules.every(rule => {
            let passed = true
            inputRef.message = rule.message || ''

            switch (rule.type) {
              // 非空检验
              case 'required' :
                passed = (inputRef.val.trim() != '')
                break
              // 邮箱格式检验
              case 'email':
                passed = emailReg.test(inputRef.val)
                break
              case 'custom':
                passed = rule.validator ? rule.validator() : true;
                break
              default:
                break
            }
            return passed
          })

          inputRef.error = !allPassed
          return allPassed;
        }
        return true
      }

      onMounted(() => {
        //  发送数据到自定义事件
        emitter.emit('form-item-created', validateInput)
      })
      return {
        inputRef,
        validateInput,
      }
    }
  })
</script>
