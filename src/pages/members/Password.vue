<template>
  <div class="retrieve-password">
    <group title="请选择密码找回方式">
      <radio :selected-label-style="{color: '#FF9900'}" :options="options" v-model="type"></radio>
    </group>
    <group>
      <x-input title="账号"></x-input>
      <x-input title="验证码" class="weui-cell_vcode">
        <img slot="right" class="weui-vcode-img" src="">
      </x-input>
      <x-input title="验证码" class="weui-vcode">
        <a slot="right" class="btn btn-danger btn-xs">立即发送</a>
      </x-input>
    </group>
    <group>
      <x-input title="新密码" v-model="password"></x-input>
    </group>

    <div class="p10 mt30">
      <a href="javascript:void(0)" class="btn btn-warning per100">确认修改</a>
    </div>
  </div>
</template>
<script>
  import { Group, XInput, XButton, Radio } from 'vux'

  export default {
    components: {
      Group,
      XInput,
      XButton,
      Radio
    },
    data: function () {
      return {
        verify_code_src: '/verifycode/captcha',
        options: [
          {
            key: 1,
            value: '通过手机验证码找回密码'
          },
          {
            key: 2,
            value: '通过邮箱验证码找回密码'
          }
        ],
        type: 1,
        account: '',
        verify_code: '',
        verify_server_code: '',
        password: ''
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
  .per100 {
    width: 100% !important;
  }
  .retrieve-password .weui-vcode-img{
    display: inline-block;
    width: auto;
  }
  .retrieve-password .weui-cell{
    font-size: 14px;
  }
</style>
