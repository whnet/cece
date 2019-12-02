<template>
<div class="mui-content">
        <div class="header">
          <div class="header_top">
            <img class="img_100" src="static/images/tip_bg.png"/>
            <div class="edit ui-cell-noborder">
              <div class="edit_hic"><img class="img_100" :src="avatar"/></div>
              <div class="ui-cell-primary user_name ml5" style="color: #fff !important;">
                <div class="nickname" style="color:#fff !important" v-if="setInfo.token">{{ nickname }}</div>
                <div class="nickname" style="color:#fff !important" v-else @click="$router.push({path: '/login'})">请登录</div>
                <div class="integral mt10"  @click="$router.push({path: '/info'})">
                  <a class="ui-cell-noborder" href="javascript:;">
                    <span>设置</span>
                    <i class="iconfont icon-iconfontyoujiantou-copy-copy-copy-copy"></i>
                  </a>
                </div>
              </div>
              <div style="width: 4rem;height: 3rem;line-height: 3rem;text-align: right;">
                <span v-if="tid" @click="$router.push({path: '/recrult'})">已是老师</span>
                <span @click="$router.push({path: '/recrult'})" v-else>成为老师</span>
                <a href="javascript:;" style="color:#fff"><i class="iconfont icon-iconfontyoujiantou-copy-copy-copy-copy"></i></a>
              </div>
            </div>
          </div>
          <div @click="$router.push({path: '/member/chat'})" class="header_bot ui-cell">
            <div class="ui-cell-primary size-m color-3">我的菩提</div>
          </div>
          <div class="list ui-cell first">
            <router-link :to="{ name: 'orders/myorders'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyeg"></i></div>
              <div class="mall-name">我的订单</div>
            </router-link>
            <router-link :to="{ name: 'member/jifen'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyec"></i></div>
              <div class="mall-name">我的积分</div>
            </router-link>
            <router-link :to="{ name: '/edit'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyeh"></i></div>
              <div class="mall-name">我的资料</div>
            </router-link>
            <router-link :to="{ name: '/shares'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyee"></i></div>
              <div class="mall-name">邀请好友</div>
            </router-link>
          </div>
        </div>
        <!--头部结束-->

        <!--我是老师 v-if="tid"-->
        <div class="my-answer" v-if="tid">
          <a href="" class="header_bot ui-cell">
            <div class="ui-cell-primary size-m color-3">我是老师</div>
          </a>
          <div class="list ui-cell second">
            <router-link :to="{ name: 'orders/myordertaking'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyeo"></i></div>
              <div class="mall-name">接单</div>
            </router-link>
            <router-link :to="{ name: 'member/service'}" v-if="tid">
              <div class="mall-list-img"><i class="iconfont icon-shuyeR"></i></div>
              <div class="mall-name">项目</div>
            </router-link>
            <router-link :to="{ name: 'member/guangguang'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyeS"></i></div>
              <div class="mall-name">逛逛</div>
            </router-link>
            <router-link :to="{ name: '/income'}">
              <div class="mall-list-img"><i class="iconfont icon-shuyep"></i></div>
              <div class="mall-name">收入</div>
            </router-link>
          </div>
        </div>
        <!--我的问答-->

        <div class="list ui-cell third">
          <a :href="xuyuan">
            <div class="mall-list-img"><i class="iconfont icon-shuyei"></i></div>
            <div class="mall-name">菩提许愿</div>
          </a>
          <a :href="kaiyun">
            <div class="mall-list-img"><i class="iconfont icon-shuyek"></i></div>
            <div class="mall-name">开运好物</div>
          </a>
          <a :href="kecheng">
            <div class="mall-list-img"><i class="iconfont icon-shuyej"></i></div>
            <div class="mall-name">菩提课程</div>
          </a>
          <a :href="kefu">
            <div class="mall-list-img"><i class="iconfont icon-shuyed"></i></div>
            <div class="mall-name">联系客服</div>
          </a>
        </div>
      <common-footer></common-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cookie from '../../../static/js/cookie'
import { wxTools } from '../../utils/wxTools'
import { ToastPlugin, XHeader, Actionsheet,  WechatPlugin , AjaxPlugin } from 'vux'
export default {
  name: 'Center',
  data () {
    return {
      kefu: config.KEFU_CENTER,
      kaiyun: config.KAIYUBN_CENTER,
      kecheng: config.KECHENG_CENTER,
      xuyuan: config.XUYUAN_CENTER,
      tid: cookie.getCookie('tid'),
      userInfo: [],
      nickname: sessionStorage.getItem('nickname'),
      avatar: sessionStorage.getItem('avatar')
    }
  },
  created () {
    // this.$api.tuikuan()
    // this.$api.dakuan()
    let token = cookie.getCookie('token')
    if (token === null) {
      sessionStorage.setItem("url", this.$route.path);
      this.getWechatAuth()
    }
  },
  computed: {
    ...mapGetters({
      setInfo: 'userInfo'
    })
  },
  methods: {
    getWechatAuth: function () {
      return this.$api.wechatAuth().then(res => {
        window.location.href = res.data.result
      }).catch(err => {
        return err
      })
    },
  }
}
</script>

<style scoped>
  html {
    font-size: 20px;
  }
  .first{
    margin: 0!important;
  }
  .first i{
    color:rgb(191, 205, 54);
    font-size:2.5rem;
  }
  .second i{
    color:rgb(0, 102, 111);
    font-size:1.5rem;
  }
  .third i{
    color:rgb(117, 182, 78);
    font-size:2rem;
  }
  @media only screen and (min-width: 400px) {
    html {
      font-size: 21.33333333px !important;
    }
  }
  @media only screen and (min-width: 414px) {
    html {
      font-size: 22.08px !important;
    }
  }
  @media only screen and (min-width: 480px) {
    html {
      font-size: 25.6px !important;
    }
  }
 .ui-content {
    position: absolute;
    top: 0;m
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .ui-bar-nav ~ .ui-content {
    top: 2.2rem;
  }
  .ui-bar-header-secondary ~ .ui-content {
    top: 4.4rem;
  }
  .ui-bar-footer ~ .ui-content {
    bottom: 2.2rem;
  }
  .ui-bar-footer-secondary ~ .ui-content {
    bottom: 4.4rem;
  }
  .ui-bar-tab ~ .ui-content {
    bottom: 2.5rem;
  }
  .ui-bar-footer-secondary-tab ~ .ui-content {
    bottom: 4.7rem;
  }
  .ui-content-padded {
    margin: 0.5rem;
  }
  .ui-text-center {
    text-align: center;
  }
  .ui-pull-left {
    float: left;
  }
  .ui-pull-right {
    float: right;
  }
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }
  .clearfix:after {
    clear: both;
  }


  .ui-icon{
    font-family: "iconfont";
    font-style: normal;
    display: inline-block;
    vertical-align: middle;
    background-size: 100% auto;
    background-position: center;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    margin-right: 5px;
  }
  .ui-cell,
  .ui-cell-noborder{
    position: relative;
    padding: .5rem .75rem;
  }
  .ui-cell:before,
  .ui-cell-nopadding:before,
  .ui-cell-noborder:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid transparent;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .ui-cell:first-child:before,
  .ui-cell-nopadding:first-child:before {
    display: none;
  }
  .ui-cell:before,
  .ui-cell-nopadding:before {
    border-top: 1px solid #D9D9D9;
  }

  .ui-cell,
  .ui-cell-nopadding,
  .ui-cell-noborder{
    position: relative;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -moz-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .ui-cell-lt{
    -webkit-align-self: flex-start;
    -moz-align-self:flex-start;
    align-self: flex-start;
  }

  .ui-cell-ft,
  .ui-cell-rd{
    text-align: right;
    color: #aaa;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .ui-cell-primary {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .ui-cell-center{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    text-align: center;
  }
  .ui-cell-center img{
    width: 100%;
    height: 100%;
    display: block;
  }
  .ui-cell-number {
    background-color:#D8D8D8;
    color:#FFF;
    border-radius:10px;
    display:inline-block;
    padding: 0 .5rem;
    font-size: .6rem;
  }
  .ui-cell-number-color {
    background-color:#F00;
  }

  .ui-cells {
    margin-top: .5rem;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: .7rem;
    overflow: hidden;
    position: relative;
  }
  .ui-cells:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .ui-cells:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    -webkit-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .ui-cells-title {
    margin-top: .65rem;
    margin-bottom: .65rem;
    padding-left: .75rem;
    padding-right: .75rem;
    color: #000;
    font-size: .8rem;
  }
  .ui-cells-tips {
    color: #888;
    font-size: .7rem;
    margin-top: .25rem;
    text-align: center;
  }
  .ui-cells-title + .ui-cells {
    margin-top: 0;
  }
  .ui-cells-tips {
    margin-top: .25rem;
    color: #888;
    text-align: center;
    font-size: .7rem;
  }
  .ui-cells-access .ui-cell:not(.no_access) {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .ui-cells-access .ui-cell:not(.no_access):active {
    background-color: #ECECEC;
  }
  .ui-cells-access a.ui-cell {
    color: inherit;
  }
  .ui-cells-access .ui-cell-ft:after,
  .ui-cells-access .ui-cell-rd:after{
    font-family: "iconfont" !important;
    font-size:18px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    position: relative;
  }
  .ui-cells-access .ui-cell-ft:after {
    content: "";
  }
  .ui-cells-access .ui-cell-rd:after {
    content: "\e690";
  }
  .ui-content{
    padding-bottom: 0.75rem;
  }
  .header{
    background-color: #FFFFFF;
  }
  .header_top{
    position: relative;
  }
  .newsBox{
    position: absolute;
    font-size: 1.3rem;
    color: #FFFFFF;
    top: 0.5rem;
    right: 0.75rem;
  }
  .newsBox span{
    position: absolute;
    width: 18px;
    height: 18px;
    background: red;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    top: 5px;
    right: -5px;
  }
  .edit{
    position: absolute;
    bottom: 0.5rem;
    color: #FFFFFF;
    width: 100%;
  }
  .edit_hic{
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #FFFFFF;
    margin-right: 0.5rem;
  }
  .user_name{
    font-size: 0.85rem;
    height: 100%;
  }
  .icon-youjiantou{
    margin-left: 5px;
    position: relative;
    top: -1px;
  }
  .header_bot{
    border-bottom: 1px solid #D9D9D9;
  }
  .my-order{
    padding: 0.75rem 0;
  }
  .my-order a{
    color: #666666;
    display: block;
    width: 33.333%;
    text-align: center;
  }
  .mall-list-img {
    width: 30%;
    margin: 0 auto;
    position: relative;
  }
  .mall-list-img span{
    display: block;
    position: absolute;
    top: 0;
    right: -3px;
    background: #EF403D;
    border-radius: 50%;
    color: #fff;
    width: 15px;
    height: 15px;
    line-height: 15px;
    font-size: 12px;
  }
  .my-answer{
    background-color: #FFFFFF;
    margin-top: 0.5rem;
  }
  .list{
    background-color: #FFFFFF;
    margin-top: 0.5rem;
    padding: 0.75rem 0;
  }
  .list a{
    width: 25%;
    color: #666666;
    display: block;
    text-align: center;
  }
  .list .mall-list-img{
    width: 100%;
  }
  .mall-name{
    font-size: 0.65rem;
  }
  .list .mall-name{
    margin-top: 0rem;
  }

  #myself-color{
    color: #6db57b;
  }
  /*2018.5.28测币数及跳转*/
  .integral .ui-cell-noborder{
    background: #f7b465;
    font-size: 12px;
    padding: 0.1rem 0.3rem;
    color: #fff;
    border-radius: 1rem;
    justify-content: center;
    line-height: 0.8rem;
    float: left;
  }
  .nickname{
    color: #fff !important;
  }
  .integral i{
    top: 0;
    margin: 0;
  }
  body{
    margin:0 auto;
    max-width: 640px;
    min-width: 320px;
    font-size: 0.7rem;
    font-family: "Microsoft YaHei", "微软雅黑", Helvetica, "黑体", Arial, Tahoma;
  }
  .ui-cell:before,.ui-cell:after{
    border: none;
  }
  .img_100 {
    display: block;
    width: 100%;
  }

  .img_90 {
    display: block;
    width: 90%;
  }
  .img_80 {
    display: block;
    width: 80%;
  }
  .img_70 {
    display: block;
    width: 70%;
  }
  .img_60 {
    display: block;
    width: 60%;
  }
  .img_50 {
    display: block;
    width: 50%;
  }
  .img_40{
    display: block;
    width: 40%;
  }
  .img_30 {
    display: block;
    width: 30%;
  }
  .ui-content{
    font-size: 0.7rem;
  }
  .color-3{
    color: #3A3A3A !important;
  }
  .color-6{
    color: #666666 !important;
  }
  .color-9{
    color: #999999 !important;
  }
  .color-b{
    color: #BBBBBB !important;
  }
  .color-vi{
    color: #6db57b !important;
  }
  .tx-center{
    text-align: center !important;
  }
  .bg-vi{
    background-color: #6db57b !important;
  }
  .size-ss{
    font-size: 0.6rem !important;
  }
  .size-s{
    font-size: 0.65rem !important;
  }
  .size-m{
    font-size: 0.7rem !important;
  }
  .size-b{
    font-size: 0.75rem !important;
  }
  .ui-icon{
    margin-right: 0;
  }
  #content-box img{
    display: block;
    width: 35%;
    margin: 0 auto;
    margin-top: 2rem;
  }
  #content-box p{
    color: #999999;
    text-align: center;
    font-size: 0.8rem;
  }
  #content-box a{
    display: block;
    width: 35%;
    text-align: center;
    margin: 0 auto;
    border: 1px solid #6db57b;
    color: #6db57b;
    padding: 0.4rem 0;
    font-size: 0.8rem;
    border-radius: 4px;
  }
  /*弹窗公共样式*/
  .popu{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 900;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.7);
  }
  .modWin{
    position: relative;
    width: 79%;
    min-height: 80vh;
    background: #fff;
    border-radius: 5px;
  }
  .close{
    position: absolute;
    bottom: -3rem;
    width: 100%;
    justify-content: center;
  }
  .icon-close {
    display: block;
    margin: 0 auto;
  }
  /*顶外边距*/
  .mt5 {margin-top: 0.3rem;}
  .mt10 {margin-top: 0.5rem;}
  .mt20 {margin-top: 1rem;}
  .mt30 {margin-top: 1.5rem;}
  /*左外边距*/
  .ml10 {margin-left: 0.5rem;}
  .ml20 {margin-left: 1rem;}
  /*右外边距*/
  .mr5 {margin-right: 0.3rem;}
  .mr10 {margin-right: 0.5rem;}
  .mr20 {margin-right: 1rem;}
  /*底外边距*/
  .mb5 {margin-bottom: 0.25rem;}
  .mb10 {margin-bottom: 0.5rem;}
  .mb20 {margin-bottom: 1rem;}
  .mb30 {margin-bottom: 1.5rem;}
  /*盒子左右内边距*/
  .plr20 {padding-left: 1rem;padding-right: 1rem;}
  /*底内边距*/
  .pb10 {padding-bottom: 0.5rem;}
  /*顶内边距*/
  .pt10 {padding-top: 0.5rem;}
  .pt20 {padding-top: 1rem;}
  /*字体大小*/
  .fs12 {font-size: 0.6rem; }
  .fs14 {font-size: 0.7rem;}
  .fs16 {font-size: 0.8rem;}
  .fs18 {font-size: 0.9rem;}
  .fs20 {font-size: 1rem;}
  .fs22 {font-size: 1.1rem;}
  .fs24 {font-size: 1.2rem;}
  .fs26 {font-size: 1.3rem;}
  .fs28 {font-size: 1.4rem;}
  .fs32 {font-size: 1.6rem;}
  /*字体颜色*/
  .c_gray {color: #999;}
  .c_lightg_gray {color: #c9c9c9;}
  .c_rose {color: #f6556c;}
  .c_fff {color: #fff;}
  .c_zong {color: #5a2b0a;}
  /*背景色*/
  .b_fff{
    background: #ffffff;
  }
  .b_gray{
    background: #f6f8f8;
  }
  /*文字加粗*/
  .bold {
    font-weight: bold;
  }

  .-bold {
    font-weight: normal;
  }
  .numBold {
    font-family: PingFangSC-Medium, sans-serif;
    font-weight: bold;
  }
  /*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */
  html {
    font-family: sans-serif;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  body {
    margin: 0;
  }
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
  }
  audio,
  canvas,
  progress,
  video {
    display: inline-block;
    vertical-align: baseline;
  }
  audio:not([controls]) {
    display: none;
    height: 0;
  }
  [hidden],
  template {
    display: none;
  }
  a {
    background-color: transparent;
  }
  a:active,
  a:hover {
    outline: 0;
  }
  abbr[title] {
    border-bottom: 1px dotted;
  }
  b,
  strong {
    font-weight: bold;
  }
  dfn {
    font-style: italic;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  mark {
    background: #ff0;
    color: #000;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sup {
    top: -0.5em;
  }
  sub {
    bottom: -0.25em;
  }
  img {
    border: 0;
  }
  svg:not(:root) {
    overflow: hidden;
  }
  figure {
    margin: 1em 40px;
  }
  hr {
    box-sizing: content-box;
    height: 0;
  }
  pre {
    overflow: auto;
  }
  code,
  kbd,
  pre,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    color: inherit;
    font: inherit;
    margin: 0;
  }
  button {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  html input[type="button"],
  input[type="reset"],
  input[type="submit"] {
    -webkit-appearance: button;
    cursor: pointer;
  }
  button[disabled],
  html input[disabled] {
    cursor: default;
  }
  button::-moz-focus-inner,
  input::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
  input {
    line-height: normal;
  }
  input[type="checkbox"],
  input[type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    height: auto;
  }
  input[type="search"] {
    -webkit-appearance: textfield;
    box-sizing: content-box;
  }
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  fieldset {
    border: 1px solid #c0c0c0;
    margin: 0 2px;
    padding: 0.35em 0.625em 0.75em;
  }
  legend {
    border: 0;
    padding: 0;
  }
  textarea {
    overflow: auto;
  }
  optgroup {
    font-weight: bold;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  td,
  th {
    padding: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-touch-callout: none;
  }
  body {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 0.85rem;
    line-height: 1.5;
    color: #3A3A3A;;
    background: #eee;
    overflow: hidden;
  }
  a,
  input,
  textarea,
  select,
  button {
    outline: 0;
  }
  p {
    margin: 1em 0;
  }
  a {
    color: #0894ec;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  a:active {
    color: #0a8ddf;
  }
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }
  .clearfix:after {
    clear: both;
  }


  /*== reset ==*/
  * {
    margin: 0;
    padding: 0;
  }
  ol,
  ul,
  li,
  ul li,
  ol li{
    list-style:none;
  }
  i{
    font-style: normal;
  }
  /* === Pages === */
  .ui-page {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #eee;
    z-index: 2000;
  }
  .ui-page,
  .ui-page-group {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #f6f6f8;
    display: none;
    overflow: hidden;
  }
  .ui-page.ui-page-current,
  .ui-page-group.page-current,
  .ui-page.ui-page-visible,
  .ui-page-group.ui-page-visible,
  .ui-page.ui-page-from-center-to-left,
  .ui-page-group.ui-page-from-center-to-left,
  .ui-page.ui-page-from-center-to-right,
  .ui-page-group.ui-page-from-center-to-right,
  .ui-page.ui-page-from-right-to-center,
  .ui-page-group.ui-page-from-right-to-center,
  .ui-page.ui-page-from-left-to-center,
  .ui-page-group.ui-page-from-left-to-center {
    display: block;
  }
  .ui-page.ui-page-current,
  .ui-page-group.ui-page-current {
    overflow: hidden;
  }
  .ui-page-group {
    display: block;
  }
  .ui-page-transitioning,
  .ui-page-transitioning .ui-swipeback-page-shadow {
    -webkit-transition: 400ms;
    transition: 400ms;
  }
  .ui-page-from-right-to-center {
    -webkit-animation: pageFromRightToCenter 400ms forwards;
    animation: pageFromRightToCenter 400ms forwards;
    z-index: 2002;
  }
  .ui-page-from-center-to-right {
    -webkit-animation: pageFromCenterToRight 400ms forwards;
    animation: pageFromCenterToRight 400ms forwards;
    z-index: 2002;
  }
  @-webkit-keyframes pageFromRightToCenter {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @keyframes pageFromRightToCenter {
    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
  @-webkit-keyframes pageFromCenterToRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
  }
  @keyframes pageFromCenterToRight {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    to {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
      opacity: .9;
    }
  }
  .ui-page-from-center-to-left {
    -webkit-animation: pageFromCenterToLeft 400ms forwards;
    animation: pageFromCenterToLeft 400ms forwards;
  }
  .ui-page-from-left-to-center {
    -webkit-animation: pageFromLeftToCenter 400ms forwards;
    animation: pageFromLeftToCenter 400ms forwards;
  }
  @-webkit-keyframes pageFromCenterToLeft {
    from {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
  }
  @keyframes pageFromCenterToLeft {
    from {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 0.5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
  }
  @-webkit-keyframes pageFromLeftToCenter {
    from {
      opacity: .5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes pageFromLeftToCenter {
    from {
      opacity: .5;
      -webkit-transform: translate3d(-20%, 0, 0);
      transform: translate3d(-20%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
</style>
