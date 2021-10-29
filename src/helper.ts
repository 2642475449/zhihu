import { ColumnProps, ImageProps, UserProps } from './store'

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

interface TestProps {
  _id:string;
  name:string;
}

const testData: TestProps[] = [{_id:'1',name:'a'},{_id:'2', name:'b'}]


const testData2: {[key: string]: TestProps} = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}

/**
 * 数据转对象工具
 * reduce(数组的一个累加器) 它接收两个参数
 * 1：function(之前的结果,当前值)
 * 2：初始值
 * 如果 current._id 是存在中进行累加
  */
export const arrToObj = <T extends {_id?:string}>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id)
    {
      prev[current._id] = current
    }
    return prev}, {} as { [key:string]: T})
}
export const objToArr = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}

const result = arrToObj(testData)
console.log(result)



const result2 = objToArr(testData2)
console.log(result2)
