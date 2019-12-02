<template>
  <div class="pagewidth regist_box">
    <span class="regist_logo"></span>
    <router-link class="regist_tip_what" :to="{ path: '/login' }">用户登录</router-link>
    <img class="regist_banner_pic" src="/static/images/regist_banner.png">
    <div class="regist_inputarea">
      <ul class="shuru_regist">
        <span class="regist_flag_ico"></span>
        <li>
          <input class="shuru_rigist_name" v-model="username" placeholder="请输入您的昵称">
        </li>
        <li>
          <input class="shuru_rigist_name" v-model="password" type="text" placeholder="请设置一个登录密码">
        </li>
        <input type="button" value="注册" class="btn_full_regist" @click="register()">
      </ul>
    </div>
  </div>
</template>
<script>
  import * as _ from '../../utils/tools'
  import { Toast } from 'vux'
  export default {
    components: {
      Toast
    },
    data: function () {
      return {
        src: '/verifycode/captcha?t=' + Math.random(),
        username: '',
        password: ''
      }
    },
    methods: {
      register: function () {
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
        return this.$api.register(data).then(res => {
          this.$vux.toast.text('注册成功')
          _.go('/login', this.$router, 2000)
        }).catch(err => {
          this.$vux.toast.text('用户名已存在')
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
  .regist_box .verifycode {
    width: 40%;
    height:40px;
    border-radius: 5px;
  }
  .regist_box .marquee {
    overflow:hidden;
    height:350px;
  }
  /*注册页面*/
  .regist_box{ position:relative; background-color:#fb5847;padding-top:1px;}
  .regist_logo{ position:absolute; top:15px; left:15px; display:block; width:120px; height:35px;}
  .regist_box a.regist_tip_what{ display:block;  padding:8px 15px 8px 15px; position:absolute; top:17px; right:0px; background-color:#e14f40; border-top-left-radius:8px; border-bottom-left-radius:8px; color:#fff;}
  .regist_box img.regist_banner_pic{ width:90%; margin:70px 5% 30px 5%;}

  .regist_box span.regist_flag_ico{ position:absolute; top:-39px; left:18px; display:block; width:70px; height:54px; background:url(/static/images/register_flag.png) 0 0 no-repeat; background-size:70px 54px;}
  .regist_box .regist_inputarea{ background-color:#f04d3d; border-radius:8px; margin:0px 15px;}
  .regist_box ul.shuru_regist{ position:relative; padding:15px 20px;}
  .regist_box ul.shuru_regist li{ margin-bottom:10px;}
  .regist_box input.shuru_rigist_name,input.shuru_rigist_yzm{ background-color:#fff; border:none; width:100%; height:40px; line-height:40px; padding:0px 3%;outline:none; font-size:15px; color:#666; border-radius:5px;}
  .regist_box input.shuru_rigist_yzm{ width:50%;}

  .regist_box .shuru_rigist_yzm_btn{ border:#f98217 solid 2px; float:right; height:40px; border-radius:5px; background-color:#f98217; line-height:37px; padding:0px 3%;outline:none; width:40%; color:#fff;}
  .regist_box .shuru_rigist_yzm_btn.btn_dxyz_waiting{border:#f9a9a1 solid 2px; background-color:#f04d3d; color:#f9a9a1;}

  .regist_box .btn_full_regist{ width:100%; border:none; background-color:#ffe114; height:43px; line-height:39px; color:#f35343; border-bottom:#ffc22c solid 2px; border-radius:5px; font-size:18px; font-weight:bold;}

</style>
