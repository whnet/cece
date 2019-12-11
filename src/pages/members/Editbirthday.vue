<template>
  <div class="ui-page-group">
    <div class="ui-page ui-page-current">
      <div class="ui-content">
        <div class="scroll_box">
          <div class="ui-search-input information-name">
            <input type="search" v-model="realname" placeholder="请输入姓名">
          </div>
          <div class="ui-cell sex_box">
            <div :class="[sex === '男' ? 'active' : '', 'sex_btn']" @click="changeSex('男')">先生</div>
            <div :class="[sex === '女' ? 'active' : '', 'sex_btn']" @click="changeSex('女')">女士</div>
          </div>
          <div class="information-day">
            <div class="ui-cell">
              <div class="ui-search-input ui-cell-primary" style="height: 100%;top: -8px;">
                <div class="ui-search-input use-timer year">
                  <datetime v-model="year" @on-change="change" :min-year=1900></datetime>
                </div>
              </div>
              <div class="ui-cell information-day-choose">
                <div :class="[type === '公历' ? 'active' : '', 'calendar']" @click="changeType('公历')">公历</div>
                <div :class="[type === '农历' ? 'active' : '', 'calendar']" @click="changeType('农历')">农历</div>
              </div>
            </div>
          </div>
          <div class="ui-search-input use-timer">
            <select v-model="seconds">
              <option>请选择出生时辰</option>
              <option value="0"  >不清楚时辰</option>
              <option value="00:00-00:59">00:00-00:59</option>
              <option value="01:00-01:59">01:00-01:59</option>
              <option value="02:00-02:59">02:00-02:59</option>
              <option value="03:00-03:59">03:00-03:59</option>
              <option value="04:00-04:59">04:00-04:59</option>
              <option value="05:00-05:59">05:00-05:59</option>
              <option value="06:00-06:59">06:00-06:59</option>
              <option value="07:00-07:59">07:00-07:59</option>
              <option value="08:00-08:59">08:00-08:59</option>
              <option value="09:00-09:59">09:00-09:59</option>
              <option value="10:00-10:59">10:00-10:59</option>
              <option value="11:00-11:59">11:00-11:59</option>
              <option value="12:00-12:59">12:00-12:59</option>
              <option value="13:00-13:59">13:00-13:59</option>
              <option value="14:00-14:59">14:00-14:59</option>
              <option value="15:00-15:59">15:00-15:59</option>
              <option value="16:00-16:59">16:00-16:59</option>
              <option value="17:00-17:59">17:00-17:59</option>
              <option value="18:00-18:59">18:00-18:59</option>
              <option value="19:00-19:59">19:00-19:59</option>
              <option value="20:00-20:59">20:00-20:59</option>
              <option value="21:00-21:59">21:00-21:59</option>
              <option value="22:00-22:59">22:00-22:59</option>
              <option value="23:00-23:59">23:00-23:59</option>
            </select>
          </div>
        </div>
        <div class="fixed_bottom">
          <div class="save_info" @click="query">保存</div>
          <p class="tips">以上信息绝对保密，请放心填写</p>
        </div>
      </div>
    </div>
    <sharenone></sharenone>
  </div>
</template>

<script>
import { Datetime } from 'vux'
import { mapGetters } from 'vuex'
import cookie from '../../../static/js/cookie'
export default {
  name: 'Editbirthday',
  components: {
    Datetime
  },
  computed: {
    ...mapGetters({
      setInfo: 'userInfo'
    })
  },
  created () {
    if(cookie.getCookie('token')) {
      this.getUserInfo()
    }
  },
  data () {
    return {
      avatar: sessionStorage.getItem('avatar'),
      realname: '',
      year: '2010-01-01',
      seconds: '请选择出生时辰',
      sex: '',
      type: '公历',
    }
  },
  methods: {
    change (value) {
      this.year = value
    },
    changeSex (value) {
      this.sex = value
    },
    changeType (value) {
      this.type = value
    },
    // 获得指定用户的信息
    getUserInfo: function () {
      let id = cookie.getCookie('mid');
      return this.$api.userInfo(id).then(res => {
        this.realname = res.data.realname
        this.type = res.data.type?res.data.type:'公历'
        this.year = res.data.year?res.data.year:'2010-01-01'
        this.sex = res.data.sex
        this.seconds = res.data.seconds?res.data.seconds:'请选择出生时辰'
      }).catch(err => {
        this.$vux.toast.text('请登录')
        return err
      })
    },
    query () {
      let data = {
        "type": this.type,
        "year": this.year,
        "realname": this.realname,
        "sex": this.sex,
        "seconds": this.seconds,
      }
      return this.$api.updateUserInfo(cookie.getCookie('mid'), data).then(res => {
        this.$vux.toast.text('成功')
        sessionStorage.setItem('nickname', res.data.nickname)
        setTimeout(() => {
          this.$router.back()
        }, 2000)
      }).catch(err => {
        this.$vux.toast.text('错误')
        return err
      })
    }
  }
}
</script>

<style scoped>
  @import '../../../static/bc/css/etui.css';
  @import '../../../static/bc/css/common.css';
  @import '../../../static/bc/css/edit_birthdate.css';
  .title{
    width:50%;
  }
  .price{
    width:20%;
  }
  .add{
    width:50%;
  }
  .year{
    height: 44px;
    text-align: center;
    line-height: 44px;
    border-radius: 0px;
    color: #B4B4B4;
    background: #fff;
  }
  .sex_box>div:first-of-type.active {
    background: rgb(69, 185, 124);
    border:none;
    color: #FFFFFF;
  }
  .information-day-choose>div:first-of-type.active {
    background: rgb(69, 185, 124);
    border:none;
    color: #FFFFFF;
  }
  .information-day .ui-cell {
    padding: 0;
    height: 50px;
    border:none;
    border-radius: 0px;
  }
  .save_info[data-v-4869bfe1] {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem auto 0;
    line-height: 1rem;
    text-align: center;
    background: rgb(69, 185, 124);
    color: #fff;
    font-size: 18px;
    border-radius: 3px;
    border:none;
  }
  .sex_box>div:last-of-type.active {
    background: rgb(69, 185, 124);
    border:none;
    color: #FFFFFF;
  }
  .information-name input{
    height: 2rem;
    border-color: #C6C6C6;
    border: none;
  }
  sex_box>div{
    width: 50%;
    text-align: center;
    margin-right: 0.5rem;
    border: 1px solid #C6C6C6;
    line-height: 2rem;
    border-radius: 5px;
    color: #B4B4B4;
    background: #fff;
    border: none;
  }
  .sex_box>div:last-of-type {
    margin-right: 0;
    border: none;
  }
  .sex_box>div{
    border:none;
  }
  .weui-cell_access .weui-cell__ft {
    padding-right: 13px;
    position: relative;
    bottom: 10px;
  }
  .weui-cell_access .weui-cell__ft{
    text-align: center;
  }
</style>
