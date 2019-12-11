<template>
  <div class="grid-swiper">
    <swiper dots-position="center" height="200px">
      <swiper-item v-for="(item, i) in Math.ceil(grid.length/8)" :key="i">
        <div class="type">
          <grid :cols="gridCols">
            <grid-item :label="item.title"
                       v-for="(item, index) in grid"
                       :link="'/teacher?type=' + item.id"
                       v-bind:index="index"
                       v-bind:key="item.id"
                       v-if=" index >= i*gridCols*2 && index < 8*i+8"
                       >
              <img slot="icon" :src="item.image">
            </grid-item>
          </grid>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem, Grid, GridItem } from 'vux'
import cookie from '../../static/js/cookie'
export default {
  name: 'gridSwiper',
  components: {
    Swiper,
    SwiperItem,
    Grid,
    GridItem
  },
  data () {
    return {
      gridCols: 4,
      grid: []
    }
  },
  mounted () {
    if(cookie.getCookie('token')) {
      this.grids()
    }
  },
  methods: {
    grids () {
      return this.$api.catogary().then(res => {
        this.grid = res.data || []
      })
    }
  }
}
</script>

<style scoped>
  .grid-swiper{
    background: #fff;
  }
  .grid-swiper /deep/ .vux-slider{
    height: 200px;
  }
  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }
  .type{
    padding-top:15px;
    padding-right:15px;
    padding-left:15px;
    padding-bottom:15px;
  }
  .grid-swiper /deep/ .vux-slider > .vux-indicator-center{
    bottom: 13px;
  }
  .weui-grids:before,.weui-grids:after{
    border:none;
  }
  .type /deep/ .weui-grid {
    position: relative;
    float: left;
    padding: 10px 0px;
    box-sizing: border-box;
  }
  .type /deep/ .weui-grid__icon{
    width: 35px;
    height: 35px;
  }
  .weui-grids {
    background-color: #fff;
  }
  .weui-grid:before {
    border: none;
  }
  .weui-grid:after {
    border: none;
  }
</style>
