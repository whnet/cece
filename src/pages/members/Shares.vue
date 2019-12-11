<template>
  <div class="mui-content">
    <div class="ui-page-group">
      <div class="ui-page ui-page-current">
        <div class="ui-content">
          <div class="cnt-box">
            <div class="ui-cell cnt-tex">
              <div>总计邀请好友<br /><b>{{ shareNums }}</b><span>人</span></div>
              <div>总计下单<br /><b>{{ orderNums }}</b><span>次</span></div>
            </div>
          </div>
          <div class="tab">
            <div class="ui-cell tab-title">
              <div><span class="tab-bt" :class="[tabshare ? 'active' : '']" @click="tab(1)">邀请记录</span></div>
              <div><span class="tab-bt" :class="[taborder ? 'active' : '']" @click="tab(2)">下单记录</span></div>
            </div>
            <div id="share-list" :style="{'display':tabshare ? 'block':'none'}">
              <div class="list thismon list-title">
                <div class="ui-cell item">
                  <div class="item-info share">用户</div>
                  <div class="item-info share">昵称</div>
                  <div class="item-info share">绑定时间</div>
                </div>
              </div>
              <div class="list thismon" v-for="(item, key) in  sharedata">
              <div class="ui-cell item">
                <div class="item-info share"><img :src="item.avatar"></div>
                <div class="item-info share">{{ item.nickname }}</div>
                <div class="item-info share">{{ Format(item.bindtime) }}</div>
              </div>
            </div>
            </div>
            <div id="order-list" :style="{'display':taborder ? 'block':'none'}">
            <div class="list thismon list-title">
              <div class="ui-cell item">
                <div class="item-info">昵称</div>
                <div class="item-info">项目</div>
                <div class="item-info">金额</div>
                <div class="item-info">绑定</div>
                <div class="item-info">下单</div>
              </div>
            </div>
            <div class="order-list" v-for="(item , key) in orderdata">
              <div class="list thismon">
                <div class="ui-cell item">
                  <div class="item-info">{{ substring(item.buy_name) }}</div>
                  <div class="item-info">{{ substring(item.teacher_name) }}-{{ substring(item.title) }}</div>
                  <div class="item-info">{{ item.price }}元</div>
                  <div class="item-info created">{{ item.created }}</div>
                  <div class="item-info created">{{ item.created }}</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <sharenone></sharenone>
  </div>
</template>

<script>
  import { Group, Selector, dateFormat} from 'vux'
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
  export default {
    name: 'Recrult',
    components: {
      Group,
      Selector,
    },
    data () {
      return {
        tabshare: 1,
        taborder: 0,
        sharedata:[],
        orderdata:[],
        shareNums:0,
        orderNums:0,
      }
    },
    created () {
      this.getShareData()
      this.getOrderData()
    },
    methods: {
      substring:function(string){
        return string.substring(0,2);
      },
      tab (val) {
        if(val == 1){
          this.tabshare = 1
          this.taborder = 0
          this.getShareData()
        }else if(val == 2){
          this.tabshare = 0
          this.taborder = 1
          this.getOrderData()
        }
      },
      Format: function(time) {
        return dateFormat(time*1000, 'YYYY-MM-DD');
      },
      getShareData: function () {
        return this.$api.share().then(res => {
          this.shareNums = res.data.count
          this.sharedata = res.data.results
        })
      },
      getOrderData: function () {
        return this.$api.shareorder().then(res => {
          this.orderNums = res.data.count
          this.orderdata = res.data.results
        })
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
  .created{
    font-size: 12px;
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
  .name{
    text-align: center;
    color:#0c0c0c;
  }
  .bindtime{
    color: #999999;
    text-align: left;
  }
  .order-status{
    text-align: right;
    color: #999999;
  }
  .order-des{
    text-align: right;
    color: #999999;
  }
  .item-info{
    text-align:center;
    width:20%;
  }
  .list-nickname{
    width:15%;
  }
  .list-project{
    width:50%;
  }
  .list-cash{
    width:20%;
  }
  .list-time{
    width:15%;
  }
  .share{
    width:33.33%
  }
  .share img{
    width: 25px;
    border-radius: 5px;
  }
  .thismon,.order-list{
    border-bottom: 1px solid #f5f7fa;
  }
</style>
