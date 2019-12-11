<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { wxShare } from './utils/wxTools'
  import { dateFormat } from 'vux'
  import cookie from '../static/js/cookie'
  export default {
    created () {
      // 获取进入程序的链接，已备判断进入的页面，分享的页面可以进去，排除掉 scrope 页面
      let href = window.location.href
      if(!href.includes("scrope")){
        sessionStorage.setItem("url", window.location.href)
      }
      // 把基础信息放到 这里
      if(cookie.getCookie('token')){
        // this.weixinShare()
        this.getUserInfo()
      }else{
        if (!href.includes("/?code")) {
          this.getWechatAuth()
        }
      }

      // // 微信分享配置
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
      //       'onMenuShareTimeline',
      //       'onMenuShareAppMessage',
      //     ]
      //   });
      // })

// //配置导航守卫
//       this.$router.beforeEach((to, from, next) => {
//         let shareInfo = {
//           img: 'http://vip.putishu.ren/static/images/default.jpg',
//           link: 'http://vip.putishu.ren',
//           title: '默认分享标题',
//           desc: '默认分享描述'
//         }
//         // 判断路由的跳转path， to代表将要跳转的路由对象，from代表跳转之前的路由对象
//         if (to.path === '/teacher/detail') {
//           console.log(this.detailtitle+'ceshi='+to.path)
//           shareInfo = {
//             img: 'http://vip.putishu.ren/static/images/default.jpg',
//             link: 'http://vip.putishu.ren',
//             title: '的菩提树：有困惑？有烦恼？就上菩提树！',
//             desc: '你真的与众不同'
//           }
//         } else if(to.path === 'play') {
//           shareInfo = {
//             img: 'http://vip.putishu.ren/static/images/default.jpg',
//             link: '',
//             title: '分享标题2',
//             desc: '分享描述2'
//           }
//         }
//         // 调用当前main.js中定义的分享方法，传递分享参数
//         this.wxShareReady(shareInfo);
//         // 调用next()方法放行，必须加上次方法，否则无法跳转
//         next()
//
//       })

    },
    methods: {
     wxShareReady: function (shareInfo){
          wx.ready(() => {
            wx.onMenuShareTimeline({
              title: shareInfo.title, // 分享标题
              link: shareInfo.link, // 分享链接
              imgUrl: shareInfo.img,
              desc: shareInfo.desc,
              success: function () {
              },
              cancel: function () {
              }
            })
            //分享到朋友圈
            wx.onMenuShareAppMessage({
              title: shareInfo.title, // 分享标题
              link: shareInfo.link, // 分享链接
              imgUrl: shareInfo.img,
              desc: shareInfo.desc,
              trigger: function (res) {
              },
              success: function (res) {
              },
              cancel: function (res) {
              },
              fail: function (res) {
              }
            })

            //分享到QQ
            wx.onMenuShareQQ({
              title: shareInfo.title, // 分享标题
              desc: shareInfo.desc, // 分享描述
              link: shareInfo.link, // 分享链接
              imgUrl: shareInfo.img, // 分享图标
              success: function () {
              },
              cancel: function () {
              }
            })
            //分享到微博
            wx.onMenuShareWeibo({
              title: shareInfo.title, // 分享标题
              desc: shareInfo.desc, // 分享描述
              link: shareInfo.link, // 分享链接
              imgUrl: shareInfo.imgUrl, // 分享图标
              success: function () {
              },
              cancel: function () {
              }
            })
          })
        },
      getUserInfo: function () {
        let id = cookie.getCookie('mid')
        if(id){
          return this.$api.userInfo(id).then(res => {
            this.userInfo = res.data
            if(res.data.teacher.id){
              cookie.setCookie('tid',res.data.teacher.id)
            }else{
              cookie.delCookie('tid')
            }
            this.nickname = res.data.nickname
            sessionStorage.setItem('avatar', res.data.avatar)
            sessionStorage.setItem('nickname', res.data.nickname)
          })
        }
      },
      getWechatAuth: function () {
        return this.$api.wechatAuth().then(res => {
          // 去换取 code res.data.url 为组装的url，然后跳转到 scrope中
          window.location.href = res.data.url
        })
      },
      weixinShare () {
        let url = window.location.href
        let domain = url.split("/#/")[0]
        let time = Math.round(new Date() / 1000)
        let openid = cookie.getCookie('openid')
        return this.$api.jssdk({'url':url}).then(res => {
          wxShare({
            title: '菩提树：你真的与众不同',
            link:  domain +'/#/share?shareopenid='+openid+'&sharetime='+time+'&shareurl='+encodeURIComponent(url),
            desc: '有困惑？就上菩提树！感受文化、分享智慧',
            imgUrl:'http://vip.putishu.ren/static/images/default.jpg',
            debug: false
          },res,function(){
              console.log('success')
          });
        })
      },
    }
  }
</script>
