<template>
  <div class="ui-page-group">
    <div class="ui-page ui-page-current">
      <div class="ui-content">
        <div class="ui-cells list-box">
          <a href="javascript:void(0);" id="head-pic-edits">
            <div class="ui-cell list-box-content" id="head-pic-edit">
              <div class="left-content">头像</div>
              <div class="ui-cell-primary right-icon">
                <span class="member-img">
                  <img  :src="avatar" :alt="nickname" />
                </span>
              </div>
              <div><i class="iconfont icon-iconfontyoujiantou-copy-copy-copy-copy"></i></div>
            </div>
          </a>
          <input @change="upAvatar" id="upAvatar" name="files" accept="image/*" type="file">

          <div class="ui-cell list-box-content" @click="edit()">
            <div class="left-content">昵称</div>
            <div class="ui-cell-primary right-icon">
              <span>{{nickname}}</span>
            </div>
            <div><i class="iconfont icon-iconfontyoujiantou-copy-copy-copy-copy"></i></div>
          </div>
        </div>
      </div>
      <div class="sign_out ui-cell-noborder" style="display:none">
        <a href="javascript:;" @click="loginOut()">遇到错误，点击此处</a>
      </div>
    </div>
    <!--修改弹出框-->
    <div :style="{ display: display }">
      <div class="fade"></div>
      <div class="succ-pop">
        <div class="content">
          <p class="tctitle">修改昵称</p>
          <input class="tc_ingput project" type="text" v-model="nickname" placeholder="昵称">
        </div>
        <div class="button">
          <span class="cancel" @click="cancel()">取消</span>
          <span class="query" @click="query()">确认</span>
        </div>
      </div>
    </div>
    <!--修改弹出框-->
    <sharenone></sharenone>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cookie from '../../../static/js/cookie'
export default {
  name: 'Info',
  computed: {
    ...mapGetters({
      setInfo: 'userInfo'
    })
  },
  data () {
    return {
      display:'none',
      avatar: sessionStorage.getItem('avatar'),
      nickname: sessionStorage.getItem('nickname'),
      file: ''
    }
  },
  methods: {
    upAvatar: function(e) {
      let that = this;
      let file = e.target.files[0];
      let param = new FormData();
      param.append('files',file,file.name);
      return this.$api.upload(param).then(res => {
        this.avatar = res.data.host + res.data.file
        let data = {
          "avatar": this.avatar,
          "update_status": 1,
        }
        return this.$api.updateUserInfo(cookie.getCookie('mid'), data).then(res => {
          sessionStorage.setItem('avatar', this.avatar)
          this.$vux.toast.text('成功')
        }).catch(err => {
          this.$vux.toast.text('错误')
          return err
        })
      })
    },
    edit: function(){
      this.display = 'block'
    },
    cancel: function(){
      this.display = 'none'
    },
    query: function(){
      let data = {
        "nickname": this.nickname,
      }
      return this.$api.updateUserInfo(cookie.getCookie('mid'), data).then(res => {
        this.$vux.toast.text('成功')
        this.display = 'none'
        sessionStorage.setItem('nickname',this.nickname)
      })
    },
    loginOut: function(){
      cookie.delCookie('token')
      cookie.delCookie('nickname')
      sessionStorage.clear()
      this.$router.push({ path: '/' })
    },
  }
}
</script>

<style scoped>
  @import '../../../static/bc/css/etui.css';
  @import '../../../static/bc/css/common.css';
  @import '../../../static/bc/css/info.css';
  #upAvatar{
    position: absolute;
    top: 15px;
    left: 75px;
    border: 1px solid;
    height: 47px;
    background-color:transparent;
    border:0;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
  }
  .tag_ingput{
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-left:none;
  }
  /*灰色遮罩层*/
  .tctitle {
    text-align: center;
    font-size: 16px;
    margin:10px 0;
  }
  .fade{
    width:100%;
    height:100%;
    background:rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
  }
  /*弹出层*/
  .succ-pop{
    width: 300px;
    height: auto;
    background: #fff;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -125px;
    z-index: 999;
    border-radius: 5px;
    padding:10px 20px;
  }
  .succ-pop h3.title{
    text-align: center;
    font-size: 22px;
    color: #ce002c;
  }

  .tc_ingput{
    font-size: 14px;
    border:1px solid #f2f2f2;
    margin-bottom:1rem
  }
  .cancel {
    float:left;
    width:46%;
    text-align:center;
    padding:10px;
    background: #f2f2f2;
  }
  .query{
    float: right;
    width: 46%;
    text-align: center;
    padding: 10px;
    color: #fff;
    background: #6db57b;
  }
</style>
