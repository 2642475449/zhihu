<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag != 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs">

    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback position-absolute mt-1">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
  import {defineComponent, reactive, PropType, onMounted} from 'vue'
  import {emitter} from "@/components/ValidateForm.vue";

  // 校验规则是组件内置的，外部只输入一个符合RulesProp的数据，其他工作交给组件内部处理
  const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  // RuleProp的规则是可以在type里拓展的，目前只进行了非空和邮箱格式的校验
  interface RuleProp {
    type: 'required' | 'email' | 'range',
    message?: string,
    validator?: () => boolean,
    min?: { length: number, message: string },
    max?: { length: number; message: string }
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
        val: props.modelValue || '',
        error: false,
        message: ''
      })
      const updateValue = (e: KeyboardEvent) => {

        const targetValue = (e.target as HTMLInputElement).value
        inputRef.val = targetValue
        context.emit('update:modelValue', targetValue)
      }
      const validateInput = () => {
        if (props.rules) {
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
              // 密码格式检验
              case 'range':
                if (inputRef.val.length < 6) {
                  passed = false
                  inputRef.message = '密码格式错误'
                }
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
        updateValue
      }
    }
  })
</script>
