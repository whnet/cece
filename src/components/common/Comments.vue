<template>
  <div class="comment-layout">
      <div class="pre_title">最新评价</div>
      <div class="mui-card" v-if="comments.length > 0" v-for="(item, i) in comments">
        <div class="mui-card-header mui-card-media">
          <img class="servicehead" src="/static/images/default.jpg" />
          <div class="mui-media-body service-header">
            <p class="buy-name">{{ item.mid.nickname }}</p>
            <p class="service-name">已购买：{{ item.title }}</p>
          </div>
        </div>
        <div class="mui-card-content-inner">{{ item.comments}}</div>
        <div  class="author-footer">
          <div class="mui-card-footer mui-card-media">
            <img :src="item.teacher.mid.avatar" class="avatar-footer"/>
            <div class="mui-media-body des-footer">
              <p class="author-name">{{ item.teacher.realname }}</p>
              <p class="author-detail">{{ item.teacher.resume}}</p>
              <span class="author-price"></span>
              <router-link :to="{path:'/teacher/detail',query: {tid:item.teacher.id,pid:item.teacher.id}}">
              <button type="button"
                      class="button mui-btn mui-btn-success mui-btn-outlined zixun">立即咨询</button>
              </router-link>
              <!--<button @click="$router.push({ path:'teacher/detail', query: { tid:item.teacher.id,pid:item.teacher.id }})" type="button"-->
                      <!--class="button mui-btn mui-btn-success mui-btn-outlined zixun">立即咨询</button>-->
            </div>
          </div>
        </div>
      </div>
      <div class="mui-card no-comments" v-if="comments.length == 0">暂无评论</div>
  </div>
</template>

<script>
import cookie from '../../../static/js/cookie'
import { Divider } from 'vux'
export default {
  name: 'Comments',
  components: {
    Divider,
  },
  data () {
    return {
      id: this.$route.query.id,
      type: '',
      comments: [],
    }
  },
  mounted () {
    this.getComments();
  },
  methods: {
    isActive: function (name) {
      let urlname = this.$route.name ? this.$route.name : ''
      let patter = urlname.split('/')
      if (patter[0] === name) { return true }
      return false
    },
    getComments () {
        if(this.isActive('product')){
          this.type = 'product'
        }else if(this.isActive('teacher')){
          this.type = 'teacher'
        }
        return this.$api.comments(this.$route.query.pid,this.type).then(res => {
          this.comments = res.data
          if(res.data[0]){
            this.type = res.data[0].type
          }
        })
    }
  }
}
</script>

<style scoped>
  .comment-layout{
   margin-top:10px;
  }
  .mui-card {
    margin: 0 0 10px 0;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    background-color: white;
    background-clip: padding-box;
    box-shadow: 0 0px 0px rgba(0, 0, 0, .3);
  }
  .pre_title{
    text-align: left;
    height: 50px;
    background: #fff;
    line-height: 50px;
    color: #666;
    font-size: 14px;
    padding-left:10px;
    color: #6db57b;
  }
  .avatar-footer{
    border-radius: 100%;
    width: 40px;
    height: 40px;
  }
  .des-footer{
    margin-top:10px;
  }
  .mui-card-header img{
    border-radius: 50%;
    height: 35px;
    width: 35px;
  }
  .service-header{
    height: 30px!important;
    line-height: 30px!important;
  }
  .service-header p{
    color:#3A3A3A;
    font-weight: 400;
  }
  .buy-name{
    width:30%;
    float:left;
    text-align:left;
  }
  .service-name{
    float:right;
    width:50%;
    text-align:right;
  }
  .zixun{
    color:#45B97C;
    position: absolute;
    right: 20px;
    top: 10px;
    height: 25px;
    font-size: 12px;
    padding: 2px 4px;
    line-height: 1;
  }
  .author-name{
    font-size: 16px!important;
    color:#3A3A3A;
    font-weight: 400;
    position: relative;
    top: -7px;
    width: 40%;
  }
  .author-detail{
    color:#3A3A3A;
    font-weight: 400;
    margin-top:2px;
    width:15rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .author-price{
    position: absolute;
    bottom: 25px;
    font-size: 16px!important;
  }
  .author-footer{
    background-color: #F8F8F8;
    height: 75px!important;
  }
  .button{
    position: absolute;
    right:20px;
    bottom: 15px;
    top: 8px;
  }
  .mui-card-header:after, .mui-card-footer:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 0px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
  .mui-card-content-inner{
    padding: 0 15px 10px 15px;
  }
  .mui-card-header:after, .mui-card-footer:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 0px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
  .mui-card-header.mui-card-media {
    display: block;
    padding: 10px 15px 0px 15px;
  }
  .no-comments{
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #c8c7cc;
  }
</style>
