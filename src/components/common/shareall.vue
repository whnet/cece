<template>
</template>

<script>
  import cookie from '../../../static/js/cookie'
  export default {
    created () {
      this.sharedif(this.$route.name)
    },
    methods: {
      sharedif: function(name){
        let url = window.location.href
        let domain = url.split("/#/")[0]
        let time = Math.round(new Date() / 1000)
        let openid = cookie.getCookie('openid')
        this.$api.jssdk({'url':url}).then(res => {
          wx.config({
            debug: false,
            appId: res.data.result.appId,
            timestamp: res.data.result.timestamp,
            nonceStr: res.data.result.nonceStr,
            signature: res.data.result.signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
            ]
          });
        })
        let shareInfo = {
          img: domain +'/static/images/default.jpg',
          link: domain +'/#/share?shareopenid='+openid+'&sharetime='+time+'&shareurl='+encodeURIComponent(url),
          title: '菩提树：你真的与众不同',
          desc: '有困惑？就上菩提树！感受文化、分享智慧'
        }
        // 判断路由的跳转path， to代表将要跳转的路由对象，from代表跳转之前的路由对象
        this.wxShareReady(shareInfo);

      },
      wxShareReady: function (shareInfo){
        wx.ready(() => {
          wx.onMenuShareTimeline({
            title: shareInfo.title,
            link: shareInfo.link,
            imgUrl: shareInfo.img,
            desc: shareInfo.desc,
          })
          //分享到朋友圈
          wx.onMenuShareAppMessage({
            title: shareInfo.title,
            link: shareInfo.link,
            imgUrl: shareInfo.img,
            desc: shareInfo.desc,
          })

        })
      },
    }
  }
</script>

<style scoped>

</style>
