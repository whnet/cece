<template>
<!--授权跳转，获得code-->
  <div>
    <p>微信授权获得信息中...</p>
  </div>
</template>

<script>
import { querystring } from 'vux'
import cookie from '../../../static/js/cookie'
export default {
  name: 'Scrope',
  data () {
    return {
      code: this.$route.query.code
    }
  },
  created () {
      this.common()
  },
  mounted(){
    this.common()
  },
  methods: {
    common(){
      let href = window.location.href;
      if (href.includes("/?code")) {
        let code = href.split("/?code=")[1].split("&")[0]
        let sharetime = sessionStorage.getItem("sharetime")
        let shareurl = sessionStorage.getItem("shareurl")
        let shareopenid = sessionStorage.getItem("shareopenid")
        this.getWechatInfo({
          'code': code,
          'shareopenid': shareopenid?shareopenid:'',
          'sharetime': sharetime?sharetime:'',
          'shareurl': shareurl?shareurl:'',
        })
      }
    },
    getWechatInfo: function (params) {
      let that = this
      let defaultUrl = 'http://vip.putishu.ren'
      let time = 3600*24*7
      return that.$api.wechatInfo(params).then(res => {
        if(res.data.msg == 100){
          cookie.setCookie('token', res.data.result.token, time)
          cookie.setCookie('mid', res.data.result.mid, time)
          cookie.setCookie('openid', res.data.result.openid, time)
          sessionStorage.setItem('avatar', res.data.result.avatar)
          that.$store.dispatch('setInfo')
          if(sessionStorage.getItem("shareurl") != 'undefined' && sessionStorage.getItem("shareurl") != ''){
            window.location.href = sessionStorage.getItem("shareurl")
          }else if(sessionStorage.getItem("url")){
            window.location.href = sessionStorage.getItem("url")
          }else{
            window.location.href = 'http://vip.putishu.ren'
          }
        }else{
          window.location.href = 'http://vip.putishu.ren'
        }
      }).catch(err => {
        return err
      })
    }
  }
}
</script>

<style scoped>

</style>
