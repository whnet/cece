<template>
  <swiper loop auto :interval=5000 :aspect-ratio="220/750">
    <swiper-item class="swiper-img"  v-for="(item, i) in swiper" :key="i">
      <img :src="item.image">
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'vux'
import cookie from '../../static/js/cookie'
export default {
  components: {
    Swiper,
    SwiperItem
  },
  data () {
    return {
      swiper: []
    }
  },
  created () {
    if(cookie.getCookie('token')) {
      this.getSwiper({'type': 1})
    }
  },
  methods: {
    getSwiper (params) {
      return this.$api.advertisement(params).then(res => {
        this.swiper = res.data || []
      })
    }
  }
}
</script>

<style scoped>
.swiper-img img {
  width: 100%;
}
</style>
