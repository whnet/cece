<template>
  <div class="mui-content">
      <div class="ui-tab tab-list" id="header">
        <ul class="ui-tab-nav ui-row ui-no-gutter">
          <li class="ui-col-25" @click="changetab(1)" :class="{current:cur==1}">待接单</li>
          <li class="ui-col-25" @click="changetab(3)" :class="{current:cur==3}">进行中</li>
          <li class="ui-col-25" @click="changetab(4)" :class="{current:cur==4}">待评价</li>
          <li class="ui-col-25" @click="changetab(0)" :class="{current:cur==0}">全部</li>
        </ul>
      </div>
      <div class="msg-content mui-slider-group" :style="{'height': msgContent}" id="all">
        <div class="ui-tab-content" v-if="list.length > 0">
          <div class="ui-cells" v-for="(item, i) in list">
            <div class="ui-cell">
              <div class="ui-cell-primary box-zhong">
                <div class="ui-nowrap-1">{{item.title}}</div>
                <div class="order-price">价格：￥{{item.price}}</div>
                <div class="order-time"><span class="order">订单号：{{item.out_trade_no}}</span><span class="time">{{item.created}}</span></div>
              </div>
            </div>
            <div class="ui-cell list-bottom" v-if="item.status == 0">
              <div class="ui-cell-primary">
                <a class="go-payment">未付款</a>
              </div>
            </div>
            <div class="ui-cell list-bottom" v-if="item.status == 1">
              <div class="ui-cell-primary">
                <a class="go-evaluate wait" v-if="item.kaiqi == 1 && item.status == 1" @click="goChat(item.id)">去接单</a>
                <a class="go-payment" v-else-if="item.kaiqi == 0 && item.status == 1">未开启</a>
              </div>
            </div>
            <div class="ui-cell list-bottom" v-if="item.status == 2">
              <div class="ui-cell-primary">
                <a class="go-evaluate">已退款</a>
              </div>
            </div>
            <div class="ui-cell list-bottom" v-if="item.status == 3">
              <div class="ui-cell-primary">
                <a class="go-evaluate" @click="goChat(item.id)">进行中</a>
              </div>
            </div>
            <div class="ui-cell list-bottom" v-if="item.status == 4">
              <div class="ui-cell-primary">
                <a class="see-order" @click="goChat(item.id)">待评价</a>
              </div>
            </div>
            <div class="ui-cell list-bottom" v-if="item.status == 5">
              <div class="ui-cell-primary">
                <a class="see-order" @click="goChat(item.id)">已完成</a>
              </div>
            </div>
          </div>
        </div>
        <div id="loadMore"></div>
      </div>
    <!--<common-footer></common-footer>-->
  </div>
</template>
<script>
  import { Tab, TabItem, Search, Scroller, XHeader, Divider, FormPreview, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import cookie from '../../../static/js/cookie'
  export default {
    components: {
      Search,
      Scroller,
      XHeader,
      Divider,
      TabItem,
      Tab,
      FormPreview,
      Confirm
    },
    directives: {
      TransferDom
    },
    data () {
      return {
        moreLoading: true,
        showid: 0,
        show: false,
        note: '',
        cur: 1,
        msgContent: 0,
        page: 1,
        list: [],
      }
    },
    mounted (){
      this.getOrders();
      let header = document.getElementById('header').offsetHeight
      // let footer = document.getElementById('footer').offsetHeight
      window.msgContent = document.documentElement.clientHeight
      this.msgContent = (window.msgContent - header - 50) + 'px'
      window.onresize = () => {
        return (() => {
          window.msgContent = document.documentElement.clientHeight
          this.msgContent = (window.msgContent - header - 50) + 'px'
        })()
      }
    },
    methods: {
      kaiqi (id) {
        this.show = true
        this.showid = id
        return
      },

      onConfirm (msg) {
        let data = {
          "kaiqi": 1,
          "status": 1,
        }
        return this.$api.order(data, this.showid).then(res => {
          // 开启成功后，跳转到聊天界面
          this.show = false
          this.goChat(this.showid)
        })
      },

      goChat(id){
        this.$router.push({path:'/chat', query: {orderid: id}})
        return;
      },

      changetab (i) {
        this.list = []
        this.cur = i
        let header = document.getElementById('header').offsetHeight
        // let footer = document.getElementById('footer').offsetHeight
        window.msgContent = document.documentElement.clientHeight
        this.msgContent = (window.msgContent - header - 50) + 'px'
        window.onresize = () => {
          return (() => {
            window.msgContent = document.documentElement.clientHeight
            this.msgContent = (window.msgContent - header - 50) + 'px'
          })()
        }
        this.getOrders()
      },

      getOrders (){
        let that = this;
        let teacher =  cookie.getCookie('tid')
        let status = that.cur
        layui.use('flow', function(){
          let flow = layui.flow;
          let $ = layui.jquery
            ,element = layui.element;

          flow.load({
            elem: '#all' //流加载容器
            ,isAuto:true
            ,scrollElem: '#all' //滚动条所在元素，一般不用填，此处只是演示需要。
            ,loadMore:'#loadMore'
            ,done: function(page, next){
              if(status){
                let data = {
                  'teacher': teacher,
                  'page': page,
                  'status':status,
                  'type':'taking',
                }
                that.$api.orders(data).then(res => {
                  that.list = that.list.concat(res.data.results)
                  next('', page < Math.ceil(res.data.results.length / 10 ));
                })
              }else{
                let data = {
                  'teacher': teacher,
                  'page': page,
                  'type':'taking',
                }
                that.$api.orders(data).then(res => {
                  that.list = that.list.concat(res.data.results)
                  next('', page < Math.ceil(res.data.count / 10 ));
                })
              }
            }
          });
        });
      }
    }
  }
</script>

<style lang="css" scoped>
  @import '../../../static/bc/css/etui.css';
  @import '../../../static/bc/css/common.css';
  @import '../../../static/bc/css/quick.css';
  .list-right{
    width: 20%;
    color: #666
  }
  .active{
    display:block;
  }
  .nodisplay{
    display:none;
  }
  .ui-tab{
    position: fixed;
    width:100%;
    z-index:999;
    top:0;
  }
  .ui-tab-content{
    margin-top: 0rem;
  }
  .ui-cells{
    margin-top: 0rem;
    margin-bottom: 8px;
  }
  .ui-cell {
    padding: 0.2rem 0;
    margin: 0 0.75rem;
  }
  .msg-content{
    overflow: scroll;
    position: relative;
    top: 45px;
  }
  .order-time{
    text-aligh:right;
  }
  .ui-tab-nav .current {
    color: #6db57b;
    border-bottom: 2px #6db57b solid;
  }
  .go-payment{
    color: #fff !important;
    background: #ccc;
  }
  .wait{
    width: 5.5rem;
    color: #fff !important;
    background: #ccc;
  }
  .box-zhong{
    color: #666666;
  }
  .order{
    float:left;
  }
  .time{
    float: right;
  }
  .box-zhong div:nth-of-type(2) {
    color: #FE7467;
    font-size: 0.75rem;
  }
  .order-time{
    text-aligh:right;
  }
</style>
