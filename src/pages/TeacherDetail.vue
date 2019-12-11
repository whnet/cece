<template>
<div id="header" class="mui-content" v-wechat-title="this.detailtitle">
  <div class="mui-card">
    <div class="header mui-card-content mem_top">
      <div class="over">
        <a href="" class="back l"></a>
      </div>
      <div class="headerimg">
        <img :src="info.avatar" />
        <span class="online"><span class="online_status"></span>在线</span>
      </div>
      <div class="name">{{ info.name }}</div>
      <!--1有荣誉证书（里面有填写内容） 2感谢数占比超过50%   3回复速度在3小时内-->
      <div class="cen mem_ico">
        <img src="/static/images/icon/ico1.png">
        <img src="/static/images/icon/ico2.png">
        <img src="/static/images/icon/ico3.png">
      </div>
    </div>
  </div>
  <div class="mar bqico">
    <span class="ico_dq">占星师</span>
    <span class="ico_nl">北京</span>
    <span class="ico_xz">白羊A</span>
    <span class="ico_sg">3-5年</span>
  </div>
  <div class="f12 hui">专业服务 | 诚信口碑 | 平台保障 | 高性价比</div>
  <div class="mui-card-content pre_title">
    <div class="mui-card-header">
      <span style="color: #45B97C;font-size: 14px;">荣誉擅长</span>
    </div>
  </div>
  <div class="description mui-card">
    <div class="mui-card-content">
    <p class="resume">
      <span style="line-height: 25px;font-size: 14px;">{{ info.resume }}</span>
    </p>
    </div>
  </div>

  <div class="mui-card-content pre_title">
    <div class="mui-card-header">
      <span style="color: #45B97C;font-size: 14px;">服务项目</span>
    </div>
  </div>
  <div class="mui-card service-card" :style="{'display':serviceBlock ? 'block':'none'}">
    <div class="servicelist">
    <div class="mui-input-row mui-radio" v-for="(value, key) in category" :key="key">
        <p class="title f001">{{ value.title }}
          <span class="price" v-if="value.belong == 0"><span>{{ value.price }}</span>元/次</span>
          <span class="price" v-else><span>{{ value.price }}</span>元/三次</span>
        </p>
        <p class="mui-ellipsis f001">{{ value.des}}</p>
        <input name="radio" type="radio" :value="value.price" @click="getData(value.des, value.price, value.title, value.id, value.belong)">
    </div>
    </div>
  </div>
  <comments></comments>
    <nav class="mui-bar mui-bar-tab" style="height:50px" v-if="info.mid != mid">
      <a class="mui-tab-item">
        <p class="mui-tab-label" style="color:#323232;margin:0;">72小时未回复</p>
        <p class="mui-tab-label" style="color:#666666;margin:0;font-size:.65rem;">会原路退款</p>
      </a>
        <a class="mui-tab-item topaybackground" v-if=" price === 0 " @click="showPosition('middle')">
          <span class="mui-tab-label totalprice" :data-price="0">请选择服务项目</span>
        </a>
      <a class="mui-tab-item topaybackground"  v-else @click="toPay(price,title,belong)">
          <span class="mui-tab-label totalprice" :data-price="price" v-if="price != '0.00' ">支付{{ price }}元</span>
          <span class="mui-tab-label totalprice" :data-price="price" v-else>免费提问</span>
        </a>
    </nav>
  <div class="mui-popover" :class="{service_display: service_display}">
    <h1 class="totast-title">
      <span>{{ title }}</span>
    </h1>
    <p id="popover">{{ msg }}</p>
    <div class="totast-footer">
    <span class="query" @click="closeMsg">确定</span>
    </div>
  </div>
    <toast type="text" :time="1000" is-show-mask :type="type" text="请选择项目" :value="showPositionValue" :position="position"></toast>
</div>
</template>

<script>
import { Toast } from 'vux'
import Comments from '../components/common/Comments'
import cookie from '../../static/js/cookie'
export default {
  components: {
    Toast,
    Comments,
  },
  data () {
    return {
      detailtitle:'菩提树',
      service_display: false,
      msg: '',
      belong: 0,
      price: 0,
      mid: cookie.getCookie('mid'),
      title: '服务项目',
      toDisplayMore: '190px',
      position: 'default',
      showPositionValue: false,
      type: 'warn',
      info: [],
      category: '',
      serviceBlock: false,
      serveiceNums: 0,
    }
  },
  created () {
    if(cookie.getCookie('token')) {
      this.getTeacherInfo()
    }
  },

  methods: {
    getData: function (msg, price, title, service, belong) {
      this.msg = msg
      this.price = price
      this.title = title
      this.belong = belong
      this.service = service
      this.service_display = true
    },
    closeMsg: function () {
      this.service_display = false
    },
    loadMore: function () {
      this.toDisplayMore = 'auto'
    },
    closeMore: function () {
      this.toDisplayMore = '190px'
    },
    showPosition: function (position) {
      this.position = position
      this.showPositionValue = true
    },
    toPay: function (price, title, belong) {
      this.$vux.loading.show({text: '发起支付'})
      let data = {
        'belong': belong?belong:0,
        'price': price,
        'title': title,
        'detail': this.msg,
        'type': 'teacher',
        'tid': Number(this.$route.query.tid),
        'mid_id': Number(cookie.getCookie('mid')),
        'tomember_id': Number(this.info.mid),
        'openid':  cookie.getCookie('openid'),
        'pid':  this.$route.query.pid,
      }
      return this.$api.wechatpay(data).then(res => {
        if(price == '0.00'){
          window.location.href = '/#/myorders'
        }else{
          this.$vux.loading.hide()
          this.onBridgeReady(res.data)
        }
      })
    },
    onBridgeReady: function (data) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": data.appId,
          "timeStamp": data.timeStamp,
          "nonceStr": data.nonceStr,
          "package": data.package,
          "signType":"MD5",
          "paySign": data.paySign
        },
        function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
            window.location.href = '/#/myorders'
          }
        });
    },
    getTeacherInfo: function () {
      return this.$api.teacherDetail(this.$route.query.tid).then(res => {
        this.info = res.data || ''
        this.getCategory(this.$route.query.tid)
        this.detailtitle =res.data.realname
        // 单独写
        if(res.data.realname){
          let url = window.location.href
          let domain = url.split("/#/")[0]
          let time = Math.round(new Date() / 1000)
          let openid = cookie.getCookie('openid')
          this.$api.jssdk({'url':url}).then(resource => {
            wx.config({
              debug: false,
              appId: resource.data.result.appId,
              timestamp: resource.data.result.timestamp,
              nonceStr: resource.data.result.nonceStr,
              signature: resource.data.result.signature,
              jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
              ]
            })
            let shareInfo = {
              img: domain +'/static/images/default.jpg',
              link: domain +'/#/share?shareopenid='+openid+'&sharetime='+time+'&shareurl='+encodeURIComponent(url),
              title: res.data.realname+'的菩提树：有困惑？有烦恼？就上菩提树！',
              desc: '你真的与众不同'
            }
            this.wxShareReady(shareInfo);
          })
        }
        // 单独写 END

      })
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
    getCategory: function (tid) {
      return this.$api.service({'m':tid},0,0).then(res => {
        this.category = res.data
        this.serveiceNums = res.data.length
        if(res.data){
          this.serviceBlock = true
        }else{
          this.serviceBlock = false
        }
      })
    },
  }
}
</script>

<style scoped>
  .f001{
    line-height: 1.2rem;
  }
  .name{
    text-align:center;
    margin-top: 15px;
    color: #fff;
    font-size: 0.8rem;
  }
  .resume{
    padding-top: 0.35rem;
    clear: both;
    font-size: 0.7rem;
    color: #666666;
    /*text-indent: 2em;*/
  }
  .description{
    padding: 2px 12px 10px 15px;
  }
  .exp-mask{
    height:18px;
    position:absolute;
    bottom:40px;
    width:100%;
    background-image: linear-gradient(0deg,#FFF 17%,rgba(255,255,255,0) 100%);
    background-image: -webkit-linear-gradient(90deg,#FFF 17%,rgba(255,255,255,0) 100%);
  }
  .header-background-color{
    color:red
  }
  .topaybackground{
    background: #f3c583;
  }
  .totalprice{
    color:#fff;
  }
  .service_display{
    display:block;
  }
  .mui-card-footer{
    padding:10px 50px;
  }
  .tags{
    text-align: center;
    line-height: 15px;
  }
  .mui-content>.mui-card:first-child{
    margin:0px;
  }
  .mui-content{
    margin-bottom: 60px;
  }
  .mui-card-footer .mui-card-link, .mui-card-header .mui-card-link{
    height: 50px;
    line-height: 50px;
  }
  .mui-card-link{
    border: 1px solid red;
  }
  .header{
    height: 150px;
  }
  .headerimg{
    position: relative;
    top:10px;
    left: 38%;
    border: 1px solid #c1a6c0;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    text-align: center;
  }
  .headerimg  img{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: relative;
    top: 9px;
    left: 1px;
  }
  .online{
    position: absolute;
    top: 65px;
    left: 60px;
    color: #FFFFFF;
    font-size: 0.5rem;
    width:60px;
    height: 20px;
    line-height: 20px;
    background: #6b3068;
    display: inline-block;
    border-radius: 30px;
    text-align: right;
    padding-right:10px;
  }
  .online_status{
    position: absolute;
    left: 10px;
    top:30%;
    height: 8px;
    width:8px ;
    border-radius: 8px;
    display: inline-block;
    background: #69c91b;
  }
  .description{
    /*margin-top:-20px;*/
  }
  .description > .mui-card-content{
    background: #FFFFFF;
  }
  .year{
    font-size: 0.7rem;
  }
  .category span{
    padding: 0 0.5rem;
    line-height: 1rem;
    border-radius: 10px;
    color: #00ABAE;
    margin: 5px 0;
    border: 1px solid #00ABAE;
    white-space: nowrap;
    display: inline-block;
  }
  .mui-checkbox label, .mui-radio label{
    width:80%;
    margin-top:-60px;
    float: left;
  }
  .mui-ellipsis{
    width: 95%;
  }
  .mui-checkbox input[type=checkbox], .mui-radio input[type=radio]{
    top: 25px;
    right: 5px;
  }
  .mui-checkbox, .mui-radio  p{
    margin-bottom: 0;
  }
  #more{
    color: #f3c583;
    margin:10px 0;
    text-align: center;
  }
  .servicelist{
    padding:0;
  }
  .mui-checkbox input[type=checkbox]:before, .mui-radio input[type=radio]:before{
    font-size: 20px;
  }
  .mui-popover{
    opacity: 1;
    height: 275px;
    width: 300px;
  }
  .mui-popover .mui-popover-arrow.mui-bottom:after{
    display: none;
  }
  .mui-popover{
    padding:0;
  }
  #popover{
    height: 200px;
    overflow-y :auto;
    color:#000;
    background:#f5f7fa;
    padding: 5px 15px;
    line-height: 25px;
  }
  .query{
    position: absolute;
    bottom: 0px;
    left: 40%;
    border-radius: 20px;
    width: 70px;
    padding: 5px;
    font-size: 13px;
    text-align: center;
    background: #45B97C;
    color: #fff;
  }
  .title{
    font-size: 16px;
    width:50%;
    color: #333;
  }
  .price{
    position: absolute;
    font-size: 14px;
    right: 2rem;
  }
  .price > span{
    color: red;
  }
  .mui-card-content-inner {
    position: relative;
    padding: 8px;
  }
  .mui-card {
    font-size: 14px;
    position: relative;
    overflow: hidden;
     margin: 0px;
    background-color: white;
    background-clip: padding-box;
    box-shadow: none;
  }
  .mui-card-header {
    font-size: 16px;
    border-radius: 2px 2px 0 0;
  }
  .bqico span.ico_dq {
    color: #ffa442;
    border-color: #ffa442;
  }
  .bqico span {
    font-size: 0.6rem;
    padding: 2px 3px 2px 3px;
    margin-right: 5px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2x;
    border: 1px solid #ccc;
  }
  .bqico {
    white-space: nowrap;
  }
  .bqico span{
    border-radius: 5px;
  }
  .mar {
    margin: 15px 15px 10px 15px;
    height: 20px;
  }
  .bqico span.ico_nl {
    color: #55bddd;
    border-color: #55bddd;
  }
  .bqico span.ico_xz {
    color: #ff889c;
    border-color: #ff889c;
  }
  .bqico span.ico_gz {
    color: #88b5f1;
    border-color: #88b5f1;
  }
  .bqico span.ico_sg {
    color: #58c25b;
    border-color: #58c25b;
  }
  .mui-card-header, .mui-card-footer {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    min-height: 40px;
    padding: 10px 15px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .mem_top {
    background: url(/static/images/mem_bg.png) bottom no-repeat #45B97C;
    height: 220px;
  }
  .cen {
    text-align: center;
  }
  .mem_ico img {
    width: 20px;
    height: 20px;
    margin: 5px;
  }
  .mui-card-header:after, .mui-card-footer:before{
    height: 0px;
  }
  .resume_title{
    color: #45B97C;
  }
  a.back {
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 1.2rem;
    background: url(/static/images/back.png) left center no-repeat;
    background-size: auto 20px;
    color: #fff;
    width: 100px;
  }
  .over{
    padding-left: 15px;
  }
  .hui {
    color: #969696;
    padding-left: 15px;
    margin-bottom: 0px;
  }
  .f12 {
    font-size: 0.65rem;
  }
  .mui-input-row{
    height: 70px;
    border-bottom: 1px solid #f7f7f7;
    padding: 10px;
  }
  .totast-title{
    text-align: center;
    font-size: 16px;
    background: #f2f2f2;
    height: 40px;
    line-height: 40px;
  }
  .totast-footer{
    height: 42px;
    background: #fff;
  }
</style>
