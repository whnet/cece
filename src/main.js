// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import FastClick from 'fastclick'
import App from './App'
import Vue from 'vue'
import store from './store/store'
import router from './router'
import CommonFooter from './components/common/CommonFooter'
import shareall from './components/common/shareall'
import sharenone from './components/common/sharenone'
import api from './axios/index'
import './assert/icon/iconfont.css'
import vconsole from './utils/vconsole' // vconsole移动端的调试利器
import './utils/directive'
import { LoadingPlugin, ToastPlugin, XHeader, Actionsheet, AjaxPlugin } from 'vux'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCropper from 'vue-cropper'
import wx from 'weixin-js-sdk'
Vue.prototype.$wx = wx

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
Vue.component('shareall', shareall)
Vue.component('sharenone', sharenone)
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

// 微信分享配置
// let url = window.location.href
// this.$api.jssdk({'url':url}).then(res => {
//   wx.config({
//     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//     appId: res.data.result.appId, // 必填，公众号的唯一标识
//     timestamp: res.data.result.timestamp, // 必填，生成签名的时间戳
//     nonceStr: res.data.result.nonceStr, // 必填，生成签名的随机串
//     signature: res.data.result.signature,// 必填，签名，见附录1
//     // 必填，需要使用的JS接口列表，所有JS接口列表见官方js接口
//     // 这里配置获取地理位置所需要的接口权限
//     jsApiList: [
//       'checkJsApi',
//       'onMenuShareWeibo',
//       'onMenuShareTimeline',
//       'onMenuShareAppMessage',
//       'onMenuShareQQ'
//     ]
//   });
// })
// 定义分享方法
// function wxShareReady(shareInfo) {
//   console.log(32123)
//   wx.ready(() => {
//     wx.onMenuShareTimeline({
//       title: shareInfo.title, // 分享标题
//       link: shareInfo.link, // 分享链接
//       imgUrl: shareInfo.img,
//       desc: shareInfo.desc,
//       success: function () {
//       },
//       cancel: function () {
//       }
//     })
//     //分享到朋友圈
//     wx.onMenuShareAppMessage({
//       title: shareInfo.title, // 分享标题
//       link: shareInfo.link, // 分享链接
//       imgUrl: shareInfo.img,
//       desc: shareInfo.desc,
//       trigger: function (res) {
//       },
//       success: function (res) {
//       },
//       cancel: function (res) {
//       },
//       fail: function (res) {
//       }
//     })
//
//     //分享到QQ
//     wx.onMenuShareQQ({
//       title: shareInfo.title, // 分享标题
//       desc: shareInfo.desc, // 分享描述
//       link: shareInfo.link, // 分享链接
//       imgUrl: shareInfo.img, // 分享图标
//       success: function () {
//       },
//       cancel: function () {
//       }
//     })
//     //分享到微博
//     wx.onMenuShareWeibo({
//       title: shareInfo.title, // 分享标题
//       desc: shareInfo.desc, // 分享描述
//       link: shareInfo.link, // 分享链接
//       imgUrl: shareInfo.imgUrl, // 分享图标
//       success: function () {
//       },
//       cancel: function () {
//       }
//     })
//   })
// }
// //配置导航守卫
// router.beforeEach((to, from, next) => {
//   let shareInfo = {
//     img: 'http://vip.putishu.ren/static/images/default.jpg',
//     link: '',
//     title: '默认分享标题',
//     desc: '默认分享描述'
//   }
//   // 判断路由的跳转path， to代表将要跳转的路由对象，from代表跳转之前的路由对象
//   if (to.path === '/share') {
//     shareInfo = {
//       img: 'http://vip.putishu.ren/static/images/default.jpg',
//       link: '',
//       title: '分享标题1',
//       desc: '分享描述1'
//     }
//   } else if(to.path === 'play') {
//     shareInfo = {
//       img: 'http://vip.putishu.ren/static/images/default.jpg',
//       link: '',
//       title: '分享标题2',
//       desc: '分享描述2'
//     }
//   }
//   // 调用当前main.js中定义的分享方法，传递分享参数
//   wxShareReady(shareInfo);
//
//   // 调用next()方法放行，必须加上次方法，否则无法跳转
//   next()
//
// })
