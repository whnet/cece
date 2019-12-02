<template>
  <div class="mui-content">downChatRecord</div>
</template>

<script>
  import * as utils from '../../utils/rongyun'
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
  export default {
    data () {
      return {
        msgContent:[],
        targetId:''
      }
    },
    created () {
      this.getOrderInfo()
    },
    methods: {
      // 得到这个订单的具体信息，从而找到mid_id, tomid_idmyordertaking
      getOrderInfo: function () {
        return this.$api.ciciouuml(this.$route.query.orderid).then(res => {
          // 以老师的名义去获取聊天记录
          let userId = res.data.tomember+res.data.out_trade_no
          let userName = res.data.tomember+res.data.out_trade_no
          let targetId = res.data.mid+res.data.out_trade_no
          this.targetId = targetId
          this.getRongYunToken(userId,userName)
        })
      },
      // 得到融云的token
      getRongYunToken: function (userId,userName) {
        // 聊天对方的信息，格式为 mid + out_trade_no + tomember(非老师的按照0补位)
        let data = {
          'userId': userId,
          'userName': userName,
          'avatar': 'vip',
        }
        return this.$api.downrongyun(data).then(res => {
          this.startInit(res.data.token)
        })
      },
      // 初始化融云
      startInit: function (rongyun_token) {
        const that = this
        let orderid = this.$route.query.orderid

        let callbacks = {
          getCurrentUser(userInfo) {
            that.getHistoryMessages();
          },
          receiveNewMessage(msg) {
            let history = that.msgContent //changeMessage
          },
        };
        utils.init(rongyun_token, callbacks)
      },
      getHistoryMessages: function () {
        const that = this
        console.log(that.targetId)
        let conversationType = RongIMLib.ConversationType.PRIVATE
        let targetId = that.targetId
        let timestrap = null;
        let count = 20;
        RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
          onSuccess: function(list, hasMsg) {
            let arr = list
            that.msgContent = arr.concat(that.msgContent)
            if(hasMsg){
              that.getHistoryMessages()
            }else{
              let logs = JSON.stringify(Object.values(that.msgContent))
              // 重新写一个方法，没有任何的权限限制
              return that.$api.chatlogs(that.$route.query.orderid,{'chatrecord':logs}).then(res => {
              })
            }
          },
        });
      },
    },
  }
</script>

