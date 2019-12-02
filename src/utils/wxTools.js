//微信分享
const wxShare = (obj, res, callback)=>{

        function getUrl(){
          var url = window.location.href;
          var locationurl = url.split('#')[0];
          return locationurl;
        }

        if(obj){
          var title = obj.title==undefined||obj.title==null?'深度':obj.title;
          var link = obj.link==undefined||obj.link==null?window.location.href:obj.link;
          var desc = obj.desc==undefined||obj.desc==null?'深度':obj.desc;
          var imgUrl = obj.imgUrl==undefined||obj.imgUrl==null?'src/img/share.png':obj.imgUrl;
          var debug = obj.debug==true?true:false;
        }else{
          alert('请传分享参数');
        }

      //微信分享

        var JssdkConfig = [];
            JssdkConfig.appId = res.data.result.appId;
            JssdkConfig.timestamp = res.data.result.timestamp;
            JssdkConfig.nonceStr = res.data.result.nonceStr;
            JssdkConfig.signature = res.data.result.signature;
            JssdkConfig.debug = debug;
            JssdkConfig.jsApiList= [
              'onMenuShareTimeline',//分享到朋友圈
              'onMenuShareAppMessage',//分享给朋友
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage',
            ]

        // 注入配置
        wx.config(JssdkConfig);

wx.ready(function () {
              //分享到朋友圈
            wx.onMenuShareTimeline({
                title:title, // 分享标题
                link: link, // 分享链接
                desc: desc, // 分享描述
                imgUrl:imgUrl, // 分享图标
                success: function () {
                  callback && callback();
                  // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                }
              });
              //分享到朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                  // 用户确认分享后执行的回调函数
                  callback && callback();
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                }
              });
})
  //微信分享 END
}
const wxChooseImage=(callbacks)=>{
  //图片上传
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      wx.uploadImage({
        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          var serverId = res.serverId; // 返回图片的服务器端ID
          callbacks.GetServerId && callbacks.GetServerId(serverId);
        }
      });
    }
  });
}
const wxUploadImage=(localId)=>{
  wx.uploadImage({
    localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
    isShowProgressTips: 1, // 默认为1，显示进度提示
    success: function (res) {
      var serverId = res.serverId; // 返回图片的服务器端ID
      return serverId;
    }
  });
}
const wxDownImage=()=>{
  wx.downloadImage({
    serverId: '', // 需要下载的图片的服务器端ID，由uploadImage接口获得
    isShowProgressTips: 1, // 默认为1，显示进度提示
    success: function (res) {
      var localId = res.localId; // 返回图片下载后的本地ID
    }
  });
}
export {wxShare,wxChooseImage,wxUploadImage,wxDownImage}
