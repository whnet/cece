<template>
  <div class="mui-content">
    <x-header id="header" :right-options="{showMore: true}"
              @on-click-more="showMenus = true">与{{ duifangInfo.nickname?duifangInfo.nickname:duifangInfo.name }}聊天</x-header>
    <div class="msg-content" :style="{'height': msgHeight}">
      <!--聊天样式    -->
      <!--历史消息的时间-->
      <p class="chat-history-date"></p>
      <!--历史消息时间END-->
      <!--接受消息-->
      <div id="msg-rongyun-content" class="msg-rongyun-content">
        <!--用户发送一条消息给老师-->
        <div class="chat-sender" v-if="order.mid == mid">
          <div class="chat-avatar">
            <img :src="sendInfo.avatar">
          </div>
          <div class="chat-content">
            <div class="chat-triangle"></div>
            <span>老师好，拍下了 {{ order.title }}~</span>
          </div>
        </div>
        <!--用户发送一条消息给老师END-->
        <!--提示老师进行接单-->
        <div v-if="order.mid == duifangInfo.id">
          <div class="chat-receiver">
            <div class="chat-avatar">
              <img :src="duifangInfo.avatar">
            </div>
            <div class="chat-content">
              <div class="chat-triangle"></div>
              <span>老师好，拍下了 {{ order.title }}~</span>
            </div>
          </div>
          <div style="position: absolute;bottom: 5rem;width: 100%;" v-if="status == 3">
            <span class="jiedan" @click="jiedan(1)">接单</span>
            <span class="judan" @click="jiedan(0)">拒单</span>
          </div>
        </div>

        <div class="chat-sender" v-if="item.senderUserId == orderid+'_'+sendInfo.openid" v-for="(item, key) in msgContent">
          <div class="chat-avatar">
            <img :src="sendInfo.avatar">
          </div>
          <div class="chat-content">
            <div class="chat-triangle"></div>
            <span>{{item.content.content}}</span>
          </div>
        </div>

        <div class="chat-receiver" v-else>
          <div class="chat-avatar">
            <img :src="duifangInfo.avatar">
          </div>
          <div class="chat-content">
            <div class="chat-triangle"></div>
            <span>{{item.content.content}}</span>
          </div>
        </div>

      </div>
      <!--发送消息END-->
      <!--发送图片消息-->
      <div class="chat-receiver" style="display:none">
        <div class="chat-avatar">
          <img :src="sendInfo.avatar">
        </div>
        <div class="chat-content">
          <div class="chat-triangle"></div>
          <img :src="sendInfo.avatar">
        </div>
      </div>
      <!--发送图片消息END-->
      <!--评价功能 如果状态=4（待评价），并且查看订单的是用户，则显示评价框-->
      <div class="comment-chat-display" v-if="(order.status == 4 || status == 5) && order.mid == mid">
        <p class="comment-msg"><divider>服务已结束，老师的服务有帮助到您，请点击：</divider></p>
        <div class="comment-chat-content">
          <div class="ganxie" @click="ganxie" v-if="ganxieStatus == 0">谢谢老师</div>
          <div class="ganxie" style="color:#ea0505"  v-else>已感谢</div>
          <textarea class="content" placeholder="请填写您对本次服务的评价" v-model="comment"></textarea>
          <div class="pingjia" @click="submitComment()" v-if="order.comments == '' ">提交</div>
          <div class="pingjia" style="background:#d0d0d0" v-else>已评价</div>
        </div>
      </div>
      <!--评价功能END-->
      <!--聊天样式END -->
    </div>
    <group id="footer" v-if="status == 3">
      <x-input placeholder="等待接单" readonly placeholder-align="center"></x-input>
    </group>
    <group id="footer" v-if="status == 4 || status == 5">
      <x-input placeholder="订单结束" readonly placeholder-align="center"></x-input>
    </group>
    <group id="footer" v-if="status == 1">
      <form action="javascript:return true">
        <x-input placeholder="输入内容"  v-reset-page v-model="sendMsg" :min="1" @on-change="change" :show-clear="false" @keyup.enter="enter()">
          <x-button slot="right" mini @click.native="send">发送</x-button>
        </x-input>
      </form>
    </group>
    <group id="footer" v-if="status == 0">
      <x-input placeholder="初始化" readonly placeholder-align="center"></x-input>
    </group>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-if="order.teacher == tid" v-model="showMenus" show-cancel
                   @on-click-menu-jubao="jubao"
                   @on-click-menu-jieshu="jieshu">
      </actionsheet>
      <actionsheet :menus="menu" v-else v-model="showMenus" show-cancel
                   @on-click-menu-jubao="jubao">
      </actionsheet>
    </div>
  </div>
</template>

<script>
  import * as _ from '../../utils/tools'
  import * as utils from '../../utils/rongyun'
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
  import { XHeader, ViewBox, XInput, Group, XButton, Cell, Divider, Actionsheet, TransferDom, dateFormat } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      XInput,
      Group,
      XButton,
      Cell,
      Divider,
      Actionsheet,
      TransferDom,
      dateFormat
    },
    data () {
      return {
        status: 0,
        orderid: this.$route.query.orderid,
        targetId: sessionStorage.getItem("targetId"),
        RongYun: '',
        order: '',
        mid: 0,
        tid: cookie.getCookie('tid'),
        comment: '',
        sendMsg: '',
        sendInfo: [],
        duifangInfo: [],
        sendMsgStatus: false,
        msgContent: [],
        msgHeight: '',
        ganxieStatus: 0,
        menus: {
          jubao: '举报',
          jieshu: '结束订单'
        },
        menu: {
          jubao: '举报老师',
        },
        showMenus: false
      }
    },
    computed: {
      ...mapGetters({
        setInfo: 'userInfo'
      })
    },
    created () {
      let token = cookie.getCookie('token')
      if (token === null) {
        sessionStorage.setItem("url", this.$route.path);
        this.getWechatAuth()
      }else{
        this.getRongYunToken()
        this.getOrderInfo()
        // 初始化融云
        if(sessionStorage.getItem("yunToken")){
          this.startInit()
        }
      }
    },
    mounted () {
      let token = cookie.getCookie('token')
      if (token === null) {
        sessionStorage.setItem("url", this.$route.path);
        this.getWechatAuth()
      }else{
        this.getRongYunToken()
        this.getOrderInfo()
        // 初始化融云
        if(sessionStorage.getItem("yunToken")){
          this.startInit()
        }
      }

      const that = this
      // 通过sessionStorage获得当前活动人的信息
      let sendInfo = {
        'openid': cookie.getCookie('openid'),
        'avatar': sessionStorage.getItem("avatar"),
      }
      that.sendInfo = sendInfo
      let header = document.getElementById('header').offsetHeight
      let footer = document.getElementById('footer').offsetHeight
      window.msgHeight = document.documentElement.clientHeight
      this.msgHeight = (window.msgHeight - header - footer - 20) + 'px'
      setTimeout(function(){
        // console.log('document.body.scrollHeight1'+document.body.scrollHeight)
        document.body.scrollTop = document.body.scrollHeight;
      },300);

      window.onresize = () => {
        return (() => {
          setTimeout(function(){
            // console.log('document.body.scrollHeight2'+document.body.scrollHeight)
            document.body.scrollTop = document.body.scrollHeight;
          },300);
          window.msgHeight = document.documentElement.clientHeight
          this.msgHeight = (window.msgHeight - header - footer - 20) + 'px'
        })()
      }
    },
    methods: {
      // 感谢的状态
      // 感谢功能，只能感谢，不能取消感谢
      ganxie: function () {
        let oid = this.$route.query.orderid
        let mid = this.mid
        let data = {
          'ganxie':1,
        }
        return this.$api.comment(this.$route.query.orderid,data).then(res => {
          this.$vux.toast.text('已感谢')
          this.ganxieStatus = 1
        })
      },
      // 提交评价后，挣个流程就走完了。
      submitComment: function () {
        let comment = this.comment
        if(comment == ''){
          this.$vux.toast.text('内容不能为空')
          return
        }
        let data = {
          "comments": comment,
          "status": 5, // 已完成
        }
        return this.$api.comment(this.$route.query.orderid,data).then(res => {
          this.$vux.toast.text('提交成功')
        }).catch(err => {
          return err
        })
      },
      // 得到这个订单的具体信息，从而找到mid_id, tomid_id
      getOrderInfo: function () {
        return this.$api.orderdetail(this.$route.query.orderid).then(res => {
          let mid = cookie.getCookie('mid')
          // 如果订单的 END
          this.status = res.data.status
          this.mid = mid
          this.comment = res.data.comments
          this.getUserInfo(mid,0) // 得到我自己的信息
          // 获得对方的信息
          if(Number(mid) == res.data.mid){
            this.getUserInfo(res.data.tomember,1)
          }else{
            this.getUserInfo(res.data.mid,1)
          }
          this.order = res.data
          if(res.data.ganxie == '1'){
            this.ganxieStatus = 1
          }else{
            this.ganxieStatus = 0
          }
        }).catch(err => {
          this.$vux.toast.text('非法操作')
          this.$router.push({path:'/center'})
          return err
        })
      },
      // 得到融云的token
      getRongYunToken: function () {
        // 聊天对方的信息，格式为 orderid + openid + teacher_id(非老师的按照0补位)
        let data = {
          'userId': this.$route.query.orderid + "_" + cookie.getCookie('openid'),
          'userName': this.$route.query.orderid + "_" + cookie.getCookie('openid'),
          'avatar': sessionStorage.getItem("avatar"),
        }
        let yunToken = sessionStorage.getItem("yunToken")

        if(typeof(yunToken) == "undefined" || yunToken == null){
          return this.$api.rongyun(data).then(res => {
            sessionStorage.setItem("yunToken", res.data.token, 999300*1*1)
            // 初始化融云
            this.startInit()
            this.RongYun = res.data
          }).catch(err => {
            return err
          })
        }
      },
      // 初始化融云
      startInit: function () {
        let rongyun_token = sessionStorage.getItem("yunToken") // 融云的token
        let orderid = this.$route.query.orderid
        if(rongyun_token == null){
          console.log('TOKEN为空')
          return
        }
        const that = this
        let callbacks = {
          getCurrentUser(userInfo) {
            console.log("链接成功；userid=" + userInfo.userId)
            // 这里是历史消息，进来先获得历史消息
            let conversationType = RongIMLib.ConversationType.PRIVATE
            let targetId = sessionStorage.getItem("targetId")//对方的openid
            let timestrap = 0;
            let count = 20;
            console.log("正在获取历史消息:"+targetId)
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
              onSuccess: function(list, hasMsg) {
                console.log(list);
                if(list && list.length > 0){
                  that.msgContent = list
                  that.$vux.toast.text('连接成功')
                }
              },
              onError: function(error) {
                console.log("GetHistoryMessages,errorcode:" + error);
              }
            });
          },
          receiveNewMessage(message) {
            // 将对方发送的信息push到历史消息中，这样实现数据驱动，现在历史消息是object
            let history = that.msgContent
            that.msgContent = history.concat(message)
          },
        };
        utils.init(rongyun_token, callbacks)

      },
      // 得到对方用户的信息，自己的信息是从localstore中存放的：openid 和 avatar，传入相应的ID
      getUserInfo: function (id,type) {
        return this.$api.userInfo(id).then(res => {
          if(type == 1){
            console.log(res.data);
            this.duifangInfo = res.data
            // 聊天对方的信息，格式为 orderid + openid
            sessionStorage.setItem("targetId", this.$route.query.orderid + "_" + res.data.openid, 999300*1*1)
          }
        }).catch(err => {
          this.$vux.toast.text('获取个人信息发生错误')
          return err
        })
      },
      // 发送文本消息
      sendTextMsg: function () {
        const that = this
        let msg = new RongIMLib.TextMessage({content:this.sendMsg});
        let conversationtype = RongIMLib.ConversationType.PRIVATE;
        let targetId = sessionStorage.getItem("targetId") //对方的openid
        console.log("对方的ID："+targetId)

        let callbacks = {
          sendMessage(message) {
            console.log('自己发送的消息:' + message)
            // 将自己发送的信息push到历史消息中，这样实现数据驱动，现在历史消息是object
            let history = that.msgContent
            that.msgContent = history.concat(message)
          }
        }
        utils.sendTextMsg(conversationtype, targetId, msg, callbacks)
        this.sendMsg = ''
      },
      // 清除历史消息
      clearRemoteHistoryMessages: function () {
        let targetId = sessionStorage.getItem("targetId")//对方的openid
        console.log('清除历史消息：'+targetId)
        utils.clearRemoteHistoryMessages(targetId)
      },
      getWechatAuth: function () {
        return this.$api.wechatAuth().then(res => {
          window.location.href = res.data.result
        }).catch(err => {
          return err
        })
      },
      jubao () {
        this.$vux.toast.text('举报成功')
      },
      jieshu () {
        // this.clearRemoteHistoryMessages()
        let data = {
          'status': 4, //结束
        }
        return this.$api.order(data,this.$route.query.orderid).then(res => {
          this.$vux.toast.text('订单结束')
          this.status = 4
        })
      },
      change (val) {
        this.sendMsg = val
        val ? this.sendMsgStatus = false : this.sendMsgStatus = true
      },
      jiedan (id) {
        if(id == 1){
          let data = {
            'status': 1,
          }
          //将状态更新为1（进行中）
          return this.$api.order(data,this.$route.query.orderid).then(res => {
            this.$vux.toast.text('接单')
            this.status = 1
          })
        }else{
          let data = {
            'status': 7, //拒绝
          }
          return this.$api.order(data,this.$route.query.orderid).then(res => {
            this.$vux.toast.text('拒单')
          })
        }
      },
      send () {
        // 单独写一个方法，在这里还可以做一些操作。
        // this.sendTextMsg()
        return true
      }
    },
    watch: {
      msgHeight (val) {
        if (!this.timer) {
          this.msgHeight = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.timer = false
          }, 400)
        }
      }
    }
  }
</script>

<style scoped>
  .content{
    font-size: 12px;
    height: 100px;
  }
  .ganxie{
    background:#fff;
    color:#07C160;
    font-size:14px;
    text-align: center;
    width: 60px;
    margin: 0px auto 10px auto;
    border-radius: 20px;
  }
  .msg-content::-webkit-scrollbar {
    display:none
  }
  .mui-content /deep/ .weui-cell__ft{
    color: #999999;
    margin-left: 10px;
    margin-top: -15px;
  }
  .msg-content{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .mui-content /deep/ .weui-cells{
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 17px;
    overflow: hidden;
    position: relative;
    height: 60px;
    bottom: 0px;
  }

  .mui-content /deep/ .weui-btn_mini{
    display: inline-block;
    height: 40px;
    line-height: 2.3;
    font-size: 13px;
  }
  .weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .mui-content /deep/ .weui-btn:after{
    border:none
  }
  .vux-x-icon {
    fill: #F70968;
  }
  .cell-x-icon {
    display: block;
    fill: #999;
    margin-left: 10px;
  }
  input[type=text]{
    width: 100%;
    height: 40px;
    margin-bottom: 15px;
    padding: 10px 15px;
    -webkit-user-select: text;
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 30px;
    outline: none;
    background-color: #fff;
    -webkit-appearance: none;
  }
  /*聊天消息样式*/
  .chat-history-date{
    display: block;
    padding-top: 5px;
    text-align: center;
    font-size: 12px;
  }
  .chat-receiver,.chat-sender{
    margin: 5px;
    clear:both;
    height: 50px;
  }
  .chat-avatar img{
    width: 40px;
    height: 40px;
  }
  .chat-receiver .chat-avatar{
    float: left;
  }
  .chat-sender .chat-avatar{
    float: right;
  }
  .chat-content{
    position: relative;
    max-width: 60%;
    min-height: 20px;
    margin: 0 10px 0px 10px;
    padding: 10px;
    font-size:15px;
    border-radius:7px;
  }
  .chat-content img{
    width: 100%;
  }
  .chat-receiver .chat-content{
    float: left;
    color: #383838;
    background-color: #fff;
    margin-bottom: 12px;
  }
  .chat-sender .chat-content{
    float:right;
    color: #ffffff;
    background-color: #07C160;
    margin-bottom: 12px;
  }
  .chat-triangle{
    position: absolute;
    top:6px;
    width:0px;
    height:0px;
    border-width:8px;
    border-style:solid;
  }
  .chat-receiver .chat-triangle{
    left:-16px;
    border-color:transparent #fff transparent transparent;
  }
  .chat-sender .chat-triangle{
    right:-16px;
    border-color:transparent transparent transparent #07C160;
  }
  /*聊天消息样式END*/
  /*评价功能*/
  .comment-chat-display{
    clear:both;
  }
  .comment-chat-content{
    clear: both;
    height: 192px;
    margin: 10px auto;
    color: #383838;
    background-color: #fff;
    max-width: 80%;
    min-height: 20px;
    padding: 10px;
    font-size: 15px;
    border-radius: 7px;
  }
  .comment-msg{
    display: block;
    padding-top: 5px;
    text-align: center;
    font-size: 12px;
  }
  /*评价功能END*/
  .jiedan{
    color:#e45a9b;
    width: 40%;
    padding:5px 20px;
    font-size: 14px;
    float: left;
    border:1px solid #e45a9b;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    margin-left: 10px;
  }
  .judan{
    color:#fff;
    width: 40%;
    padding:5px 20px;
    font-size: 14px;
    float: right;
    border:1px solid #e45a9b;
    text-align: center;
    line-height: 40px;
    background: #e45a9b;
    border-radius: 5px;
    margin-right: 10px;
  }
  .pingjia{
    font-size:0.6rem;width: 70px;margin: 0 auto;text-align: center;
    background: #07C160;
    line-height: 30px;
    color: #fff;
    border-radius: 30px;
  }
  textarea{
    margin-bottom: 5px;
  }
  select, textarea, input[type='text'], input[type='search'], input[type='password'], input[type='datetime'], input[type='datetime-local'], input[type='date'], input[type='month'], input[type='time'], input[type='week'], input[type='number'], input[type='email'], input[type='url'], input[type='tel'], input[type='color'] {
    line-height: 21px !important;
    width: 100%;
    height: 40px;
    margin-bottom: 0px !important;
    padding: 10px 15px;
    -webkit-user-select: text;
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 3px;
    outline: none;
    background-color: #fff;
    -webkit-appearance: none;
  }
</style>
