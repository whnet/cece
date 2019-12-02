<template>
  <div id="notice">
  <group>
    <cell title="公告">
      <marquee :direction='"down"' :interval= '5000'>
        <marquee-item v-for="(item, index) in notice" :key="index">
          <p @click="$router.push({path: '/teacher', query: {id: item.id}})">{{ item.title }}</p>
        </marquee-item>
      </marquee>
    </cell>
  </group>
  </div>
</template>

<script>
import { Group, GroupTitle, Marquee, MarqueeItem, Cell } from 'vux'
export default {
  components: {
    GroupTitle,
    Marquee,
    MarqueeItem,
    Group,
    Cell
  },
  data () {
    return {
      notice: []
    }
  },
  mounted () {
    this.getNotice({params: {'type': 2}})
  },
  methods: {
    getNotice (params) {
      return this.$api.advertisement(params).then(res => {
        this.notice = res.data || []
      })
    }
  }
}
</script>

<style scoped>
  .weui-cell{
    padding:15px;
    font-size:14px;
    color:red;
  }
  #notice /deep/ .vux-label {
    display: inline-block;
    word-wrap: break-word;
    word-break: break-all;
    font-size: 12px;
  }
  #notice /deep/ .vux-marquee-box li p{
    font-size:12px;
  }
  #notice /deep/ .weui-cells{
    margin-top: 10px;
  }
</style>
