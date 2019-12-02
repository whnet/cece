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
      let url = window.location.href
      let domain = url.split("/#/")[0]
      let time = dateFormat(new Date(), 'YYYYMMDDHHmmss')
      let openid = cookie.getCookie('openid')
      let shareurl = domain + '/#/share?openid='+openid+'&sharetime='+time
      this.weixinShare();
    },
    methods: {
      weixinShare () {
        let shareurl = 'http://vip.putishu.ren'
        let url = window.location.href
        let domain = url.split("/#/")[0]
        let time = Math.round(new Date() / 1000)
        let openid = cookie.getCookie('openid')
        return this.$api.jssdk({'url':url}).then(res => {
          wxShare({
            title: '菩提树：你真的与众不同',
            link:  shareurl +'/#/share?shareopenid='+openid+'&sharetime='+time+'&url='+encodeURIComponent(url),
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
