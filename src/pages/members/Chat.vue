<template>
  <div class="mui-content" v-wechat-title="this.detailtitle">
    <div class="msg-content" :style="{'height': msgHeight}" @scroll.passive="loadMore($event)">
      <div id="msg-rongyun-content" class="msg-rongyun-content">
        <p class="chat-history-date" v-if="more == 1 && msgContent.length > 5">没有更多消息</p>
        <div v-if="duifangInfo">
        <div class="chat-sender" v-if="order.mid && mid && order.mid == mid">
          <div class="chat-avatar">
            <img :src="sendInfo.avatar">
          </div>
          <div class="chat-content">
            <div class="chat-triangle"></div>
            <span>老师好，拍下了 {{ order.title }}~</span>
          </div>
        </div>
        <div v-if="order.mid && duifangInfo.id && order.mid == duifangInfo.id">
          <div class="chat-receiver">
            <div class="chat-avatar">
              <img :src="duifangInfo.avatar">
            </div>
            <div class="chat-content">
              <div class="chat-triangle"></div>
              <span >老师好，拍下了 {{ order.title }}~</span>
            </div>
          </div>
          <div class="tohandle" v-if="status == 1">
            <span class="jiedan" @click="jiedan(1)">接单</span>
            <span class="judan" @click="jiedan(0)">拒单</span>
          </div>
        </div>
        <div class="chat-sender" v-if="item.senderUserId == userId" v-for="(item, key) in msgContent">
          <div class="chat-avatar">
            <img :src="sendInfo.avatar">
          </div>
          <div class="chat-content" style="background:#fff" v-if="item.messageType == 'ImageMessage' ">
            <span><img :src="item.content" class="lager-image"></span>
          </div>
          <div class="chat-content"  v-if="item.messageType == 'TextMessage' ">
            <div class="chat-triangle"></div>
            <span>{{item.content}}</span>
          </div>
        </div>

        <div class="chat-receiver" v-else>
          <div class="chat-avatar">
            <img :src="duifangInfo.avatar">
          </div>
          <div class="chat-content" style="background:#fff" v-if="item.messageType == 'ImageMessage' ">
            <span><img :src="item.content" class="lager-image"></span>
          </div>
          <div class="chat-content"  v-if="item.messageType == 'TextMessage' ">
            <div class="chat-triangle"></div>
            <span>{{item.content}}</span>
          </div>
        </div>
        </div>

      </div>
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
        <p class="comment-msg"><divider>服务已结束，如对您有帮助，请谢谢老师：</divider></p>
        <div class="comment-chat-content">
          <div class="ganxie" @click="ganxie" v-if="ganxieStatus == 0">谢谢老师</div>
          <div class="ganxie" style="color:#171212"  v-else>已感谢</div>
          <textarea class="content" placeholder="对老师或这次服务说点什么" v-model="comment"></textarea>
          <div class="pingjia" @click="submitComment()" v-if="order.comments == '' ">提交</div>
          <div class="pingjia" v-else>已评价</div>
        </div>
      </div>
      <!--评价功能END-->
      <!--聊天样式END -->
    </div>
    <div class="wait-order" id="footer" v-if="status == 1">等待接单</div>
    <div class="wait-order" id="footer" v-if="status == 4 || status == 5">订单已结束</div>
    <ul class="im-face" v-if="symbols">
      <li :title="item.symbol" @click="setEmoji(item.symbol)" v-for="(item, key) in emojilist">
        <span>{{ item.emoji }}</span>
      </li>
    </ul>

    <group id="footer" v-if="status == 3" style="background: #fff;">
      <form action="javascript:;">
        <input type="text" id="input" placeholder="输入内容" v-model="sendMsg" v-reset-page
               @keyup.enter="enter()" ref="inputs" autocomplete="off" autofocus="autofocus"></input>
        <x-button slot="right" style="font-size:12px" mini @click.native="send">发送</x-button>
      </form>
      <div class="chat-tool">
        <span style="font-size:24px;" class="icon iconfont icon-icon_im_face" @click="emoji()"></span>
        <span style="font-size:27px;" class="icon iconfont icon-icon_photo"  @click="WxUploadeImg()"></span>
        <span  style="font-size:27px;margin-top: -3px;" class="icon iconfont icon-shezhi1" @click="settings()"></span>
      </div>
    </group>
    <div class="wait-order" id="footer" v-if="status == 0">初始化</div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-if="order.teacher == tid" v-model="showMenus" show-cancel
                   @on-click-menu-jieshu="jieshu()">
      </actionsheet>
      <actionsheet :menus="usermenu" v-else v-model="showMenus" show-cancel
                   @on-click-menu-tousu="tousu()" @on-click-menu-ziliao="ziliao()">
      </actionsheet>
    </div>
    <sharenone></sharenone>
  </div>
</template>

<script>
  import * as _ from '../../utils/tools'
  import { wxChooseImage } from '../../utils/wxTools'
  import * as utils from '../../utils/rongyun'
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
  import { XHeader, ViewBox, XInput, Group, XButton, Cell, Divider, Actionsheet, TransferDom, dateFormat } from 'vux'
  var count = 0;
  export default {
    directives: {
      TransferDom
    },
    filters: {
      dateFormat
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
    },
    data () {
      return {
        userId:'',
        detailtitle:'',
        qiniu_host: config.Qiniu_HOST,
        qiniu_upload_host: config.Qiniu_upload_host,
        qiniu_token:'',
        symbols: false,
        emojilist: '',
        count: 0,
        more: 0,
        status: 0,
        orderid: this.$route.query.orderid,
        targetId: sessionStorage.getItem("targetId"),
        RongYun: '',
        order: [],
        mid: 0,
        tid: cookie.getCookie('tid'),
        comment: '',
        sendMsg: '',
        sendInfo: [],
        duifangInfo: [],
        msgContent: [],
        msgHeight: 0,
        ganxieStatus: 0,
        showMenus: false,
        loadcontent: false,
        menus: {
          jieshu: '结束订单',
        },
        usermenu: {
          tousu: '建议反馈',
          ziliao: '发送我的资料',
        },
      }
    },
    computed: {
      ...mapGetters({
        setInfo: 'userInfo'
      })
    },
    created () {
      if(cookie.getCookie('token')) {
        this.$vux.loading.show({text: '正在连接服务'})
        this.getOrderInfo()
      }
    },
    mounted () {
      let footer = document.getElementById('footer').offsetHeight
      this.msgHeight = (document.documentElement.clientHeight - footer - 60) + 'px'
    },
    methods: {
      // 得到这个订单的具体信息，从而找到mid_id, tomid_idmyordertaking
      getOrderInfo: function () {
        return this.$api.orderdetail(this.$route.query.orderid).then(res => {
          let mid = cookie.getCookie('mid')
          this.status = res.data.status
          this.mid = mid
          this.comment = res.data.comments
          this.getUserInfo(mid,2)
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
          // 迁移到
            let token = cookie.getCookie('token')
            if (token === null) {
              sessionStorage.setItem("url", this.$route.path);
              this.getWechatAuth()
            }else{
              // 判断是老师还是学生
              if(res.data.mid == mid){
                //学生
                let userId = res.data.mid+res.data.out_trade_no
                let userName = res.data.mid+res.data.out_trade_no
                this.userId = userId
                sessionStorage.setItem("targetId", res.data.tomember+res.data.out_trade_no)
                this.getRongYunToken(userId,userName)
              }else if(res.data.tomember == mid){
                // 老师
                let userId = res.data.tomember+res.data.out_trade_no
                let userName = res.data.tomember+res.data.out_trade_no
                this.userId = userId
                sessionStorage.setItem("targetId", res.data.mid+res.data.out_trade_no)
                this.getRongYunToken(userId,userName)
              }

              if(sessionStorage.getItem("yunToken")){
                this.startInit()
              }
            }
            this.$nextTick(function () {
              document.getElementById("msg-rongyun-content").scrollIntoView(false);
            })
          // 迁移到END
        })
      },
      // 得到融云的token
      getRongYunToken: function (userId,userName) {
        // 聊天对方的信息，格式为 mid + out_trade_no + tomember(非老师的按照0补位)
        let data = {
          'userId': userId,
          'userName': userName,
          'avatar': sessionStorage.getItem("avatar"),
        }
        let yunToken = sessionStorage.getItem("yunToken")

        if(typeof(yunToken) == "undefined" || yunToken == null){
          return this.$api.rongyun(data).then(res => {
            sessionStorage.setItem("yunToken", res.data.token, 3600*24*7)
            this.startInit()
            this.RongYun = res.data
          }).catch(err => {
            return err
          })
        }
      },
      // 初始化融云
      startInit: function () {
        const that = this
        let rongyun_token = sessionStorage.getItem("yunToken")
        let orderid = this.$route.query.orderid
        if(rongyun_token == null){
          console.log('TOKEN为空')
          return false;
        }

        let callbacks = {
          getCurrentUser(userInfo) {
            console.log("链接成功；userid=" + userInfo.userId)
            that.getHistoryMessages();
          },
          receiveNewMessage(msg) {
            // 将对方发送的信息push到历史消息中，这样实现数据驱动，现在历史消息是object，使用SendMessage 注意
            let history = that.msgContent //changeMessage
            let message = that.SendMessage(msg)
            that.msgContent = history.concat(message)
            that.$nextTick(function () {
              document.getElementById("msg-rongyun-content").scrollIntoView(false);
            })
          },
        };
        utils.init(rongyun_token, callbacks)
      },
      setEmoji: function (symbol) {
        this.sendMsg = this.sendMsg.concat(symbol);
        this.symbols = false;
      },
      changeMessage: function (list) {
        var arr = []
        for (let i in list) {
          let o = {};
          if(list[i]['content']['messageName'] == 'FileMessage'){
            o['content'] = list[i]['content']['fileUrl'];
          }else if(list[i]['content']['messageName'] == 'ImageMessage'){
            o['content'] = list[i]['content']['imageUri'];
          }else if(list[i]['content']['messageName'] == 'TextMessage'){
            o['content'] = RongIMLib.RongIMEmoji.symbolToEmoji(list[i]['content']['content']);
          }
          o['messageType'] = list[i]['messageType'];
          o['senderUserId'] = list[i]['senderUserId'];
          o['targetId'] = list[i]['targetId'];
          o['receivedTime'] = list[i]['receivedTime'];
          arr.push(o)
        }
        return arr;
      },
      changeMp3: function(list){
        var arr = []
        let o = {};
        o['content'] = list['content']['fileUrl'];
        o['messageType'] = list['messageType'];
        o['senderUserId'] = list['senderUserId'];
        o['targetId'] = list['targetId'];
        o['receivedTime'] = list['receivedTime'];
        arr.push(o)
        return arr;
      },
      SendMessage: function (list) {
        var arr = []
        let o = {};
        if(list['content']['messageName'] == 'FileMessage'){
          o['content'] = list['content']['fileUrl'];
        }else if(list['content']['messageName'] == 'ImageMessage'){
          o['content'] = list['content']['imageUri'];
        }else{
          o['content'] = RongIMLib.RongIMEmoji.symbolToEmoji(list['content']['content']);
        }
        o['messageType'] = list['messageType'];
        o['senderUserId'] = list['senderUserId'];
        o['targetId'] = list['targetId'];
        o['receivedTime'] = list['receivedTime'];
        arr.push(o)
        return arr;
      },
      changeSendImageMessage: function (list) {
        var arr = []
        let o = {};
        o['content'] = list['content']['imageUri'];
        // o['imageUri'] = list['content']['imageUri'];
        o['messageType'] = list['messageType'];
        o['senderUserId'] = list['senderUserId'];
        o['targetId'] = list['targetId'];
        o['receivedTime'] = list['receivedTime'];
        arr.push(o)
        return arr;
      },
      loadMore: function(event) {
        let scrollHeight =  event.target.scrollHeight;
        let scrollTop =  event.target.scrollTop;
        let clientHeight = event.target.clientHeight;
        let count = 0;
        if(scrollTop == 0){
          this.count = this.count + 1;
          this.getHistoryMessages();
        }
      },
      enter: function () {
        this.sendMsg = ''
        document.getElementById("input").focus();
      },
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
          "status": 5,
        }
        return this.$api.comment(this.$route.query.orderid,data).then(res => {
          this.$vux.toast.text('提交成功')
        }).catch(err => {
          return err
        })
      },
      getHistoryMessages: function () {
        const that = this
        let conversationType = RongIMLib.ConversationType.PRIVATE
        let targetId = sessionStorage.getItem("targetId")
        let timestrap = null;
        let count = 20;
        RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
          onSuccess: function(list, hasMsg) {
            that.loadcontent = true
            if(list && list.length > 0){
              let history = that.msgContent
              let arrlist = that.changeMessage(list)
              that.msgContent = arrlist.concat(history)
              that.$vux.loading.hide()
              that.$nextTick(function () {
                if(that.count == 0){
                  that.$vux.loading.hide()
                  document.getElementById("msg-rongyun-content").scrollIntoView(false);
                }
              })
            }else{
              that.$vux.loading.hide()
              that.more = 1;
            }
          },
          onError: function(error) {
            console.log("GetHistoryMessages,errorcode:" + error);
          }
        });
      },
      // 得到对方用户的信息，自己的信息是从localstore中存放的：openid 和 avatar，传入相应的ID
      getUserInfo: function (id,type) {
        return this.$api.userInfo(id).then(res => {
          if(type == 1){
            this.duifangInfo = res.data
            // 聊天对方的信息，格式为 orderid + openid
            this.detailtitle = res.data.nickname
          }else if(type == 2){
            this.sendInfo = {'openid': res.data.openid, 'avatar': res.data.avatar}
          }
        })
      },
      // 发送图片
      TosendImage: function (base64Str, imageUri) {
        let that = this
        let targetId = sessionStorage.getItem("targetId")
        let callbacks = {
          sendImage(message) {
            let msg = that.changeSendImageMessage(message);
            that.msgContent = that.msgContent.concat(msg)
          }
        }
        // 缩略图必须很小，或者直接使用直接在在线img url
        utils.ImageMessage(targetId, imageUri, imageUri, callbacks)
      },
      // 发送文本消息
      sendTextMsg: function () {
        const that = this
        if(this.sendMsg.split(" ").join("").length == 0){
          this.$vux.toast.text('不能发送空内容！')
          return;
        }
        let msg = new RongIMLib.TextMessage({content:this.sendMsg});
        let conversationtype = RongIMLib.ConversationType.PRIVATE;
        let targetId = sessionStorage.getItem("targetId")

        let callbacks = {
          sendMessage(msg) {
            let message = that.SendMessage(msg);
            console.log('自己发送的消息:' + message)
            let history = that.msgContent
            that.msgContent = history.concat(message)
            that.$nextTick(function () {
              document.getElementById("msg-rongyun-content").scrollIntoView(false);
            })
          }
        }
        utils.sendTextMsg(conversationtype, targetId, msg, callbacks)
        this.sendMsg = ''
      },
      // 发送消息
      ziliao: function(){
        // 实时的请求数据，返回后把消息压入到消息中
        return this.$api.ziliao(1).then(res => {
          if(res.data.realname && res.data.sex && res.data.year && res.data.type && res.data.seconds){
            const that = this
            let ziliao = 'hi 我的资料：'+res.data.realname+'、'+res.data.sex+'、'+res.data.year+res.data.type+'、'+res.data.seconds
            let msg = new RongIMLib.TextMessage({content:ziliao});
            let conversationtype = RongIMLib.ConversationType.PRIVATE;
            let targetId = sessionStorage.getItem("targetId")
            let callbacks = {
              sendMessage(msg) {
                let message = that.SendMessage(msg);
                let history = that.msgContent
                that.msgContent = history.concat(message)
                that.$nextTick(function () {
                  document.getElementById("msg-rongyun-content").scrollIntoView(false);
                })
              }
            }
            utils.sendTextMsg(conversationtype, targetId, msg, callbacks)
          }else{
            this.$vux.toast.text('亲还没有完整填写资料哦，请在我的-我的资料里进行修改后，再次发送')
          }

        })
      },
      // 清除历史消息
      clearRemoteHistoryMessages: function () {
        let targetId = sessionStorage.getItem("targetId")//对方的openid
        utils.clearRemoteHistoryMessages(targetId)
      },
      getWechatAuth: function () {
        return this.$api.wechatAuth().then(res => {
          window.location.href = res.data.result
        })
      },

      settings () {
        this.showMenus = true
      },
      clear () {
        this.$vux.toast.text('已清空聊天记录')
        this.clearRemoteHistoryMessages()
      },
      tousu () {
        this.$vux.toast.text('请联系客服')
      },
      jieshu () {
        let data = {
          'status': 4,
        }
        return this.$api.order(data,this.$route.query.orderid).then(res => {
          this.$vux.toast.text('订单结束')
          this.status = 4
          this.$api.notifyWechat({openid:this.duifangInfo.openid,url:window.location.href,type:'end',title:this.order.title})
          window.location.href = '/#/myordertaking'
        })
      },
      emoji: function () {
        RongIMLib.RongIMEmoji.init();
        let emojilist = RongIMLib.RongIMEmoji.list;
        this.emojilist = emojilist

        if(this.symbols == true){
          this.symbols = false
        }else if(this.symbols == false){
          this.symbols = true
        }

      },
      jiedan (id) {
        if(id == 1){
          let data = {'status': 3,}
          return this.$api.order(data,this.$route.query.orderid).then(res => {
            this.$vux.toast.text('已接单')
            this.status = 3
            this.$api.notifyWechat({openid:this.duifangInfo.openid,url:window.location.href,type:'start',title:this.order.title})
          })
        }else{
          let data = {'status': 6,}
          return this.$api.order(data,this.$route.query.orderid).then(res => {
            this.$vux.toast.text('已拒单')
            this.$api.notifyWechat({openid:this.duifangInfo.openid,url:window.location.href,type:'拒单',title:this.order.title})
            // 返回到 接单页面
            window.location.href = '/#/myordertaking'
          })
        }
      },
      send () {
        this.sendTextMsg()
      },
      WxUploadeImg(){
        let that = this
        return that.$api.jssdk({'url':''}).then(res => {
          let callbacks = {
            GetServerId(serverId) {
              // 获得微信服务器上的serverID，让后调用接口，fetch到七牛云上
              that.$api.qiniu({'media_id':serverId}).then(res => {
                let domain = that.qiniu_upload_host
                let thumbnail = 'data:image/jpg;base64,';
                let sourceLink = domain +"/"+ res.data.key
                if(sourceLink){
                  that.TosendImage(thumbnail, sourceLink)
                }
              })
            }
          }
          wxChooseImage(callbacks);
        })
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
    height: 50px;
    position: relative;
    top: 30px;
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
    /*overflow-y: scroll;*/
  }
  .mui-content /deep/ .weui-cells:before{
    border:none;
  }
  .mui-content /deep/ .weui-cells{
    background-color: #fbf9fe;
    line-height: 1.41176471;
    font-size: 17px;
    overflow: hidden;
    position: fixed;
    width:100%;
    height: 95px;
    bottom: 0px;
    margin:0;
  }
  .mui-content{
    -webkit-overflow-scrolling: touch
  }
  .msg-content{
    margin-top:0px;
    -webkit-overflow-scrolling: touch
  }
  .mui-content /deep/ .vux-header{
    position: fixed;
    z-index:9999;
    width:100%;
    top:0;
  }
  .mui-content /deep/ .weui-btn_mini{
    display: inline-block;
    height: 40px;
    font-size: 14px;
    margin-top:0px;
  }
  .mui-content /deep/ .weui-btn_default{
    color: #fff;
    background-color: #07C160;
    border:none;
    float:right;
    margin-top:5px;
    margin-right:10px;
  }
  .weui-cell {
    padding: 5px 15px 0px 15px;
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
  .mui-content /deep/ .weui-btn:before{
    border:none
  }
  .mui-content /deep/ .weui-input{
    border:none;
    margin:0;
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
    width: 75%;
    height: 40px;
    padding: 10px 15px;
    -webkit-user-select: text;
    border: none;
    border-radius: 0px;
    outline: none;
    background-color: #fff;
    -webkit-appearance: none;
    font-size:14px;
    float:left;
    margin-top:5px;
    margin-left:15px;
    margin-bottom: 15px;
  }
  /*聊天消息样式*/
  .chat-history-date{
    display: block;
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
    border-radius: 5px;
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
    height: 150px;
    margin: 0px auto;
    color: #383838;
    background-color: #fff;
    max-width: 80%;
    min-height: 20px;
    font-size: 15px;
    border-radius: 7px;
    padding: 0 10px;
  }
  .comment-msg{
    display: block;
    padding-top: 5px;
    text-align: center;
    font-size: 12px;
  }
  /*评价功能END*/
  .jiedan{
    color:#6db57b;
    width: 35%;
    padding:5px 20px;
    font-size: 14px;
    float: left;
    border:1px solid #6db57b;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    margin-left: 10%;
    background: #6db57b;
    color:#fff!important;
  }
  .judan{
    width: 35%;
    padding:5px 20px;
    font-size: 14px;
    float: right;
    border:1px solid #6db57b;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    margin-right: 10%;
  }
  .pingjia{
    font-size: 13px;
    width: 60px;
    margin: 0 auto;
    text-align: center;
    color: #333;
    border-radius: 30px;
    position: relative;
    top: 33px;
    padding: 3px;
  }
  .ganxie{
    background:#c8c7cc;
    font-size: 13px;
    width: 60px;
    margin: 0 auto;
    text-align: center;
    border-radius: 30px;
    position: relative;
    top: 15px;
    padding: 3px;
  }
  textarea{
    margin-bottom: 5px;
  }
  .chat-tool{
    clear:both;
  }
  .chat-tool span{
    position: relative;
    margin: 0 0 0 20px;
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top;
    font-size: 20px;
    cursor: pointer;
    width: 22px;
    height: 22px;
    line-height: 22px;
  }
  .layui-icon {
    font-family: layui-icon!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .im-face{
    position: absolute;
    bottom: 4rem;
    background: #fff;
    padding: 15px 0;
    height: 200px;
    overflow-y: scroll;
  }
  .im-face li{
    float: left;
    padding: 2px 10px;
  }
  #msg-rongyun-content span {
    min-height: 22px;
    line-height: 22px;
    border-radius: 3px;
    color: #333;
    word-break: break-all;
  }
  #file{
    position: absolute;
    width: 22px;
    height: 22px;
    font-size: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .01;
    filter: Alpha(opacity=1);
    cursor: pointer;
  }
  .wait-order{
    position: absolute;
    bottom: 0px;
    text-align: center;
    width: 100%;
    background: #fff;
    height: 40px;
    line-height: 40px;
  }
  #msg-rongyun-content .chat-sender span{
    color:#fff;
  }
  .tohandle{
    position: absolute;
    bottom: 5rem;
    width: 100%;
  }
</style>
