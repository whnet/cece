<template>
    <div class="ui-page-group">
      <div class="ui-page ui-page-current">
          <div class="info-box">
            <div class="ui-cell list">
              <div>头衔</div>
              <div class="ui-cell-primary">
                <group>
                <selector placeholder="请选择头衔" :options="honorlist" v-model="honor"></selector>
                </group>
              </div>
            </div>
            <div class="ui-cell list">
              <div>微信</div>
              <div class="ui-cell-primary">
                <input type="text" v-model="wechat" class="changeInput" name="wechat" placeholder="请输入微信号"  />
              </div>
            </div>
            <div class="ui-cell list">
              <div>星座</div>
              <div class="ui-cell-primary">
                <group>
                <selector placeholder="请选择星座" :options="starlist" v-model="star"></selector>
                  </group>
              </div>
            </div>
            <div class="ui-cell list area">
              <div>地区</div>
              <div class="ui-cell-primary">
                <x-address title="" ref="address" placeholder="请选择地址" v-model="addressValue" raw-value :list="addressData" value-text-align="left"></x-address>
              </div>
            </div>
            <div class="ui-cell list">
              <div>性别</div>
              <div class="ui-cell-primary sex-box">
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="sexes" class="sex sex-man" value="男">
                  <div class="ui-item-media">
                    <i :class="[sexes === '男' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="sex('男')"></i>男</div>
                </label>
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="sexes" class="sex sex-girl"  value="女">
                  <div class="ui-item-media">
                    <i :class="[sexes === '女' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="sex('女')"></i>女</div>
                </label>
              </div>
            </div>
            <div class="ui-cell list">
              <div>血型</div>
              <div class="ui-cell-primary sex-box">
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="bloodtype" class="sex sex-man" name="sex" value="AB">
                  <div class="ui-item-media">
                    <i :class="[bloodtype === 'AB' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="checked('AB')" ></i>AB</div>
                </label>
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="bloodtype" class="sex sex-girl" name="sex" value="A">
                  <div class="ui-item-media">
                    <i :class="[bloodtype === 'A' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="checked('A')"></i>A</div>
                </label>
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="bloodtype" class="sex sex-girl" name="sex" value="B">
                  <div class="ui-item-media">
                    <i :class="[bloodtype === 'B' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="checked('B')"></i>B</div>
                </label>
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="bloodtype" class="sex sex-girl" name="sex" value="O">
                  <div class="ui-item-media">
                    <i :class="[bloodtype === 'O' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="checked('O')"></i>O</div>
                </label>
                <label class="ui-label-checkbox ui-item-content">
                  <input type="radio" v-model="bloodtype" class="sex sex-girl" name="sex" value="0">
                  <div class="ui-item-media">
                    <i :class="[bloodtype === '0' ? 'init-checked' : '', 'ui-icon', 'ui-icon-form-checkbox']"
                       @click="checked('0')"></i>不知道</div>
                </label>
              </div>
            </div>
            <div class="ui-cell textarea">
              <div class="ui-cell-lt textareas">经验</div>
              <div class="ui-cell-primary">
                <textarea class="changeInput"  v-model="experience" rows="4" cols="" placeholder="请填写经验"></textarea></div>
            </div>
            <div class="ui-cell textarea">
              <div class="ui-cell-lt textareas">介绍</div>
              <div class="ui-cell-primary">
                <textarea class="changeInput"  v-model="resume" rows="4" cols="" placeholder="请填写自我介绍"></textarea></div>
            </div>
            <div class="ui-cell list">
              <div>姓名</div>
              <div class="ui-cell-primary">
                <input type="text" v-model="realname" class="changeInput" name="realname" placeholder="请输入真实姓名，信息保密"  />
              </div>
            </div>
            <div class="ui-cell list" style="border-bottom: 1px solid #D9D9D9;">
              <div>手机</div>
              <div class="ui-cell-primary">
                <input type="tel" v-model="mobile" name="mobile" placeholder="请输入手机号码，信息保密"  />
              </div>
            </div>
            <div class="ui-cell textarea">
              <div>入驻类别<br/><span style="color:red;font-size:0.6rem">(最多五个)</span></div>
              <div class="ui-cell-primary ui-type">
                <checklist :options="typelist" v-model="type" :max=5></checklist>
              </div>
            </div>
          </div>
        <input class="btn sub" type="button" name="" id="" v-if="status == 2" value="等待审核"  :disabled="isDisable"/>
        <input class="btn sub" type="button" name="" id="" v-else-if="status == 3" @click="submit()" value="被驳回，重新认证"  :disabled="isDisable"/>
        <input class="btn sub" type="button" name="" id="" v-else-if="status == 1" @click="submit()" value="重新认证"  :disabled="isDisable"/>
        <input class="btn sub" type="button" name="" id=""v-else @click="submit()" value="认证"  :disabled="isDisable"/>
      </div>
      <sharenone></sharenone>
    </div>
</template>

<script>
import { Group, Selector, ChinaAddressData, XAddress, Checklist } from 'vux'
import { mapGetters } from 'vuex'
import cookie from '../../../static/js/cookie'
export default {
  name: 'Recrult',
  components: {
    Group,
    Checklist,
    Selector,
    ChinaAddressData,
    XAddress
  },
  data () {
    return {
      isDisable: false,
      id: 0,
      typelist: [],
      starlist: '',
      honorlist: '',
      bloodtype: '',
      sexes: '',
      numscart: '',
      realname: '',
      wechat: '',
      star: '',
      mobile: '',
      type: [],
      honor: '',
      experience: '',
      resume: '',
      userInfo: '',
      status: '-1',
      addressData: ChinaAddressData,
      addressValue: [],
    }
  },
  created () {
    this.getTeacherInfo()
    this.getCat()

    let starlist = [
      {key: '水瓶座', value: '水瓶座'},
      {key: '双鱼座', value: '双鱼座'},
      {key: '白羊座', value: '白羊座'},
      {key: '金牛座', value: '金牛座'},
      {key: '双子座', value: '双子座'},
      {key: '巨蟹座', value: '巨蟹座'},
      {key: '狮子座', value: '狮子座'},
      {key: '处女座', value: '处女座'},
      {key: '天秤座', value: '天秤座'},
      {key: '天蝎座', value: '天蝎座'},
      {key: '射手座', value: '射手座'},
      {key: '摩羯座', value: '摩羯座'},
      {key: '金牛座', value: '金牛座'},
      ]
    let honorlist = [
      {key: '心理咨询师', value: '心理咨询师'},
      {key: '塔罗师', value: '塔罗师'},
      {key: '占星师', value: '占星师'},
      {key: '魔法师', value: '魔法师'},
      {key: '星座达人', value: '星座达人'},
      {key: '周易师', value: '周易师'},
      ]

    this.honorlist = honorlist
    this.starlist = starlist
  },
  computed: {
    ...mapGetters({
      setInfo: 'userInfo'
    })
  },
  methods: {
    checked (val) {
      this.bloodtype = val
    },
    sex (val) {
      this.sexes = val
    },
    submit () {
      if(this.type.length == 0){
        this.$vux.toast.text('入驻类别最少选择一个')
        return
      }
      let datas = {
        "avatar": 'isempty',
        "category": this.type,
        "resume": this.resume,
        "rank": 0,
        "display": 0,
        "online": 0,
        "rec": 0,
        "honor": this.honor,
        "experience":  this.experience,
        "wechat": this.wechat,
        "telphone": this.mobile,
        "realname": this.realname,
        "bloodtype": this.bloodtype,
        "star": this.star,
        "sex": this.sexes,
        "status": 2,
        "numscart": this.numscart,
        "mid": cookie.getCookie('mid'),
        "area": this.$refs.address.nameValue
      }
      // 防止重复点击
      this.isDisable = true
      return this.$api.addOrUpdateTeacher(datas, this.id).then(res => {
        this.$vux.toast.text('请等待审核')
        setTimeout(() => {
          this.$router.push({ path: '/center' })
        }, 1000)
      })
    },
    // 得到类别分类
    getCat: function () {
      return this.$api.catogary().then(res => {
        let result = res.data;
        let typelist = [];
        for(var i=0;i<result.length;i++){
          typelist.push({key: result[i].id, value: result[i].title})
        }
        this.typelist = typelist

        if(result){
          this.id = result.id
        }
      })
    },
    // 判断是否是老师，且获取相应的信息
    getTeacherInfo: function () {
      let id = cookie.getCookie('mid');
      if(id){
        return this.$api.updateInfo(id).then(res => {
          let result = res.data.results[0];
          if(result){
            this.id = result.id
            this.realname = result.realname
            this.experience = result.experience
            this.honor = result.honor
            this.mobile = result.telphone
            this.wechat = result.wechat
            this.star = result.star
            this.numscart = result.numscart
            this.bloodtype = result.bloodtype
            this.resume = result.resume
            this.sexes = result.sex
            this.status = result.status
            this.addressValue = result.area.split(' ')
            this.category = result.type
            let typelist = [];
            for(var i=0;i<result.type.length;i++){
              typelist.push(result.type[i].id)
            }
            this.type = typelist
          }
        })
      }else{
        return this.$api.wechatAuth().then(res => {
          sessionStorage.setItem("url", this.$route.path);
          window.location.href = res.data.result
        })

      }
    }
  }
}
</script>

<style lang="css" scoped>
  @import '../../../static/bc/css/etui.css';
  @import '../../../static/bc/css/common.css';
  @import '../../../static/bc/css/recruit.css';
  .textareas{
    margin-right:10px;
  }
  .list{
    padding: 0 10px;
  }
  .list>div:first-of-type {
    margin-right: 0px;
  }
  .ui-cell, .ui-cell-noborder {
    padding: 0 10px;
  }
  .info-box{
    margin-top:0;
  }
  .ui-cell-primary /deep/ .weui-cell{
    padding: 0px 15px;
  }
  .ui-cell-primary /deep/ .weui-cells{
    margin-top: 1px;
    background-color: #FFFFFF;
    line-height: 0rem;
    font-size: 17px;
    overflow: hidden;
    position: relative;
  }
  .ui-cell-primary /deep/ .weui-cell_select .weui-cell__bd:after{
    top: 35%;
  }
  .ui-cell-primary /deep/ .weui-cells:before{
    border:none;
  }
  .ui-cell-primary /deep/ .weui-cells:after{
    border:none;
  }
  .ui-cell-primary /deep/ .weui-select{
    -webkit-appearance: none;
    border: 0;
    outline: 0;
    background-color: transparent;
    width: 100%;
    font-size: inherit;
    height: 35px;
    line-height: 15px;
    position: relative;
    z-index: 1;
    padding-left: 0px;
    font-size: 14px;
  }
  .wait-shenhe{
    width: 90%;
    margin: 0 auto;
    text-align: center;
    background: #a9a6a6;
    padding: 0.5rem 0;
    margin-top: 0.75rem;
    border-radius: 5px;
    color: #fff;
  }
  .ui-type /deep/ .weui-cell{
     padding: 5px 0px;
     width: 50%;
     float: left;
  }
  .sex-box{
    padding-left:10px;
  }
  .area /deep/ .vux-cell-value {
    color: #000;
  }
  .sub{
    margin-bottom: 15px;
    margin-left: 5%;
  }
  .btn{
    background:#6db57b;
  }
  .init-checked{
    border: none;
    background-color: #6db57b!important;
  }
  .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before{
    background-color: #6db57b!important;
  }
  .ui-cell-primary /deep/ .weui-cell:before{
    border:none;
  }
</style>

