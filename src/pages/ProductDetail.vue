<template>
<div class="mui-content" v-wechat-title="this.detailtitle">
  <div class="mui-card" v-if="info.id">
    <div class="mui-card-content">
      <!--注意host是否配置成了生产环境-->
      <img :src="host + info.big" class="product_cover">
    </div>
    <h2>{{ info.title }}</h2>
    <div class="article-content" v-html="info.des"></div>
    <div class="options">
      <span>{{ buy }}次购买</span>
      <span>{{ ganxie }}次感谢</span>
    </div>
  </div>
  <comments v-if="info.id"></comments>
  <nav class="mui-bar mui-bar-tab" v-if="info.id" >
    <a class="mui-tab-item">
      <p class="mui-tab-label" style="color:#323232;margin:0;">72小时未回复</p>
      <p class="mui-tab-label" style="color:#666666;margin:0;font-size:.65rem;">会原路退款</p>
    </a>
    <a class="mui-tab-item" style="background: #f3c583;" @click="toPay()">
      <span class="mui-tab-label btn-order" :data-price="0" v-if="info.price == '0.00' ">免费下单</span>
      <span class="mui-tab-label btn-order" :data-price="info.price" v-else>支付{{info.price}}元</span>
    </a>
  </nav>
  <shareall></shareall>
</div>
</template>

<script>
  import { Swiper, SwiperItem, Grid, GridItem } from 'vux'
  import Comments from '../components/common/Comments'
  import cookie from '../../static/js/cookie'
  export default {
    components: {
      Swiper,
      SwiperItem,
      Grid,
      GridItem,
      Comments
    },
    data () {
      return {
        detailtitle:'逛逛',
        info: [],
        ganxie:0,
        buy:0,
        host: config.DOMAIN_HOST,
      }
    },
    mounted () {
      if(cookie.getCookie('token')){
        this.getShopInfo()
      }
    },
    methods: {
      getShopInfo: function () {
        return this.$api.shopDetail(this.$route.query.pid).then(res => {
          this.info = res.data || ''
          this.ganxie = res.data.data.ganxie
          this.buy = res.data.data.buy
          this.detailtitle = res.data.title

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
              title: res.data.title,
              desc: '感受文化、分享智慧'
            }
            this.wxShareReady(shareInfo);
          })

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
      toPay: function () {
        this.$vux.loading.show({text: '发起支付'})
        console.log(cookie.getCookie('openid'))
        let data = {
          'price': this.info.price,
          'title': this.info.title,
          'detail': this.info.des,
          'type': 'guangyiguang',
          'tid': this.info.teacher, //成为老师ID（teacher表中）
          'tomember_id': this.info.mid, //所属老师的ID （user表中）
          'mid_id': Number(cookie.getCookie('mid')), //购买用户
          'openid': cookie.getCookie('openid'),
          'pid':  this.$route.query.pid,
          'belong':  '0',
        }
        return this.$api.wechatpay(data).then(res => {
          if(this.info.price == '0.00'){
           this.$router.push({path: '/#/myorders'})
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
            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
              window.location.href = '/#/myorders';
            }
          });
      }
    }
  }
</script>

<style scoped>
  .btn-order{
    color:#fff;
  }
  .btn-kefu{
    background: #6db57b;
  }
  .product_cover{
    width:100%;
    height: 180px;
    background: #fff;
  }
  .mui-content>.mui-card:first-child{
    margin: 0;
  }
  .Collection{
    color: rgb(255, 255, 255);
  }
  .Collection-icon{
    color: rgb(255, 255, 255);
  }
  .detail-title{
    color: #fff;
    position: absolute;
    bottom: 5px;
    left: 0;
    font-size: 0.75rem;
    width: 100%;
    padding: 1rem;
    background: rgba(0,0,0,.6);
    background: -webkit-linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.6),rgba(0,0,0,.8));
    background: -o-linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.6),rgba(0,0,0,.8));
    background: -moz-linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.6),rgba(0,0,0,.8));
    background: linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.6),rgba(0,0,0,.8));
  }
  .detail-sc{
    width: 13%;
    text-align: center;
    position: absolute;
    top: 0;
    left: 5%;
    padding: 0.2rem 0;
  }
  .article-content{
    padding: 5px 15px 0px 15px;
    line-height: 1.5;
    color: #3A3A3A;
  }
  .mui-card-link{
    font-size: 0.7rem;
  }
  .mui-card{
    margin:0;
  }
  .date{
    float: right;
    margin-right: 30px;
  }
  a.back {
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 1.2rem;
    background-size: auto 20px;
    color: #fff;
    width: 100px;
  }
  .mui-card{
    box-shadow: none;
  }
  .mui-card-footer{
    background: #f7f7f7;
  }
  h2{
    padding: 5px 0px 0px 15px;
    line-height: 30px;
    font-size: 18px;
  }
  .options{
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #999;
  }
  .options span{
    padding: 0 15%;
  }
</style>
