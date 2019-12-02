export function init(rongyun_token, callbacks) {
  var appKey = "qf3d5gbjqhy6h";
  var token = rongyun_token;
  var RongIMClient = RongIMLib.RongIMClient;
  var config = {};
  /*
    重新部署后替换为新路径
    路径格式说明：不带http(s)://，为了自动从页面继承协议方便
    */
  config.protobuf =  "./static/rongyun/protobuf-2.3.1.min.js",
    //初始化
    RongIMClient.init(appKey,null,config);

  var instance = RongIMClient.getInstance();

  // 连接状态监听器
  RongIMClient.setConnectionStatusListener({
    onChanged: function(status) {
      console.log(status)
      switch (status) {
        case RongIMLib.ConnectionStatus["CONNECTED"]:
        case 0:
          console.log("连接成功");
          break;

        case RongIMLib.ConnectionStatus["CONNECTING"]:
        case 1:
          console.log("连接中");
          break;

        case RongIMLib.ConnectionStatus["DISCONNECTED"]:
        case 2:
          console.log("当前用户主动断开链接");
          break;

        case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
        case 3:
          console.log("网络不可用");
          break;

        case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
        case 4:
          console.log("未知原因，连接关闭");
          break;

        case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
        case 6:
          alert("用户账户在其他设备登录，本机会被踢掉线");
          break;

        case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
        case 12:
          console.log("当前运行域名错误，请检查安全域名配置");
          break;
      }
    }
  });

  //开始链接，得到用户的ID
  RongIMClient.connect(
    token, {
      onSuccess: function(userId) {
        console.log('rongyunjs='+ userId)
        callbacks.getCurrentUser && callbacks.getCurrentUser({userId: userId,});
      },
      onTokenIncorrect: function() {
        console.log("token无效");
      },
      onError: function(errorCode) {
        console.log(errorCode);
      }
    },
  );
  // 重新连接
  var callback = {
    onSuccess: function(userId) {
      callbacks.getCurrentUser && callbacks.getCurrentUser({userId: userId,});
      console.log('Reconnect successfully. ' + userId);
    },
    onTokenIncorrect: function() {
      console.log('token无效');
    },
    onError: function(errorCode){
      console.log(errorcode);
    }
  };
  var config = {
    // 默认 false, true 启用自动重连，启用则为必选参数
    auto: true,
    // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
    url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
    // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
    rate: [100, 1000, 3000, 6000, 10000]
  };
  RongIMClient.reconnect(callback, config);
  /*
      文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器
      注意事项：
          1：为了看到接收效果，需要另外一个用户向本用户发消息
          2：判断会话唯一性 ：conversationType + targetId
          3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
          4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
      */

  RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function(message) {
      // 判断消息类型
      // console.log("新消息: " + message.targetId);
      // console.log(message);
      // 判断消息类型
      switch (message.messageType) {
        case RongIMClient.MessageType.TextMessage:
          // message.content.content => 消息内容
          break;
        case RongIMClient.MessageType.VoiceMessage:
          // message.content.content 格式为 AMR 格式的 base64 码
          break;
        case RongIMClient.MessageType.ImageMessage:
          // message.content.content => 图片缩略图 base64。
          // message.content.imageUri => 原图 URL。
          break;
        case RongIMClient.MessageType.DiscussionNotificationMessage:
          // message.content.extension => 讨论组中的人员。
          break;
        case RongIMClient.MessageType.RichContentMessage:
          // message.content.content => 文本消息内容。
          // message.content.imageUri => 图片 base64。
          // message.content.url => 原图 URL。
          break;
      }
      callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
    }
  });
}
/*
* 获得历史消息
*/
export function getHistoryMessages(conversationtype, targetId, timestrap, count) {
  RongIMClient.getInstance().getHistoryMessages(conversationtype, targetId, timestrap, count, {
    onSuccess: function(list, hasMsg) {
      // hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
      // list 为拉取到的历史消息列表
    },
    onError: function(error) {
      // console.log(error)
      // APP未开启消息漫游或处理异常
      // throw new ERROR ......
    }
  });
}
/*
 * 对方输入的状态
 */
export function sendTypingStatus(targetId){
  var conversationType = RongIMLib.ConversationType.PRIVATE; // 只有单聊有正在输入状态
  var msgName = 'TextMessage'; //用户正在输入的消息类型 VoiceMessage等。
  var targetId = targetId;
  RongIMClient.getInstance().sendTypingStatusMessage(conversationType, targetId, msgName, {
    onSuccess: function (message) {
      console.log('typing');
    },
    onError: function (errorCode, message) {
      var info = '';
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时';
          break;
        case RongIMLib.ErrorCode.UNKNOWN:
          info = '未知错误';
          break;
      }
      console.log('发送失败:' + info + errorCode);
    }
  });
}
/*
 * 清空历史消息
 */
export function clearRemoteHistoryMessages(targetId) {
  /**
   conversationType: 会话类型

   targetId: 目标 Id

   timestamp: 清除时间点，message.sentTime <= timestamp 的消息将被清除 (message: 收发实时或者历史消息中有 sentTime 属性)
   timestamp 取值范围:  timestamp >=0 并且 timestamp <= 当前会话最后一条消息的 sentTime
   */
  var params = {
    conversationType: RongIMLib.ConversationType.PRIVATE, // 会话类型
    targetId: targetId, // 目标 Id
    timestamp: 0 // 清除时间点
  };
  RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
    onSuccess: function() {
      // 清除成功
    },
    onError: function(error) {
      // 请排查：单群聊消息云存储是否开通
      console.log(error);
    }
  });
}
/*
 * 使用发送文件消息，用来发送语音
 */
export function FileMessage(target, name, fileUrl, callbacks){
  var size = 1024,
    type = 'mp3';
  var msg = new RongIMLib.FileMessage({ name: name, size: size, type: type, fileUrl: fileUrl});
  var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
  var targetId = target; // 目标 Id
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: function (message) {
        //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        console.log("Send mp3");
        console.log("Send successfully:"+JSON.stringify(message));
        callbacks.sendMp3 && callbacks.sendMp3(message);
      },
    }
  );
}
/*
 图片消息
 */
export function ImageMessage(target, base64Str, imageUri, callbacks){
  /*
       图片转为可以使用 HTML5 的 FileReader 或者 canvas 也可以上传到后台进行转换。
       注意事项：
           1、缩略图必须是 base64 码的 jpg 图。
           2、不带前缀。
           3、大小建议不超过 100 K。
     */
    var msg = new RongIMLib.ImageMessage({content:base64Str,imageUri:imageUri});
    var conversationtype = RongIMLib.ConversationType.PRIVATE;
    var targetId = target;
    console.log('rongyun-conver:'+conversationtype)
    console.log('rongyun-targetId:'+targetId)
    console.log('rongyun-msg:'+msg)
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
        onSuccess: function (message) {
          callbacks.sendImage && callbacks.sendImage(message);
        }
      });
}
/*
 * 发送文本消息
 */
export function sendTextMsg(conversationtype, targetId, msg, callbacks) {
  RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
      onSuccess: function (message) {
        //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳，使用回调函数
        callbacks.sendMessage && callbacks.sendMessage(message); // 这样返回的是存文字
      },
      onError: function (errorCode,message) {
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
          default :
            info = x;
            break;
        }
        console.log('发送失败:' + info);
      }
    }
  );
}
