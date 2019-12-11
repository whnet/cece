<template>
  <div class="mui-content">
          <div class="cnt-box" id="header">
            <div class="ui-cell cnt-tex">
              <div>
                总积分<br />
                <b>{{ sum }}</b>
                <span>分</span>
              </div>
              <div>已兑换<br />
                <b>{{ hand }}</b>
                <span>分</span>
                <span class="duihuan enable" v-if="sum - hand > 0" @click="duihuan()">【积分换礼】</span>
                <span class="duihuan" v-else>【积分换礼】</span>
              </div>
            </div>
            <div class="tab">
              <div class="ui-cell tab-title">
                <div><span class="tab-bt" :class="[tabjifen ? 'active' : '']" @click="tab(1)">收入记录</span></div>
                <div><span class="tab-bt" :class="[tabwithdraw ? 'active' : '']" @click="tab(2)">兑换记录</span></div>
              </div>
            </div>
          </div>
            <div id="jifen" :style="{'height': msgContent,'display':tabjifen ? 'block':'none'}">
              <div class="list thismon" v-for="(item,i) in jifen">
                <div class="ui-cell item">
                  <div class="item-info ui-cell-primary">
                    <div>+{{ item.price }}</div>
                  </div>
                  <div class="item-tex ui-cell-primary">订单完成</div>
                </div>
              </div>
              <div id="loadMorejifen" :style="{'display':tabjifen ? 'block':'none'}"></div>
            </div>

            <div id="withdraw" :style="{'height': msgContent,'display':tabwithdraw ? 'block':'none'}">
              <div class="list thismon" v-for="(item,i) in withdraw">
                <div class="ui-cell item">
                  <div class="item-info ui-cell-primary">
                    <div v-if="item.plus == '1' ">+{{item.jifen}}</div>
                    <div v-else>-{{item.jifen}}</div>
                  </div>
                  <div class="item-tex ui-cell-primary">{{item.msg}}</div>
                </div>
              </div>
              <div id="loadMorewithdraw" :style="{'display':tabwithdraw ? 'block':'none'}"></div>
            </div>
    <sharenone></sharenone>
  </div>
</template>

<script>
  import { Group, Selector } from 'vux'
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
  export default {
    name: 'jifen',
    components: {
      Group,
      Selector
    },
    data () {
      return {
        tabjifen: 1,
        tabwithdraw: 0,
        msgContent:0,
        sum:0,
        hand:0,
        jifen:[],
        withdraw:[],
      }
    },
    mounted () {
      let header = document.getElementById('header').offsetHeight
      window.msgContent = document.documentElement.clientHeight
      this.msgContent = (window.msgContent - header) + 'px'
      if(cookie.getCookie('mid') == null){
        this.getWechatAuth()
      }
      this.jifens()
      this.withdraws()
    },
    methods: {
      duihuan(){
        let jifen = this.sum - this.hand
        this.$api.jifen('post',{
          'member':  cookie.getCookie('mid'),
          'openid': cookie.getCookie('openid'),
          'jifen': jifen,
        }).then(res => {
          window.location.href = config.KEFU_CENTER
        })
      },
      tab (val) {
        if(val == 1){
          this.tabjifen = 1
          this.tabwithdraw = 0
          this.jifens()
        }else if(val == 2){
          this.tabjifen = 0
          this.tabwithdraw = 1
          this.withdraws()
        }
      },
      jifens(){
        let that = this;
        layui.use('flow', function(){
          let flow = layui.flow;
          let $ = layui.jquery
            ,element = layui.element;
          flow.load({
            elem: '#jifen'
            ,isAuto:true
            ,scrollElem: '#jifen'
            ,loadMore:'#loadMorejifen'
            ,done: function(page, next){
              let data = {
                'page': page,
                'sum': 1,
                'type': 'jifen',
              }
              that.$api.orders(data,0,0).then(res => {
                let result = res.data.results
                if(result.length){
                  that.sum = result[0].sum
                }else{
                  this.tabjifen = 0
                }
                if(page == 1){
                  that.jifen = []
                }
                that.jifen = that.jifen.concat(result)
                next('', page < Math.ceil(res.data.count / 10 ));
              })
            }
          });
        });
      },
      withdraws(){
        let that = this;
        layui.use('flow', function(){
          let flow = layui.flow;
          let $ = layui.jquery
            ,element = layui.element;
          flow.load({
            elem: '#withdraw'
            ,isAuto:true
            ,scrollElem: '#withdraw'
            ,loadMore:'#loadMorewithdraw'
            ,done: function(page, next){
              that.$api.jifen('get',{'page': page,}).then(res => {
                let result = res.data.results.data
                if(result){
                  that.hand = res.data.results.cash
                }
                if(page == 1){
                  that.withdraw = []
                }
                that.withdraw = that.withdraw.concat(result)
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
  #jifen{
    overflow: scroll;
    background:#fff;
  }
  #withdraw{
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
