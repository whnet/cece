<!--<template>-->
  <!--<div class="mui-card mui-card-comments">-->
    <!--<div class="mui-card-content">-->
      <!--<div class="mui-card-header comments-header"><span>全部评价</span></div>-->
      <!--<div class="mui-card-content">-->
        <!--<div class="comments" v-for="(item,i) in comments">-->
          <!--<div class="mui-card-header mui-card-media">-->
            <!--<img class="servicehead" :src="item.mid.avatar">-->
            <!--<div class="mui-media-body">-->
              <!--<div class="servicephone">-->
                <!--<p>{{item.mid.name}}</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="mui-card-content-inner">{{item.comments}}</div>-->
          <!--<div class="project">-->
            <!--<span class="buycourse">已购买：{{item.title}}</span>-->
            <!--<span class="date">{{ item.created}}</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import cookie from '../../../static/js/cookie'-->
  <!--export default {-->
    <!--name: 'Comments',-->
    <!--components: {-->
    <!--},-->
    <!--data () {-->
      <!--return {-->
        <!--id: this.$route.query.tid,-->
        <!--comments: [],-->
      <!--}-->
    <!--},-->
    <!--mounted () {-->
      <!--this.getComments();-->
    <!--},-->
    <!--methods: {-->
      <!--getComments () {-->
        <!--let type = this.$route.query.type-->
        <!--console.log(this.$route.query.tid)-->
        <!--return this.$api.comments(this.$route.query.tid,type,1).then(res => {-->
          <!--this.comments = res.data-->
        <!--})-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->
  <!--.mui-card{-->
    <!--margin:0;-->
  <!--}-->
  <!--.mui-card-comments{-->
    <!--margin-bottom:70px;-->
  <!--}-->
  <!--.project{-->
    <!--padding: 0px 15px;-->
    <!--height:30px;-->
  <!--}-->
  <!--.buycourse{-->
    <!--width: 50%;-->
    <!--float:left;-->
    <!--color: #666;-->
    <!--font-size: 12px;-->
  <!--}-->
  <!--.date{-->
    <!--width: 50%;-->
    <!--float:left;-->
    <!--text-align: right;-->
    <!--color: #666;-->
    <!--font-size: 12px;-->
  <!--}-->
  <!--.mui-card-content-inner{-->
    <!--color: #3A3A3A;-->
  <!--}-->
  <!--.seemore{-->
    <!--text-align: center;-->
    <!--color: #f3c583;-->
    <!--margin: 10px 0;-->
  <!--}-->
  <!--.comments-header > span{-->
    <!--color:#666666;-->
  <!--}-->
<!--</style>-->
