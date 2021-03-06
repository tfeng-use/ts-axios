import { AxiosRequestConfig } from '../types/index'
import { deepMerge } from '../helpers/util'

// config2存在就用config2的，否则就用config1
let strat = [
  'method',
  'timeout',
  'transformRequest',
  'transformResponse',
  'withCredentials',
  'xsrfCookieName',
  'xsrfHeaderName',
  'onDownloadProgress',
  'onUploadProgress',
  'auth',
  'validateStatus',
  'paramsSerializer',
  'baseURL'
]
// 只用config2的属性
let strat2 = ['url', 'params', 'data', 'cancelToken']

let keys = strat.concat(strat2)

// 对应strat的合并策略，只针对val
function defaultStart(val1: any, val2: any) {
  return val2 !== undefined ? val2 : val1
}

// 对应strat2的合并策略
function defaultStart2(val1: any, val2: any) {
  if (val2 !== undefined) {
    return val2
  }
}

// 合并配置 config1为默认config，config2为传入的设置
export function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  // 为config2设置初始值
  if (!config2) {
    config2 = {}
  }
  let result = Object.create(null)
  // 缓存策略的对象
  let strats = Object.create(null)
  strat.forEach((key: string) => {
    strats[key] = defaultStart
  })

  strat2.forEach((key: any) => {
    strats[key] = defaultStart2
  })
  // 遍历config2中的属性
  for (let key in config2) {
    if (keys.includes(key) && strats[key]) {
      result[key] = strats[key](config1[key], config2[key])
    }
  }
  // 再遍历config1中的属性，主要是判断start对应的情况
  for (let key in config1) {
    if (keys.includes(key) && !result[key] && strats[key]) {
      result[key] = strats[key](config1[key], config2[key])
    }
  }
  // 合并headers
  result.headers = deepMerge(config1.headers, config2 && config2.headers)
  return result
}
