<template>
  <div>
    <div class="pagewidth login_box">
      <div class="login_banner" @click="$router.push('/')"><i class="login_logo"></i></div>
      <ul class="shuru">
        <li>
          <i class="username_ico"></i>
          <input placeholder="请填写手机号/邮箱地址" v-model="username" class="login-width">
        </li>
        <li class="noborderbottom">
          <i class="userdxyz_ico"></i>
          <input placeholder="请输入密码" type="password" v-model="password" class="login-width">
        </li>
      </ul>
      <a href="javascript:void(0)" class="btn_full_login" @click="login()">登&nbsp;录</a>
      <div class="footer">
        <router-link :to="{ path: '/register' }">
        <span class="pull-left text-primary">注册账号</span>
        </router-link>
        <router-link :to="{ path: '/password' }">
        <span class="pull-right text-default">忘记密码？</span>
        </router-link>
      </div>
    </div>

  </div>
</template>
<script>
  import * as _ from '../../utils/tools'
  import cookie from '../../../static/js/cookie'
  import { Group, XInput } from 'vux'
  export default {
    components: {
      Group,
      XInput
    },
    data: function () {
      return {
        username: '',
        password: ''
      }
    },
    created () {
      cookie.delCookie('token')
      cookie.delCookie('name')
      this.$store.dispatch('setInfo')
    },
    methods: {
      login: function () {
        if (!this.username) {
          this.$vux.toast.show({
            text: '请输入用户名',
            type: 'warn'
          })
          return false
        }
        if (!this.password) {
          this.$vux.toast.show({
            text: '请输入密码',
            type: 'warn'
          })
          return false
        }
        let data = {
          'username': this.username,
          'password': this.password
        }
        let that = this
        return this.$api.login(data).then(res => {
          that.$vux.toast.text('登录成功')
          let time = 3600*24*7
          // 本地存储用户信息
          cookie.setCookie('name', that.username, time)
          cookie.setCookie('token', res.data.token, time)
          cookie.setCookie('openid', res.data.openid, time)
          that.$store.dispatch('setInfo')
          _.go('/center', that.$router, 2000)
        }).catch(err => {
          that.$vux.toast.text('用户名已存在')
          return err.message
        })
      }
    }
  }
</script>
<style scoped>
  body{margin:0px auto; font-size:12px; font-family:Arial, "微软雅黑", Verdana, Helvetica, sans-serif;*font-family:"Microsoft YaHei", Verdana, Helvetica, sans-serif; background-color:#f4f4f4; }
  input,textarea{font-family:Arial,"Microsoft YaHei",Verdana, Helvetica, sans-serif;*font-family:"Microsoft YaHei",Verdana, Helvetica, sans-serif;}
  ul,ol,dl,dd,h1,h2,h3,h4,p{padding:0px; margin:0px;}
  ul,li,ol{list-style:none outside none;}
  img{border:0px;}
  em{font-style:normal;}
  a{color:#000; text-decoration:none;}
  a:hover{text-decoration:none;}
  .pagewidth{ max-width:1024px; min-width:320px; margin:0px auto; position:relative;}
  .pagewidth.iframe_box{ width:100%;}
  .pagewidth{max-width:720px; margin:0px auto;}
  /*登录页面*/
  .login_box{}
  .login_banner{ height:130px; width:100%; background:#f9a61a url(/static/images/login_bg_ico.png) bottom right no-repeat; background-size:85px 80px; text-align:center;}
  .login_banner i{ margin-top:35px; display:inline-block; width:170px; height:60px; background:url(/static/images/logo_login.png) 0 0 no-repeat; background-size:170px 60px;}
  .btn_full_login{ display: block;border:none; margin:20px 5% 0px 5%; height:40px; width:90%; text-align:center; line-height:40px; background-color:#f9a61a;  color:#fff; border-radius:6px;}

  .shuru{ background-color:#fff;border-bottom:#dfdfdf solid 1px;}
  .shuru li{ position:relative; width:90%; margin:0px 5%; border-bottom:#f1f1f1 solid 1px; height:50px; line-height:50px;}
  .shuru li.noborderbottom{ border-bottom:none;}
  .shuru li i{ float:left; width:16px;  height:16px; background:url(/static/images/verification_prompt_icon.png) 0px 0px no-repeat; background-size:15px 62px; margin:16px 0px 0px 3%;}
  .shuru li i.username_ico{ background-position:0px -15px;}
  .shuru li i.userdxyz_ico{ background-position:0px -46px;}
  .shuru li input{ width:50%; text-indent:10px; height:30px; line-height:30px; font-size:14px; color:#444; border:none; outline:none; cursor:pointer; margin-top:8px;}
  .shuru li input.btn_dxyz{position:absolute; right:0px;top:1px; height:32px; line-height:32px; color:#fff; width:auto; text-indent:0px; text-align:center; padding:0px 15px; font-size:12px; border-radius:3px; background-color:#ffcc00;}
  .shuru li input.btn_dxyz.btn_dxyz_waiting{ background-color:#ccc; }
  .shuru li input.user_yzm_width{ width:60%;}
  .text-primary {
    color: #41cac0;
  }
  /*注册页面*/
  .regist_box{ position:relative; background-color:#fb5847;}
  .regist_logo{ position:absolute; top:15px; left:15px; display:block; width:120px; height:35px; background:url(/static/images/regist_logo.png) 0 0 no-repeat; background-size:120px 35px;}
  a.regist_tip_what{ display:block;  padding:8px 15px 8px 15px; position:absolute; top:17px; right:0px; background-color:#e14f40; border-top-left-radius:8px; border-bottom-left-radius:8px; color:#fff;}
  img.regist_banner_pic{ width:90%; margin:70px 5% 30px 5%;}

  span.regist_flag_ico{ position:absolute; top:-39px; left:18px; display:block; width:70px; height:54px; background:url(/static/images/register_flag.png) 0 0 no-repeat; background-size:70px 54px;}
  .regist_inputarea{ background-color:#f04d3d; border-radius:8px; margin:0px 15px;}
  ul.shuru_regist{ position:relative; padding:15px 20px;}
  ul.shuru_regist li{ margin-bottom:10px;}
  input.shuru_rigist_name,input.shuru_rigist_yzm{ background-color:#fff; border:none; width:94%; height:40px; line-height:40px; padding:0px 3%;outline:none; font-size:15px; color:#666; border-radius:5px;}
  input.shuru_rigist_yzm{ width:50%;}

  .shuru_rigist_yzm_btn{ border:#f98217 solid 2px; float:right; height:40px; border-radius:5px; background-color:#f98217; line-height:37px; padding:0px 3%;outline:none; width:40%; color:#fff;}
  .shuru_rigist_yzm_btn.btn_dxyz_waiting{border:#f9a9a1 solid 2px; background-color:#f04d3d; color:#f9a9a1;}

  .btn_full_regist{ width:100%; border:none; background-color:#ffe114; height:43px; line-height:39px; color:#f35343; border-bottom:#ffc22c solid 2px; border-radius:5px; font-size:18px; font-weight:bold;}

  p.regist_reward_title{ position:relative; border-bottom:#fc796c solid 1px; margin:15px 15px; height:20px; line-height:20px;}
  p.regist_reward_title span{ position:absolute; bottom:-10px; left:50%; color:#fff; font-size:15px; font-weight:bold; display:block; background-color:#fb5847; width:150px; text-align:center; margin-left:-75px;}

  .regist_user_reward{ margin:15px;}
  ul.regist_user_list{ height:350px; overflow:hidden;margin-top:25px; clear:both;}
  li.regist_user_item{ padding:8px 0px;}
  img.regist_user_photo{ float:left; width:38px; height:38px; border-radius:50%; border:#ea4534 solid 2px; margin-right:10px;}
  dl.regist_user_info{ float:left; position:relative; color:#fff; margin-top:5px;}
  dl.regist_user_info dt{ margin-bottom:3px; font-size:13px;}
  dl.regist_user_info dt span{ margin-right:10px; max-width:90px; overflow:hidden; display:inline-block;white-space: nowrap}
  dl.regist_user_info dd{ color:#fdb8b3;max-width:180px; overflow:hidden; display:inline-block;white-space: nowrap}
  p.regist_user_getmoney{ float:right; color:#ffe114; height:42px; line-height:42px;}
  p.regist_user_getmoney span{ font-size:18px; padding-right:4px;}

  .regist_copyright{ background-color:#e94838; height:35px; line-height:35px; width:100%; text-align:center;}
  .regist_copyright p{ color:#f8d2cf; }

  .tan_regist_success{ position:absolute; z-index:10000; top:50px; left:50%; width:320px; margin-left:-160px; text-align:center;}
  i.regist_success_ico{ display:block; width:320px; height:200px; background:url(/static/images/regist_success_ico.png) 0 0 no-repeat; background-size:320px 200px;}
  p.regist_success_redtext{ font-size:20px; color:#fb5847; line-height:24px; margin:20px 0px 8px 0px;}
  p.regist_success_garytext{ font-size:12px; color:#d5a871; line-height:20px;}
  a.regist_close_btn{ display:inline-block; width:60%; margin:0px 20%; height:36px; line-height:36px; color:#d5a871; font-size:18px; border:#d5a871 solid 2px; border-radius:20px; margin-top:30px;}
  .login_box {
    font-size:14px;
  }
  .login_box .footer{
    width: 90%;
    margin: 10px auto;
  }
  .login_box .footer span{
    cursor: pointer;
  }
  .login_box .login-width{
    width:80%;
  }
</style>
