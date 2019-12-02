<template>

</template>

<script>
  import { querystring } from 'vux'
  import cookie from '../../../static/js/cookie'
  export default {
    created () {
      let token = cookie.getCookie('token')
      // 判断shareopenid, sharetime, url 是否存在
      let url = window.location.href?decodeURIComponent(window.location.href):''
      let shareopenid = typeof(this.$route.query.shareopenid) != 'undefined'?this.$route.query.shareopenid:''
      let sharetime = typeof(this.$route.query.sharetime) != 'undefined'?this.$route.query.sharetime:''

      if (shareopenid && sharetime && url) {
        sessionStorage.setItem("shareurl", url);
        sessionStorage.setItem("shareopenid", shareopenid);
        sessionStorage.setItem("sharetime", sharetime);
        this.shareWechatAuth()
      }else{
        sessionStorage.setItem("shareurl", '');
        sessionStorage.setItem("shareopenid", '');
        sessionStorage.setItem("sharetime", '');
        window.location.href = '/'
      }
    },
    methods: {
      shareWechatAuth: function () {
        return this.$api.wechatAuth().then(res => {
          window.location.href = res.data.url
        }).catch(err => {
          return err
        })
      },
    }
  }
</script>

<style scoped>

</style>
