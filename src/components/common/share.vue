<template>

</template>

<script>
  import { querystring } from 'vux'
  import cookie from '../../../static/js/cookie'
  export default {
    created () {
      // 判断shareopenid, sharetime, url 是否存在
      let shareurl = typeof(this.$route.query.shareurl) !='undefined'?this.$route.query.shareurl:''
      let shareopenid = typeof(this.$route.query.shareopenid) !='undefined'?this.$route.query.shareopenid:''
      let sharetime = typeof(this.$route.query.sharetime) !='undefined'?this.$route.query.sharetime:''
      sessionStorage.setItem("shareurl", shareurl)
      sessionStorage.setItem("shareopenid", shareopenid)
      sessionStorage.setItem("sharetime", sharetime)
      if (shareopenid && sharetime && shareurl) {
        this.shareWechatAuth()
      }else{
        let url = window.location.href
        let domain = url.split("/#/")[0]
        window.location.href = domain
      }
    },
    methods: {
      shareWechatAuth: function () {
        // 跳转到这里进行更新个人信息
        if(cookie.getCookie('token')){
          window.location.href = sessionStorage.getItem("shareurl")
        }else{
          return this.$api.wechatAuth().then(res => {
            window.location.href = res.data.url
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
