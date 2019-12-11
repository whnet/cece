<template>
  <div class="mui-content">
    <div class="cnt-box" id="header">
      <div class="ui-cell cnt-tex">
        <!--总收入=订单结束7天无退款-->
        <div>总收入<br /><b>{{ sumwithdraw }}</b><span>元</span><br>
          <span style="font-size:10px">总收入=订单结束后7日无退款金额</span></div>
        <div>可提现<br /><b>{{ sumwithdraw - hadwithdraw }}</b><span>元</span><br/>
          <span style="font-size:10px">可提现=总收入-已提现</span>
          <span class="duihuan enable" v-if="sumwithdraw - hadwithdraw > 0" @click="tixian()">【提现】</span>
          <span class="duihuan" v-else>【不能提现】</span>
        </div>
      </div>
      <div class="tab">
        <div class="ui-cell tab-title">
          <div><span class="tab-bt" :class="[tabtotal ? 'active' : '']" @click="tab(1)">支付记录</span></div>
          <div><span class="tab-bt" :class="[taborder ? 'active' : '']" @click="tab(2)">提现记录</span></div>
        </div>
      </div>
    </div>

    <div id="total" :style="{'height': msgContent,'display':tabtotal ? 'block':'none'}">
      <div class="list thismon" v-for="(item,i) in total">
        <div class="ui-cell item">
          <div class="item-info ui-cell-primary">
            <div>¥{{ item.price }}</div>
          </div>
          <div class="item-tex ui-cell-primary" v-if="item.status == 1">待接单</div>
          <div class="item-tex ui-cell-primary" v-else-if="item.status == 2">已退款</div>
          <div class="item-tex ui-cell-primary" v-else-if="item.status == 3">进行中</div>
          <div class="item-tex ui-cell-primary" v-else-if="item.status == 4">待评价</div>
          <div class="item-tex ui-cell-primary" v-else-if="item.status == 5">已完成</div>
          <div class="item-tex ui-cell-primary" v-else-if="item.status == 6">已付款</div>
          <div class="item-tex ui-cell-primary" v-else>未付款</div>
        </div>
      </div>
      <div id="loadMoretotal" :style="{'display':tabtotal ? 'block':'none'}"></div>
    </div>

    <div id="order" :style="{'height': msgContent,'display':taborder ? 'block':'none'}">
      <div class="list thismon" v-for="(item,i) in order">
        <div class="ui-cell item">
          <div class="item-info ui-cell-primary">
            <div>¥{{ item.price }}</div>
          </div>
          <div class="item-tex ui-cell-primary" v-if="item.status == 1">完成打款</div>
          <div class="item-tex ui-cell-primary" v-else>等待打款</div>
        </div>
      </div>
      <div id="loadMoreorder" :style="{'display':taborder ? 'block':'none'}"></div>
    </div>
    <sharenone></sharenone>
  </div>
</template>

<script>
  import { Group, Selector } from 'vux'
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
  export default {
    name: 'Income',
    components: {
      Group,
      Selector
    },
    data () {
      return {
        tabtotal: 1,
        taborder: 0,
        msgContent:0,
        total:[],
        order:[],
        sumwithdraw:0,
        hadwithdraw:0,
        cash:0,
      }
    },
    created () {
      if(cookie.getCookie('token')) {
        let header = document.getElementById('header').offsetHeight
        window.msgContent = document.documentElement.clientHeight
        this.msgContent = (window.msgContent - header) + 'px'
        if (cookie.getCookie('mid') == null) {
          this.getWechatAuth()
        }
        this.totals()
        this.orders()
        this.havewithdraw()
      }
    },
    methods: {
      tixian(){
        let data={
          'member':cookie.getCookie('mid'),
          'openid':cookie.getCookie('openid'),
          'price': this.sumwithdraw - this.hadwithdraw
        }
        this.$api.withdraw(data).then(res => {
          this.$vux.toast.text('申请成功')
          this.sumwithdraw = 0
          this.hadwithdraw = 0
          setTimeout(() => {
            window.location.href = '/#/center'
          }, 2000)
        })
      },
      tab (val) {
        if(val == 1){
          this.tabtotal = 1
          this.taborder = 0
          this.totals()
        }else if(val == 2){
          this.tabtotal = 0
          this.taborder = 1
          this.havewithdraw()
        }
      },
      totals(){
        let that = this;
        layui.use('flow', function(){
          let flow = layui.flow;
          let $ = layui.jquery
            ,element = layui.element;
          flow.load({
            elem: '#total'
            ,isAuto:true
            ,scrollElem: '#total'
            ,loadMore:'#loadMoretotal'
            ,done: function(page, next){
              that.$api.income('get',{'page': page,'m':'pay'}).then(res => {
                let result = res.data.results.list
                that.cash = res.data.results.cash
                if(page == 1){
                  that.total = []
                }
                that.total = that.total.concat(result)
                next('', page < Math.ceil(res.data.count / 10 ));
              })
            }
          });
        });
      },
      orders(){
        let that = this
        that.$api.income('get',{'page': 1,'m':'income'}).then(res => {
          that.sumwithdraw = res.data.results.sum
        })
      },
      havewithdraw(){
        let that = this;
        layui.use('flow', function(){
          let flow = layui.flow;
          let $ = layui.jquery
            ,element = layui.element;
            flow.load({
              elem: '#order'
              ,isAuto:true
              ,scrollElem: '#order'
              ,loadMore:'#loadMoreorder'
              ,done: function(page, next){
                that.$api.havewithdraw().then(res => {
                  let result = res.data.results
                  if(result.length){
                    that.hadwithdraw = result[0].sum
                  }
                  if(page == 1){
                    that.order = []
                  }
                  that.order = that.order.concat(result)
                  next('', page < Math.ceil(res.data.count / 10 ));
                })
              }
            });
        });
      },
    }
  }
</script>

<style lang="css" scoped>
  @import '../../../static/bc/css/etui.css';
  @import '../../../static/bc/css/common.css';
  @import '../../../static/bc/css/share.css';
  .avatar{
    height: 30px;
    width: 30px;
  }
  div{
    text-align:center
  }
  .list-avatar{
    width:45px;
  }
  .list-nickname{
    widht:65px
  }
  .list-cash{
    widht:45px
  }
  #total{
    overflow: scroll;
    background:#fff;
  }
  #order{
    overflow: scroll;
    background:#fff;
  }
  .tab{
    margin-top:0;
  }
  .duihuan{
    position: absolute;
    right: 0px;
    top: 10px;
    font-size:13px;
  }
  .enable{
    color:#6db57b!important;
  }
</style>
