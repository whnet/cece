<template>
<div>
  <!--人气榜-->
<div class="bangdan"><divider>人气榜</divider></div>
  <div class="bang">
    <div class="bang-item" v-for="(item, i) in teacherRanks">
    <span class="mui-control-item" @click="$router.push({ path:'teacher/detail', query: { tid:item.id,pid:item.id }})">
      <div class="rank">
        <img class="img" :src="item.avatar">
        <p class="mui-badge rankCount">{{ i+1 }}</p>
      </div>
      <p class="name">{{ item.name }}</p>
    </span>
    </div>
  </div>
  <!--热推榜-->
  <div class="bangdan"><divider>热推榜</divider></div>
    <div class="bang">
      <div class="bang-item" v-for="(item, i) in teacherRecs">
        <span class="mui-control-item" @click="$router.push({ path:'teacher/detail', query: { tid:item.id,pid:item.id }})">
          <div class="rank">
            <img class="img" :src="item.avatar">
            <p class="mui-badge rankCount">{{ i+1 }}</p>
          </div>
          <p class="name">{{ item.name }}</p>
        </span>
      </div>
    </div>
  <!--新晋榜-->
  <div class="bangdan"><divider>新晋榜</divider></div>
    <div class="bang">
      <div class="bang-item" v-for="(item, i) in teacherNews">
    <span class="mui-control-item" @click="$router.push({ path:'teacher/detail', query: { tid:item.id,pid:item.id }})">
      <div class="rank">
        <img class="img" :src="item.avatar">
        <p class="mui-badge rankCount">{{ i+1 }}</p>
      </div>
      <p class="name">{{ item.name }}</p>
    </span>
      </div>
    </div>
</div>
</template>

<script>
import { Divider } from 'vux'
export default {
  components: {
    Divider,
  },
  data () {
    return {
      teacherRanks: [],
      teacherRecs: [],
      teacherNews: []
    }
  },
  mounted () {
    this.teacherRank({params: {'ordering': '-haopinglv'}})
    this.teacherRec({params: {'ordering': '-rec'}})
    this.teacherNew({params: {'ordering': '-updated'}})
  },
  methods: {
    teacherRank (params) {
      return this.$api.teacherbandan(params).then(res => {
        this.teacherRanks = res.data.results || []
      })
    },
    teacherRec (params) {
      return this.$api.teacherbandan(params).then(res => {
        this.teacherRecs = res.data.results || []
      })
    },
    teacherNew (params) {
      return this.$api.teacherbandan(params).then(res => {
        this.teacherNews = res.data.results || []
      })
    }
  }
}
</script>

<style scoped>
  .bang {
    height: 85px;
    position: relative;
    background:#fff;
    overflow:hidden
  }
  .bang-item {
    width: 20%;
    height: 80px;
    background-color: #fff;
    display:inline-block;
    float: left;
    text-align: center;
    overflow:hidden;
  }
  .bang img {
    width:50px;
    height:50px;
    border-radius:100%
  }
  .mui-control-item .name{
    line-height: 20px;
    color: #3A3A3A ;
    height: 20px;
  }
  .mui-control-item .img{
    border-radius:50%;
    width: 50px;
  }
  .bangdan{
    background:#fff;
    font-size: .75rem;
    text-align: center;
    margin-top: 10px;
    color: #3A3A3A;
    height: 35px;
    line-height: 35px;
  }

  .bang  > div:nth-child(1) > span > div > p{
    background-color:#FCB606;
  }
  .bang  > div:nth-child(2) > span > div > p{
    background-color:#91B9D2;
  }
  .bang  > div:nth-child(3) > span > div > p{
    background-color:#D4AD6C;
  }
  .rankCount{
    color: #FFFFFF;
    position: absolute;
    bottom:0px;
    right:5px;
    font-size: 0.6rem;
    background-color: #999999;
  }
  .rank{
    position: relative;
    height:56px;
  }
</style>
