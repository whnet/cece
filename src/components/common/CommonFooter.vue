<template>
  <div style="margin-top:60px">
    <div class="clear"></div>
    <nav class="mui-bar mui-bar-tab" id="footer">
      <div  class="mui-tab-item" :class="{'mui-active': isActive('home') }" @click="$router.push({path: '/'})">
        <i class="mui-icon iconfont icon-shouye"></i>
        <span class="mui-tab-label">首页</span>
      </div>
      <div class="mui-tab-item" :class="{'mui-active': isActive('product') }" @click="$router.push({path: '/product'})">
        <i class="mui-icon iconfont icon-sousuo"></i>
        <span class="mui-tab-label">逛逛</span>
      </div>
      <div  class="mui-tab-item" :class="{'mui-active': isActive('orders') }" @click="$router.push({path: '/myorders'})">
        <i class="mui-icon iconfont icon-shoucang"></i>
        <span class="mui-tab-label">订单</span>
      </div>
      <div class="mui-tab-item" :class="{'mui-active': isActive('center') }" @click="$router.push({path: '/center'})">
        <i class="mui-icon iconfont icon-wode"></i>
        <span class="mui-tab-label">我的</span>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cookie from '../../../static/js/cookie'
export default {
  name: 'CommonFooter',
  data () {
    return {
      isError: false,
      userInfo: '',
    }
  },
  created () {

  },
  computed: {
    ...mapGetters({
      setInfo: 'userInfo'
    })
  },
  methods: {
    isActive: function (name) {
      let urlname = this.$route.name ? this.$route.name : ''
      let patter = urlname.split('/')
      if (patter[0] === name) { return true }
      return false
    }
  }
}
</script>

<style scoped>
.iconfont{
  margin-bottom: 5px;
}
.mui-bar-tab .mui-tab-item.mui-active {
  color: #6db57b;
}
</style>
