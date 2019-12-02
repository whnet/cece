// 引入vue
import Vue from 'vue'
// 全局引入vueX
import Vuex from 'vuex'
// 全局引用cookie方法类
import cookie from '../../static/js/cookie'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

// 全局注册vueX
Vue.use(Vuex)

const userInfo = {
  token: cookie.getCookie('token') || '',
  openid: cookie.getCookie('openid') || ''
}
const state = {
  userInfo
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
