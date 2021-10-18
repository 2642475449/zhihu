import { createApp } from 'vue'
import Message from "@/components/Message.vue";
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  // 生成一个<div data-v-XXX></div>
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  console.log("mountNode",mountNode)
  //  挂载实例
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  },timeout)
}

export default createMessage;
