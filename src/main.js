// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import FastClick from 'fastclick'
import App from './App'
import Vue from 'vue'
import store from './store/store'
import router from './router'
import CommonFooter from './components/common/CommonFooter'
import api from './axios/index'
import './assert/icon/iconfont.css'
import vconsole from './utils/vconsole' // vconsole移动端的调试利器
import './utils/directive'
import { LoadingPlugin, ToastPlugin, XHeader, Actionsheet, AjaxPlugin } from 'vux'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCropper from 'vue-cropper'

FastClick.attach(document.body) // 没有300ms的延迟
Vue.use(api)
Vue.use(store)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AjaxPlugin)
Vue.use(ElementUI)
Vue.use(VueCropper)

// 全局引入公共部分
Vue.component('CommonFooter', CommonFooter)
Vue.component('x-header', XHeader)
Vue.component('v-transfer-dom', Actionsheet)



Vue.config.productionTip = true

// 安装 vue-wechat-title，比如一个看文章的页面，这个 title 就是文章的标题，你事先无法知道用户获取的是那个文章。
// 参考：https://blog.csdn.net/Tomwildboar/article/details/82767000
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)
// 动态读取router中的meta，实现页面切换，标题切换的功能,但也要实现加载变量功能
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
