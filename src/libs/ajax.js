import axios from 'axios'

// 全局状态控制引入
import store from '../store/store'

let HOST
if (process.env.NODE_ENV === 'production') {
  // 数据请求接口
  HOST = 'http://api.putishu.ren'
} else {
  // HOST = 'http://127.0.0.1:8000/'
  //
  HOST = config.DOMAIN_HOST
}
const ajax = axios.create({
  baseURL: HOST,
  timeout: 30000
})
// 这个是携带上cookie 默认是不携带，如果携带后台就需要设置，并且也是不需要的， JWT需要在header中添加认证
axios.defaults.withCredentials = false
// http request 拦截器
ajax.interceptors.request.use(
  config => {
    if (store.state.userInfo.token) {
      config.headers.Authorization = `token ${store.state.userInfo.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// http response 拦截器
ajax.interceptors.response.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  })

export default ajax
