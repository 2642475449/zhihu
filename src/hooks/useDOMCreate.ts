import {onUnmounted} from 'vue'

/**
 * 工具类：节点的创建与删除
 * 如果是两个即两个以上页面的共有功能就需要创建工具方法
 * @param nodeId
 */
function useDOMCreate(nodeId: string) {
  // document 功能可以将 teleport 中的内容添加在根标签中和在 index.html 中添加类似
  const node = document.createElement('div');
  node.id = nodeId
  document.body.appendChild(node);
  onUnmounted(() => {
    //  删除节点
    document.body.removeChild(node)
  } )
}

export default useDOMCreate;
